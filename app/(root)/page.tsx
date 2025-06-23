import {auth} from "@/auth";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";
import {USER_BY_ID_QUERY} from "@/sanity/lib/query";
import {client} from "@/sanity/lib/client";
import {USER_BY_GITHUB_ID_QUERYResult} from "@/sanity/types";
import Link from "next/link";
import UploadForm from "@/components/uploadForm";

export default async function Home() {
    const session: Session = await auth() as Session;
    const user = await client.fetch(USER_BY_ID_QUERY, {id: session?.id}) as USER_BY_GITHUB_ID_QUERYResult;
    return (
        <div className={"flex flex-col gap-3"}>
            <h1>All Documents</h1>
            <div className={"grid grid-cols-5 gap-3"}>
                {user?.library?.map((doc: any) => <Link key={doc._id} href={`/pdf/${doc._id}`}
                                                 className={"h-24 overflow-x-clip gray-container flex justify-center items-center"}>{doc.name}</Link>)}

                <UploadForm id={session.id}/>
            </div>
        </div>
    );
}
