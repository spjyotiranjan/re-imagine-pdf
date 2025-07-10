import {BaseMessage} from "@langchain/core/messages";

export interface AgentState {
    messages: BaseMessage[];
    question: string;
    pdfId: string;
    chatHistory: [string, string][];
    context: string;
    isRelevantToPDF: boolean;
    isRelevantToChat: boolean;
    finalAnswer: string;
    retrievedDocs?: DocumentType[];
    similarity?: {
        pdfScore: number;
        chatScore: number;
    };
}

export interface DocumentType {
    pageContent: string;
    metadata: Record<string, any>;
}

export interface ChatConfig {
    model: string;
    temperature: number;
    maxTokens?: number;
    topK: number;
    similarityThreshold: number;
    maxResponseWords: number;
}