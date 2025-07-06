import {auth} from "@/auth";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";
import PDFCatalogView from "@/components/PDFCatalogView";

export default async function Home() {
    const session: Session = await auth() as Session;
    console.log(session)


    return (
        <div className={"flex flex-col gap-3"}>
            {!session ?
                (
                    <div>
                        Need to Login First
                    </div>
                ) : (
                    <PDFCatalogView />
                )
            }
        </div>
    );
}
