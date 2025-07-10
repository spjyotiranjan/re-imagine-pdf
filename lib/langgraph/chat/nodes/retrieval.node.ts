import { AgentState } from "@/lib/langgraph/chat/types/agent";
import { VectorService } from "@/lib/langgraph/chat/services/vector.service";
import { EmbeddingsService } from "@/lib/langgraph/chat/services/embeddings.service";
import { chatConfig } from "@/lib/langgraph/chat/config/chat.config";

const vectorService = new VectorService();
const embeddingsService = new EmbeddingsService();

export async function retrieveContextNode(state: AgentState): Promise<Partial<AgentState>> {
    const { question, pdfId } = state;

    const queryVector = await embeddingsService.embedQuery(question);
    const { documents, avgScore } = await vectorService.retrieveDocuments(
        queryVector,
        pdfId,
        chatConfig.topK
    );

    const context = documents.map(doc => doc.pageContent).join('\n\n');

    return {
        context,
        retrievedDocs: documents,
        similarity: {
            chatScore: state.similarity?.chatScore || 0,
            pdfScore: avgScore,
        }
    };
}
