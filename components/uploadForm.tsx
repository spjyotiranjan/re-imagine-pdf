"use client"

import React, {useRef, useState} from 'react';
import {X, Plus, Upload, Loader} from "lucide-react"

const UploadForm = ({id}: { id: string }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const form = new FormData();
        form.append('file', file);
        form.append("userId", id)

        const res = await fetch('/api/pdf/upload', {
            method: 'POST',
            body: form,
        });

        const data = await res.json();
        console.log(data)
        form.set('file', "")
        form.set("userId", "")
        setFile(null);

        setUploading(false);
    };
    return (
        <div className={"flex w-fit items-center"}>
            {file ?

                <div className={"flex items-center gap-2"}>
                    <div
                        className="text-lg cursor-pointer flex items-center justify-center border border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition size-fit min-h-20">
                        {file.name}
                    </div>
                    <div className={"flex flex-col items-center justify-center gap-2 h-18"}>
                        <button
                            className={`cursor-pointer flex items-center ${uploading && "hidden"} justify-center border border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition size-8`}
                            onClick={() => setFile(null)}
                        >
                            <X size={18} />
                        </button>
                        {!uploading ? <button
                            className="cursor-pointer flex items-center justify-center border border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition size-8"
                            onClick={handleUpload}
                            disabled={uploading || !file}
                        >

                            <Upload size={18} />
                        </button>:
                            <Loader size={20}/>
                        }

                    </div>
                </div>
                 :
                <div
                    onClick={() => inputRef.current && inputRef.current.click()}
                    className={"cursor-pointer flex items-center justify-center border border-gray-300 p-2 rounded-xl hover:bg-gray-100 transition size-fit"}>
                    <Plus />
                    <input
                        ref={inputRef}
                        className={"hidden"}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>}
        </div>
    );
};

export default UploadForm;
