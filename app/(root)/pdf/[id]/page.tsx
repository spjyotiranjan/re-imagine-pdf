import React from 'react';
import Chat from "@/components/Chat";

const PDFView = async ({params}: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    return (
        <div>
            {id}
            <Chat pdfId={id} />
        </div>
    );
};

export default PDFView;
