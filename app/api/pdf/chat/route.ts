import { NextRequest, NextResponse } from "next/server";
import { createWorkflow } from "@/lib/langgraph/chat/graph/workflow";
import { AgentState } from "@/lib/langgraph/chat/types/agent";
import { RunnableConfig } from "@langchain/core/runnables";

const app = createWorkflow();
const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const {messages, pdfId} = body;

        const question = messages[messages.length - 1]?.content;
        if (!question?.trim()) {
            return new NextResponse("Invalid or empty question.", {status: 400});
        }
        const initialState: AgentState = {
            messages,
            question,
            pdfId,
            chatHistory: messages,
            context: "",
            isRelevantToPDF: false,
            isRelevantToChat: false,
            finalAnswer: "",
        };

        const config: RunnableConfig = {
            configurable: {
                thread_id: `chat-${pdfId}`,
            },
        };

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const result = await app.invoke(initialState, config);
                    const finalAnswer = result.finalAnswer;

                    // Stream response
                    for (const char of finalAnswer) {
                        controller.enqueue(encoder.encode(char));
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }

                    controller.close();
                } catch (err) {
                    console.error("LangGraph stream error:", err);
                    controller.error(err);
                }
            },
        });
        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    }catch (error){
        console.error("API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}