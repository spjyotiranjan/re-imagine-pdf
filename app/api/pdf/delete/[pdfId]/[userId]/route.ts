import {NextRequest, NextResponse} from "next/server";
import {Pinecone} from "@pinecone-database/pinecone";
import {client} from "@/sanity/lib/client";
import {writeClient} from "@/sanity/lib/writeClient";

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
const pc = pineconeIndex.namespace("pdf")

export async function DELETE(req: NextRequest, {params}: { params: Promise<{ pdfId: string,userId: string }> }) {
    const {pdfId,userId} = await params;

    try {
        const { matches } = await pc.query({
            topK: 10000,
            vector: Array(1536).fill(0),
            filter: { pdfId },
            includeMetadata: false,
        });

        const matchedIds = matches.map((match) => match.id);
        console.log("Matched IDs:", matchedIds);

        if (matchedIds.length) {
            await pc.deleteMany(matchedIds);
            console.log("Pinecone data deleted.");
        }
        const doc = await client.getDocument(pdfId);

        if (!doc) {
            console.error("Document not found.");
            return;
        }
        await writeClient
            .patch(userId)
            .unset([
                `library[_ref == "${pdfId}"]`
            ])
            .commit();


        const assetRef = doc.file?.asset?._ref;

        await writeClient.delete(pdfId);
        console.log("Document deleted.");

        if (assetRef) {
            await writeClient.delete(assetRef);
            console.log("Asset deleted.");
        } else {
            console.warn("No asset to delete.");
        }


        return NextResponse.json({message: `PDF with ID ${pdfId} deleted successfully`}, {status: 200});
    }catch (error: any) {
        console.error("Delete failed:", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }


}