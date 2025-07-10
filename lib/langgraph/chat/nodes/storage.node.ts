import {AgentState} from "@/lib/langgraph/chat/types/agent";
import {StorageService} from "@/lib/langgraph/chat/services/storage.service";


const storageSevice = new StorageService();
export async function storeLatestChat(state: AgentState): Promise<Partial<AgentState>> {
    await storageSevice.saveChatHistory(state.pdfId,state.question,state.finalAnswer)

    return {}
}