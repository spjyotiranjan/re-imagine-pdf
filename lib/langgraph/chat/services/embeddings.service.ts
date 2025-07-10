import { OpenAIEmbeddings } from "@langchain/openai";
import { cosineSimilarity } from "@/lib/langgraph/chat/utils/similarity";

export class EmbeddingsService {
    private embeddings: OpenAIEmbeddings;

    constructor() {
        this.embeddings = new OpenAIEmbeddings()
    }

    async embedQuery(text: string): Promise<number[]> {
        return await this.embeddings.embedQuery(text);
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        return await this.embeddings.embedDocuments(documents);
    }

    async checkChatHistoryRelevance(
        question: string,
        chatHistory: [string, string][],
        threshold: number = 0.70
    ): Promise<{ isRelevant: boolean; maxScore: number }> {
        const questionEmbedding = await this.embedQuery(question);
        const pastQuestions = chatHistory.map(([q]) => q);
        const pastEmbeddings = await this.embedDocuments(pastQuestions)


        const scores = pastEmbeddings.map((embedding) =>
            cosineSimilarity(questionEmbedding, embedding)
        );

        const maxScore = Math.max(...scores);
        console.log(`Similarity Score with Chat History: ${maxScore}`);

        return {
            isRelevant: maxScore > threshold,
            maxScore
        };
    }
}