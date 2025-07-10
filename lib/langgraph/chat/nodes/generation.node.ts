// nodes/generation.node.ts
import { AgentState } from "@/lib/langgraph/chat/types/agent";
import { LlmService } from "@/lib/langgraph/chat/services/llm.service";
import { chatConfig } from "@/lib/langgraph/chat/config/chat.config";

const llmService = new LlmService(chatConfig);

export async function generateResponseNode(state: AgentState): Promise<Partial<AgentState>> {
    const { question, context, chatHistory } = state;

    const response = await llmService.generateResponse(question, context, chatHistory);

    return {
        finalAnswer: response,
    };
}
