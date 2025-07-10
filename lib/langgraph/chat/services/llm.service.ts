import { ChatOpenAI } from "@langchain/openai";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatConfig } from "@/lib/langgraph/chat/types/agent";

export class LlmService {
    private llm: ChatOpenAI;
    private prompt: ChatPromptTemplate;

    constructor(config: ChatConfig) {
        this.llm = new ChatOpenAI({
            model: config.model,
            streaming: true,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
        });

        this.prompt = ChatPromptTemplate.fromMessages([
            ["system", `You're an AI assistant. Only answer within ${config.maxResponseWords} words based on the provided PDF and chat context.

Context: {context}

If you are unsure or if answering makes you think outside of the context even if it is related to context, say you don't know but don't give response outside the context or chat history. Keep the output short and crisp with formatting. Give in decorated markdown format with proper headings, text forms such as bold, italics, and proper layout as professional as it should be.`],
                new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);
    }

    async generateResponse(
        question: string,
        context: string,
        chatHistory: [string, string][]
    ): Promise<string> {
        const historyMessages = chatHistory.flatMap(([q, a]) => [
            new HumanMessage(q),
            new AIMessage(a),
        ]);

        const response = await this.prompt.pipe(this.llm).invoke({
            context,
            input: question,
            chat_history: historyMessages,
        });

        return response.content as string;
    }
}