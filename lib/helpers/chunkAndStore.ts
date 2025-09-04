import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import {PineconeStore} from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";

export const    chunkAndStorePdfWithPageIntelligence = async ({
                                                               file,
                                                               sanityId,
                                                               pineconeIndexName,
                                                           }: {
    file: Blob;
    sanityId: string;
    pineconeIndexName: string;
}) => {
    // Load PDF as individual pages
    const loader = new PDFLoader(file, { splitPages: true });
    const pageDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });


    const finalDocs: Document[] = [];

    for (const pageDoc of pageDocs) {
        const pageNumber = pageDoc.metadata?.loc?.pageNumber || 1;

        const chunks = await splitter.splitDocuments([pageDoc]);

        const labeledChunks = chunks.map(
            (chunk) =>
                new Document({
                    pageContent: `Content from Page ${pageNumber}:\n\n${chunk.pageContent}`,
                    metadata: { pdfId: sanityId,text: `Content from Page ${pageNumber}:\n\n${chunk.pageContent}`, pageNum: pageNumber },
                })
        );

        finalDocs.push(...labeledChunks);
    }

    // Init Pinecone index
    const pinecone = new Pinecone();
    const index = pinecone.Index(pineconeIndexName);

    // Store to Pinecone
    await PineconeStore.fromDocuments(finalDocs, new OpenAIEmbeddings(), {
        namespace: "pdf",
        pineconeIndex: index,
    });

    return { storedChunks: finalDocs.length };
};
