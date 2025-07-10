"use client"

import React, {useEffect, useState} from 'react';
import Chat from "@/components/Chat";
import dynamic from 'next/dynamic';
import {useParams} from "next/navigation";
import {client} from "@/sanity/lib/client";
import {PDF_BY_ID_QUERY} from "@/sanity/lib/query";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";

// ✅ Dynamically import to disable SSR
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
    ssr: false,
});

interface HistoryUnit {
    role: string,
    content: any,
}
interface Asset {
    url: string,
    originalFilename: string,
}


const PDFView = () => {
    const params = useParams(); // this works in client components
    const pdfId = params?.id as string;
    const [pdf, setPdf] = useState<{
        history: [{ role: string, content: any }],
        asset: { url: string, originalFilename: string }
    }>()
    useEffect(() => {
        async function fetchChatHistory() {
            const result = await client.fetch(PDF_BY_ID_QUERY, {pdfId});
            const history = result?.chatHistory || [];
            const formatted: { role: string, content: any }[] = history.flatMap((item: any) => [
                {role: "user", content: item.question},
                {role: "assistant", content: item.answer},
            ]);
            setPdf({asset: result?.file?.asset as Asset, history: formatted as [HistoryUnit]})
        }

        fetchChatHistory();
    }, [pdfId]);


    return (
        <div>
            <div>
                {pdf && pdf.asset && pdf.history && (
                    <ResizablePanelGroup direction={"horizontal"}>
                        <ResizablePanel minSize={30} maxSize={80} order={1}>
                            <PDFViewer pdfAsset={pdf.asset}/>
                        </ResizablePanel>
                        <ResizableHandle className={"panel-resize-handle mx-[2px] border w-[8px] bg-gray-500 rounded-full"}/>
                        <ResizablePanel minSize={30} maxSize={80} order={1}>
                            <Chat pdfId={pdfId} history={pdf.history}/>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )
                }
            </div>
        </div>
    );
};

export default PDFView;
