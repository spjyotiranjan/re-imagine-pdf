import React from 'react';
import Link from "next/link";
import PDFDeleteIcon from "@/components/PDFDeleteIcon";
import UploadForm from "@/components/uploadForm";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";
import {auth} from "@/auth";
import {client} from "@/sanity/lib/client";
import {USER_BY_ID_QUERY} from "@/sanity/lib/query";

const PDFCatalogView = async () => {
    const session: Session = await auth() as Session;
    const user = await client.fetch(USER_BY_ID_QUERY, {id: session?.id});
    return (
        <div>
            <h1>All Documents</h1>
            <div className={"grid grid-cols-5 gap-3"}>
                {user?.library?.map((doc: any) =>
                    <div className={"gray-container"} key={doc._id}>
                        <Link key={doc._id} href={`/pdf/${doc._id}`} className={"h-18 text-lg w-full overflow-x-clip flex justify-center items-center"}>
                            {doc.name}
                        </Link>
                        <PDFDeleteIcon userId={session?.id} pdfId={doc._id} />
                    </div>)}

                <UploadForm id={session.id}/>
            </div>
        </div>
    );
};

export default PDFCatalogView;
