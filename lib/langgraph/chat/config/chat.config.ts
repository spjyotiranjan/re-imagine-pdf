import {ChatConfig} from "@/lib/langgraph/chat/types/agent";

export const chatConfig: ChatConfig = {
    model: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 1000,
    topK: 10,
    similarityThreshold: 0.70,
    maxResponseWords: 150,
};