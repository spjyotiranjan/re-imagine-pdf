"use client"

import React from 'react';
import {TrashIcon} from "lucide-react";

const PDFDeleteIcon = ({userId,pdfId}: {userId: string,pdfId: string}) => {
    return (
        <TrashIcon className={"mx-auto"} onClick={async ()=>{
            console.log(pdfId)
            const res = await fetch(`/api/pdf/delete/${pdfId}/${userId}`,{
                method: "DELETE"
            })
            console.log(await res.json());
        }} />
    );
};

export default PDFDeleteIcon;
