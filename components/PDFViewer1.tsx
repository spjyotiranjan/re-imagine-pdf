"use client"

import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import WebViewer from '@pdftron/pdfjs-express-viewer';
import {client} from "@/sanity/lib/client";
import {PDF_BY_ID_QUERY} from "@/sanity/lib/query";



const PDFViewer = ({pdfId}: { pdfId: string }) => {

    const viewer = useRef<HTMLDivElement>(null);
    const [pdf, setPdf] = useState<{ url: string, orginalFilename: string } | null>(null);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [viewerInitialed, setViewerInitialed] = useState<boolean>(false);
    useEffect(() => {
        client.fetch(PDF_BY_ID_QUERY, {pdfId})
            .then((res) => {
                setPdf(res?.file?.asset as typeof pdf)
            })
    }, [pdfId])

    useEffect(() => {
        if (pdf && viewer.current && !viewerInitialed) {
            setViewerInitialed(true);
            WebViewer(
                {
                    path: '/webviewer/lib',
                    initialDoc: pdf?.url as string,
                    licenseKey: process.env.NEXT_PUBLIC_PDFTRON_LICENSE_KEY as string,
                    isReadOnly: false,
                },
                viewer.current,
            ).then((instance: any) => {
                // now you can access APIs through the WebViewer instance
                const {Core} = instance;

                // adding an event listener for when a document is loaded
                Core.documentViewer.addEventListener('documentLoaded', () => {
                    console.log('document loaded');
                });

                const FitMode = instance.FitMode;
                instance.setFitMode(FitMode.FitWidth);
                instance.UI.disableElements(['panToolButton']);
                instance.UI.setToolMode(Core.Tools.ToolNames.TEXT_SELECT);

                instance.UI.addEventListener("mouseup",()=>{
                    const selectedText = Core.documentViewer.getSelectedText();
                    if(selectedText){
                        setSelectedText(selectedText)
                    }else{
                        setSelectedText(null)
                    }
                })
                instance.UI.addEventListener("dblclick",()=>{
                    const selectedText = Core.documentViewer.getSelectedText();
                    if(selectedText){
                        setSelectedText(selectedText)
                    }else{
                        setSelectedText(null)
                    }
                })


                // adding an event listener for when the page number has changed
                Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber: number) => {
                    console.log(`Page number is: ${pageNumber}`);
                });
            });
        }
    }, [pdf]);

    return (
        <div className="MyComponent w-full h-full">
            <div className="header">Selected Text : {selectedText}</div>
            <div className="webviewer h-[85vh] w-full" ref={viewer}></div>
        </div>
    );
};

export default PDFViewer;
