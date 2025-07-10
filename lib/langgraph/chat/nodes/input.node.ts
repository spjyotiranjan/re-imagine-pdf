import { AgentState } from "@/lib/langgraph/chat/types/agent";
import {AIMessage, HumanMessage} from "@langchain/core/messages";

export async function processInputNode(state: AgentState): Promise<Partial<AgentState>> {
    const { messages } = state;
    const question = messages[messages.length - 1]?.content as string;


    if (!question?.trim()) {
        throw new Error("Invalid or empty question.");
    }

    const chatHistory: [string, string][] = [];
    for (let i = 0; i < messages.length - 1; i += 2) {
        const userMessage = new HumanMessage(messages[i].content as string);
        const assistantMessage = new AIMessage(messages[i + 1].content as string);

        if (userMessage.getType() === "human" && assistantMessage.getType() === "ai") {
            chatHistory.push([userMessage.content as string, assistantMessage.content as string]);
        }
    }
    return {
        question: question as string,
        chatHistory,
    };
}