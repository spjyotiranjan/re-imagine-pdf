import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {writeClient} from "@/sanity/lib/writeClient";
import {JinaEmbeddings} from "@langchain/community/embeddings/jina";


function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    if (normA === 0 || normB === 0) return 0;
    return dot / (normA * normB);
}
const embeddings = new OpenAIEmbeddings();
// const embeddings = new JinaEmbeddings({model: "jina-clip-v2"})
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
const pc = pineconeIndex.namespace("pdf")
const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    streaming: true,
    temperature: 0.2,
});
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You're an AI assistant. Only answer within 50 words based on the provided PDF and chat context.\n\n Context: {context} \n\n If you are unsure or if answering makes you think outside of the context even if it is related to context, say you don't know but don't give response outside the context or chat history. give in markdown decorated format."],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
]);
const encoder = new TextEncoder();

async function isContextuallyInChatHistory(
    question: string,
    chatHistory: [string, string][],
    embedder: OpenAIEmbeddings | JinaEmbeddings,
): Promise<boolean> {
    const questionEmbedding = await embedder.embedQuery(question);
    for (const [pastQuestion] of chatHistory) {
        const pastEmbedding = await embedder.embedQuery(pastQuestion);
        const score = cosineSimilarity(questionEmbedding, pastEmbedding);
        console.log("Similarity Score with Chat History: " + score);
        if (score > 0.70) return true;
    }
    return false;
}


export async function POST(req: NextRequest) {
    const body = await req.json();
    const { messages, pdfId } = body;

    const question = messages[messages.length - 1]?.content;
    console.log(question)
    if (!question?.trim()) {
        return new NextResponse("Invalid or empty question.", { status: 400 });
    }
    const chatHistory: [string, string][] = [];

    for (let i = 0; i < messages.length - 1; i += 2) {
        if (messages[i]?.role === "user" && messages[i + 1]?.role === "assistant") {
            chatHistory.push([messages[i].content, messages[i + 1].content]);
        }
    }

    const allResults = await pc.query({
        topK: 100,
        vector: await embeddings.embedQuery(question),
        filter: { pdfId },
        includeMetadata: true
    });
    const allDocs = allResults.matches.map(match => ({
        pageContent: match.metadata?.text || "",
        metadata: match.metadata || {},
    }));
    const sortedMatches = allResults.matches
        .filter(match => match.score !== undefined)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));


    const top4Scores = sortedMatches.slice(0, 4).map(match => {
        console.log(JSON.stringify(match, null, 2))
        return match.score ?? 0

    });
    const avgTop4Score =
        top4Scores.length > 0
            ? top4Scores.reduce((sum, s) => sum + s, 0) / top4Scores.length
            : 0;
    console.log("Similarity Score with PDF: " + avgTop4Score);
    const isRelevantToPDF = avgTop4Score >= 0.70;
    const isRelevantToChat = await isContextuallyInChatHistory(question, chatHistory, embeddings);

    if (!isRelevantToPDF && !isRelevantToChat) {
        return new NextResponse("Your question doesn’t relate to this document or the prior conversation. Please ask question related to it.");
    }


    const chain = RunnableSequence.from([
        {
            input: async () => question,
            chat_history: async () =>
                chatHistory.flatMap(([q, a]) => [
                    new HumanMessage(q),
                    new AIMessage(a),
                ]),
            context: ()=> allDocs.map(doc => doc.pageContent).join('\n\n'),
        },
        prompt,
        llm,
    ]);
    const answerTokens: string[] = [];
    const stream = new ReadableStream({
        async start(controller) {
            try {
                await chain.invoke(
                    {
                        input: allDocs.map((doc) => doc.pageContent).join("\n\n") + "\n\n" + question,
                        chat_history: chatHistory,
                    },
                    {
                        callbacks: [
                            {
                                handleLLMNewToken(token) {
                                    answerTokens.push(token);
                                    controller.enqueue(encoder.encode(token));
                                },
                                handleLLMEnd() {
                                    controller.close();
                                },
                                handleLLMError(err) {
                                    controller.error(err);
                                },
                            },
                        ],
                    }
                );

                await writeClient.patch(pdfId)
                    .setIfMissing({ chatHistory: [] })
                    .append("chatHistory", [
                        {
                            _type: "object",
                            question,
                            answer: answerTokens.join(""),
                            timestamp: new Date().toISOString(),
                            _key: crypto.randomUUID(),
                        }])
                    .commit();
            } catch (err) {
                console.error("LangChain stream error:", err);
                controller.error(err);
            }
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
        },
    });
}