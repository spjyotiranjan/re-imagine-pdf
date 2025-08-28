import React from 'react';
import Link from "next/link";
import PDFDeleteIcon from "@/components/PDFDeleteIcon";
import UploadForm from "@/components/uploadForm";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";
import {auth} from "@/auth";
import {client} from "@/sanity/lib/client";
import {USER_BY_ID_QUERY} from "@/sanity/lib/query";
import {sanityFetch, SanityLive} from "@/sanity/lib/live";

const PDFCatalogView = async () => {
    const session: Session = await auth() as Session;
    const res = await sanityFetch({query: USER_BY_ID_QUERY,params: {id: session.id}});
    const user = res.data
    return (
        <div>
            <h1>All Documents</h1>
            <div className={"grid grid-cols-5 gap-3"}>
                {user?.library?.map((doc: any) =>
                    <div className={"gray-container h-fit min-h-20 flex items-center justify-between px-[2%]"} key={doc._id}>
                        <Link key={doc._id} href={`/pdf/${doc._id}`} className={"text-lg w-[88%] flex items-center"}>
                            <p className={"break-all w-full"}>
                                {doc.name}
                            </p>
                        </Link>
                        <PDFDeleteIcon userId={session?.id} pdfId={doc._id} />
                    </div>)}

                <UploadForm id={session.id}/>
            </div>

            <SanityLive />
        </div>
    );
};

export default PDFCatalogView;
