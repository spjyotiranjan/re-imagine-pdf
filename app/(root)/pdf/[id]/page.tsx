"use client"

import React from 'react';
import Chat from "@/components/Chat";
// import PDFViewer from "@/components/PDFViewer1";
import dynamic from 'next/dynamic';
import {useParams} from "next/navigation";

// ✅ Dynamically import to disable SSR
const PDFViewer = dynamic(() => import('@/components/PDFViewer1'), {
    ssr: false,
});


const PDFView = () => {
    const params = useParams(); // this works in client components
    const id = params?.id as string;
    return (
        <div>
            <div className={"flex justify-between gap-3 w-full"}>
                <PDFViewer pdfId={id} />
                <Chat pdfId={id} />

            </div>
        </div>
    );
};

export default PDFView;
