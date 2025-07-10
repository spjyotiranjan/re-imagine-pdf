import { Pinecone } from "@pinecone-database/pinecone";
import { DocumentType } from "@/lib/langgraph/chat/types/agent";
import { calculateAverageScore } from "@/lib/langgraph/chat/utils/similarity";

export class VectorService {
    private pinecone: Pinecone;
    private index: any;
    private namespace: any;

    constructor() {
        this.pinecone = new Pinecone();
        this.index = this.pinecone.Index(process.env.PINECONE_INDEX!);
        this.namespace = this.index.namespace("pdf");
    }

    async retrieveDocuments(
        query: number[],
        pdfId: string,
        topK: number = 10
    ): Promise<{ documents: DocumentType[]; avgScore: number }> {
        const results = await this.namespace.query({
            topK,
            vector: query,
            filter: { pdfId },
            includeMetadata: true
        });

        const documents = results.matches.map((match: any) => ({
            pageContent: match.metadata?.text || "",
            metadata: match.metadata || {},
        }));

        const sortedMatches = results.matches
            .filter((match: any) => match.score !== undefined)
            .sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0));

        const top4Scores = sortedMatches.slice(0, 4).map((match: any) => {
            return match.score ?? 0;
        });

        const avgScore = calculateAverageScore(top4Scores);
        console.log(`Similarity Score with PDF: ${avgScore}`);

        return { documents, avgScore };
    }
}