import { AgentState } from "@/lib/langgraph/chat/types/agent";

export async function handleIrrelevantNode(state: AgentState): Promise<Partial<AgentState>> {
    return {
        finalAnswer: "Your question doesn't relate to this document or the prior conversation. Please ask question related to it.",
    };
}