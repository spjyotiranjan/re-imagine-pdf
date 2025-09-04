import {auth} from "@/auth";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";
import PDFCatalogView from "@/components/PDFCatalogView";

export const metadata = {
    title: 'Home - PDF Buddy',
    description: 'Welcome to the home page of my awesome website',
};

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
