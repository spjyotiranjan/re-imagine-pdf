import {NextResponse} from "next/server";
import {client} from "@/sanity/lib/client";
import {writeClient} from "@/sanity/lib/writeClient";
import {USER_BY_ID_QUERY} from "@/sanity/lib/query";
import {chunkAndStorePdfWithPageIntelligence} from "@/lib/helpers/chunkAndStore";


export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    // Upload to Sanity
    const asset = await writeClient.assets.upload("file", buffer, {
        filename: file.name,
        contentType: "application/pdf",
    });

    // Create a document entry pointing to the asset
    const doc = await writeClient.create({
        _type: "pdf",
        name: file.name,
        file: {
            asset: {
                _ref: asset._id,
                _type: "reference",
            },
        },
        chatHistory: []
    });


    await writeClient.patch(userId).append("library", [
        {
            _type: "reference",
            _ref: doc._id,
            _key: doc._id,
        }
    ]).commit()

    const result = await chunkAndStorePdfWithPageIntelligence({
        file,
        sanityId: doc._id,
        pineconeIndexName: process.env.PINECONE_INDEX!,
    });


    return NextResponse.json({ storedChunks:result,sanityId: doc._id });
}