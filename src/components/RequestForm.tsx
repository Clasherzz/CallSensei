import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRequest } from "../state/activitiesSlice";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const RequestForm: React.FC<{ onSubmit?: (data: any) => void }> = ({ onSubmit }) => {
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [headers, setHeaders] = useState("{}");
    const [body, setBody] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let parsedHeaders = {};
        try {
            parsedHeaders = JSON.parse(headers);
        } catch {
            alert("Headers must be valid JSON");
            return;
        }
        const reqData = { method, url, headers: parsedHeaders, body };
        dispatch(addRequest(reqData));
        onSubmit?.(reqData);
    };

    return (
        <form className="bg-darkblue-light p-4 rounded mb-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-2">New Request</h3>
            <div className="mb-2">
                <label className="block mb-1">Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)} className="bg-darkblue p-2 rounded w-full">
                    {methods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div className="mb-2">
                <label className="block mb-1">URL</label>
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="bg-darkblue p-2 rounded w-full" placeholder="https://api.example.com/endpoint" />
            </div>
            <div className="mb-2">
                <label className="block mb-1">Headers (JSON)</label>
                <textarea value={headers} onChange={e => setHeaders(e.target.value)} className="bg-darkblue p-2 rounded w-full" rows={2} placeholder='{"Authorization": "Bearer ..."}' />
            </div>
            <div className="mb-2">
                <label className="block mb-1">Body</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} className="bg-darkblue p-2 rounded w-full" rows={4} placeholder="{ &quot;key&quot;: &quot;value&quot; }" />
            </div>
            <button type="submit" className="bg-accent text-darkblue font-bold px-4 py-2 rounded">Send Request</button>
        </form>
    );
};

export default RequestForm; 