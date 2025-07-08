'use client';

import {useEffect, useState} from 'react';
import {client} from "@/sanity/lib/client";
import {PDF_BY_ID_QUERY} from "@/sanity/lib/query";
import {Document, Page, pdfjs} from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();
const PDFViewer = ({pdfId}:{pdfId: string}) => {

    const [pdf,setPdf] = useState<{ url: string,orginalFilename: string } | null>(null);
    useEffect(()=>{
        client.fetch(PDF_BY_ID_QUERY, {pdfId})
            .then((res)=>{
                setPdf(res?.file?.asset as typeof pdf)
            })
    },[])
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div>
            <Document file={pdf?.url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
            {numPages && <p className={"flex gap-3 w-full justify-center items-center text-lg"}>
                <span>
                    <button disabled={pageNumber == 1} onClick={()=>setPageNumber((prev)=>prev-1)}> {"<  "} </button>
                </span>
                Page {pageNumber} of {numPages}
                <span>
                    <button disabled={pageNumber == numPages} onClick={()=>setPageNumber((prev)=>prev+1)}> {"  >"} </button>
                </span>
            </p>}

        </div>
    );
};

export default PDFViewer;
