"use client"

import {useState} from 'react';
import {Loader, TrashIcon} from "lucide-react";

const PDFDeleteIcon = ({userId,pdfId}: {userId: string,pdfId: string}) => {
    const [isLoading, setIsLoading] = useState(false);
    if(isLoading) return (
        <Loader size={20}/>
    )

    return (
        <TrashIcon className={"cursor-pointer w-[10%]"} size={20} onClick={async ()=>{
            console.log(pdfId)
            setIsLoading(true)
            const res = await fetch(`/api/pdf/delete/${pdfId}/${userId}`,{
                method: "DELETE"
            })
            console.log(await res.json());
            setIsLoading(false)
        }} />
    );
};

export default PDFDeleteIcon;
