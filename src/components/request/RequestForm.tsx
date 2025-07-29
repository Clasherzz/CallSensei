import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import { updateActivity, renameActivity, setLatestResponse } from "../../state/activitiesSlice";
import "./RequestForm.css";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const RequestForm: React.FC<{
    selectedId: string | null;
    setAIExplanation: (s: string) => void;
}> = ({ selectedId, setAIExplanation }) => {
    const activity = useSelector((state: RootState) =>
        state.activities.activities.find(a => a.id === selectedId)
    );
    const [method, setMethod] = useState(activity?.method || "GET");
    const [url, setUrl] = useState(activity?.url || "");
    const [headers, setHeaders] = useState(activity ? JSON.stringify(activity.headers, null, 2) : "{}");
    const [body, setBody] = useState(activity?.body || "");
    const dispatch = useDispatch();

    //Setting the state of the Request Form
    React.useEffect(() => {
        setMethod(activity?.method || "GET");
        setUrl(activity?.url || "");
        setHeaders(activity ? JSON.stringify(activity.headers, null, 2) : "{}");
        setBody(activity?.body || "");
    }, [activity]);

    //Sending Request
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let parsedHeaders = {};
        try {
            parsedHeaders = JSON.parse(headers);
        } catch {
            alert("Headers must be valid JSON");
            return;
        }
        const reqData = { method, url, headers: parsedHeaders, body };
        //Updating the activity
        if (activity && activity.id) {
            dispatch(updateActivity({ id: activity.id, data: reqData }));
        }
        // Send the request and handle AI explanation/response
        try {
            setAIExplanation("Loading explanation...");
            const explainEndpoint = async (data: any) => ""; // TODO: import real function
            const explainResponse = async (data: any) => ""; // TODO: import real function
            setAIExplanation(await explainEndpoint(reqData));
            const res = await fetch(reqData.url, {
                method: reqData.method,
                headers: reqData.headers,

                //**************************************Check this condition **************************************************************
                body: ["POST", "PUT", "PATCH"].includes(reqData.method) ? reqData.body : undefined,
                //*************************************************************************************************************************
            });
            const resBody = await res.text();
            //set response data
            const responseData = {
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                body: resBody,
            };
            //set response data in redux
            dispatch(setLatestResponse(responseData));
            setAIExplanation(await explainResponse(responseData));

            //Renaming the activity if it is a new window
            if (activity && (activity.name === 'New Window' || !activity.name) && reqData.url) {
                dispatch(renameActivity({ id: activity.id, name: reqData.url }));
            }
        } catch (e) {
            dispatch(setLatestResponse(null));
            setAIExplanation("Failed to send request: " + (e as Error).message);
        }
    };

    return (
        <form className="bg-darkblue-light p-4 rounded mb-4" onSubmit={handleSubmit}>
            <div className="mb-2 flex items-end gap-2">
                <div className="flex flex-col flex-shrink-0" style={{ minWidth: 100 }}>
                    <label className="block mb-1">Method</label>
                    <select
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        className={`method-select method-${method.toLowerCase()} bg-cyan-800 p-2 rounded-sm border-2 border-gray-400 text-white font-bold`}
                    >
                        {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block mb-1">URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="p-2 rounded-sm w-full border-2 border-gray-400 text-white"
                        placeholder="https://api.example.com/endpoint"
                    />
                </div>
            </div>
            <div className="mb-2">
                <label className="block mb-1">Headers (JSON)</label>
                <textarea
                    value={headers}
                    onChange={e => setHeaders(e.target.value)}
                    className="bg-darkblue p-2 rounded-sm w-full border-2 border-gray-400 text-white"
                    rows={2}
                    placeholder='{"Authorization": "Bearer ..."}'
                />
            </div>
            <div className="mb-2">
                <label className="block mb-1">Body</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} className="bg-darkblue p-2 rounded-sm w-full  border-2 border-gray-400 text-white" rows={4} placeholder="{ &quot;key&quot;: &quot;value&quot; }" />
            </div>
            <button type="submit" className="bg-accent text-white font-bold px-4 py-2 rounded-sm border-2 border-gray-400 hover:bg-cyan-950">Send Request</button>
        </form>
    );
};

export default RequestForm; 