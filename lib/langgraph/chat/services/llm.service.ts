import { ChatOpenAI } from "@langchain/openai";
import {ChatPromptTemplate, MessagesPlaceholder, PromptTemplate} from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatConfig } from "@/lib/langgraph/chat/types/agent";
import {StructuredOutputParser} from "langchain/output_parsers";
import {z, ZodNumber, ZodObject} from "zod";
import {RunnableSequence} from "@langchain/core/runnables";


export class LlmService {
    private llm: ChatOpenAI;
    private prompt: ChatPromptTemplate;
    private parser: StructuredOutputParser<ZodObject<{ page_number: ZodNumber }>>
    private parsingChain: RunnableSequence

    constructor(config: ChatConfig) {
        this.llm = new ChatOpenAI({
            model: config.model,
            streaming: true,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
        });

        this.prompt = ChatPromptTemplate.fromMessages([
            ["system", `You're an AI assistant. Only answer within ${config.maxResponseWords} words based on the provided PDF and chat context.

Context: {context}

If you are unsure or if answering makes you think outside of the context even if it is related to context, inform you don't know in a professiobnal way but don't give response outside the context or chat history. Keep the output short and crisp with formatting. Give in decorated markdown format with proper headings, text forms such as bold, italics, and proper layout as professional as it should be.`],
                new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);
        this.parser = StructuredOutputParser.fromZodSchema(
            z.object({
                page_number: z.number().describe("Extracted page number from the prompt, or 0 if not present in the prompt"),
            })
        )
        this.parsingChain = RunnableSequence.from([
            PromptTemplate.fromTemplate(
                `Analyze the prompt below and extract:
    - The page number referenced (return 0 if not present)
    - A short summary of the prompt
    
    Prompt: {prompt}
    {format_instructions}`
            ),
            new ChatOpenAI({ temperature: 0,model: config.model }),
            StructuredOutputParser.fromZodSchema(
                z.object({
                    page_number: z.number().describe("Extracted page number from the prompt, or 0 if not present in the prompt"),
                })
            )
        ]);
    }

    async generateResponse(
        question: string,
        context: string,
        chatHistory: [string, string][]
    ): Promise<string> {
        const historyMessages = chatHistory.flatMap(([q, a]) => [
            new HumanMessage(q),
            new AIMessage(a),
        ]);

        const response = await this.prompt.pipe(this.llm).invoke({
            context,
            input: question,
            chat_history: historyMessages,
        });

        return response.content as string;
    }

    async getPageNum(promptText: String) {
        return await this.parsingChain.invoke({
            prompt: promptText,
            format_instructions: this.parser.getFormatInstructions(),
        });
    }

}