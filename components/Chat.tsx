"use client"

import {useEffect, useRef, useState} from "react";
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";

export default function Chat({history,pdfId}: {pdfId: string, history: [{ role: string; content: string }] }) {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if(history){
            setMessages(history)
        }
    }, [history]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {role: "user", content: input};
        const updated = [...messages, userMessage];
        setMessages(updated);
        setInput("");
        setIsLoading(true);

        const res = await fetch("/api/pdf/chat", {
            method: "POST",
            body: JSON.stringify({messages: updated, pdfId}),
        });

        const reader = res.body?.getReader();
        if (!reader) return;

        let assistantMessage = "";
        const decoder = new TextDecoder();

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            assistantMessage += decoder.decode(value);
            setMessages(() => [
                ...updated,
                {role: "assistant", content: assistantMessage},
            ]);
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col h-[85vh] mx-auto p-4">
            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                    <div key={i}
                         className={`p-3 max-w-[85%] w-fit  rounded-md ${m.role === "user" ? "bg-blue-100 text-blue-800 mr-auto" : "bg-gray-100 text-gray-800 ml-auto"}`}>
                        {m.role === "assistant" ? (
                            <Markdown  remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
                        ) : (
                            m.content
                        )}
                    </div>
                ))}
                {isLoading && <div className="italic w-fit ml-auto text-gray-400">Thinking...</div>}
                <div ref={bottomRef}/>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2 sticky bottom-0 gray-container p-3">
                <input
                    type="text"
                    className="flex-1 border rounded p-2 bg-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your PDF..."
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Send
                </button>
            </form>
        </div>
    );
}
