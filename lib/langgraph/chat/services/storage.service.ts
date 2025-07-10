import { writeClient } from "@/sanity/lib/writeClient";

export class StorageService {
    async saveChatHistory(
        pdfId: string,
        question: string,
        answer: string
    ): Promise<void> {
        await writeClient.patch(pdfId)
            .setIfMissing({ chatHistory: [] })
            .append("chatHistory", [
                {
                    _type: "object",
                    question,
                    answer,
                    timestamp: new Date().toISOString(),
                    _key: crypto.randomUUID(),
                }
            ])
            .commit();
    }
}