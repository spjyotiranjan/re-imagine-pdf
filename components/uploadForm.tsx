"use client"

import React, {Suspense, useState} from 'react';
import {auth} from "@/auth";
import {Session} from "@/sanity/schemaTypes/manualTypes.js";

const UploadForm = ({id}:{id: string}) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const form = new FormData();
        form.append('file', file);
        form.append("userId", id)

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: form,
        });

        const data = await res.json();
        console.log(data)
        form.set('file',"")
        form.set("userId", "")

        setUploading(false);
    };
    return (
        <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-2">Upload New PDF</h2>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleUpload}
                disabled={uploading || !file}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default UploadForm;
