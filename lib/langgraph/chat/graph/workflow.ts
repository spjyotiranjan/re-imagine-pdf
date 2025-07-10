import {StateGraph, END, START, Annotation} from "@langchain/langgraph";
import { AgentState } from "@/lib/langgraph/chat/types/agent";
import { processInputNode } from "@/lib/langgraph/chat/nodes/input.node";
import { retrieveContextNode } from "@/lib/langgraph/chat/nodes/retrieval.node";
import { checkRelevanceNode } from "@/lib/langgraph/chat/nodes/relevance.node";
import { generateResponseNode } from "@/lib/langgraph/chat/nodes/generation.node";
import { handleIrrelevantNode } from "@/lib/langgraph/chat/nodes/error.node";
import {storeLatestChat} from "@/lib/langgraph/chat/nodes/storage.node";

const AgentStateAnnotation = Annotation.Root({
    messages: Annotation<any[]>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    question: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    pdfId: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    chatHistory: Annotation<[string, string][]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    context: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    isRelevantToPDF: Annotation<boolean>({
        reducer: (x, y) => y ?? x,
        default: () => false,
    }),
    isRelevantToChat: Annotation<boolean>({
        reducer: (x, y) => y ?? x,
        default: () => false,
    }),
    finalAnswer: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    retrievedDocs: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    similarity: Annotation<{ pdfScore: number; chatScore: number }>({
        reducer: (x, y) => ({ ...x, ...y }),
        default: () => ({ pdfScore: 0, chatScore: 0 }),
    }),
})

function shouldContinue(state: AgentState): string {
    const { isRelevantToPDF, isRelevantToChat } = state;

    if (!isRelevantToPDF && !isRelevantToChat) {
        return "handleIrrelevant";
    }

    return "generateResponse";
}

export function createWorkflow() {
    const workflow = new StateGraph(AgentStateAnnotation);
    workflow.addNode("processInput", processInputNode);
    workflow.addNode("retrieveContext", retrieveContextNode);
    workflow.addNode("checkRelevance", checkRelevanceNode);
    workflow.addNode("generateResponse", generateResponseNode);
    workflow.addNode("handleIrrelevant", handleIrrelevantNode);
    workflow.addNode("storeLatestChat",storeLatestChat)

    // @ts-ignore
    workflow.addEdge(START, "processInput");
    // @ts-ignore
    workflow.addEdge("processInput", "retrieveContext");
    // @ts-ignore
    workflow.addEdge("retrieveContext", "checkRelevance");
    // @ts-ignore
    workflow.addConditionalEdges("checkRelevance", shouldContinue, {
        generateResponse: "generateResponse",
        handleIrrelevant: "handleIrrelevant",
    });
    //@ts-ignore
    workflow.addEdge("generateResponse", "storeLatestChat");
    // @ts-ignore
    workflow.addEdge("storeLatestChat", END);
    // @ts-ignore
    workflow.addEdge("handleIrrelevant", END);
    return workflow.compile()

}
