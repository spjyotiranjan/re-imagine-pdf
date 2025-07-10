import { AgentState } from "@/lib/langgraph/chat/types/agent";
import { EmbeddingsService } from "@/lib/langgraph/chat/services/embeddings.service";
import { chatConfig } from "@/lib/langgraph/chat/config/chat.config";

const embeddingsService = new EmbeddingsService();

export async function checkRelevanceNode(state: AgentState): Promise<Partial<AgentState>> {
    const { question, chatHistory, similarity } = state;

    const isRelevantToPDF = (similarity?.pdfScore ?? 0) >= chatConfig.similarityThreshold;

    const { isRelevant: isRelevantToChat, maxScore } = await embeddingsService.checkChatHistoryRelevance(
        question,
        chatHistory,
        chatConfig.similarityThreshold
    );

    return {
        isRelevantToPDF,
        isRelevantToChat,
        similarity: {
            pdfScore: similarity?.pdfScore ?? 0,
            chatScore: maxScore,
        }
    };
}