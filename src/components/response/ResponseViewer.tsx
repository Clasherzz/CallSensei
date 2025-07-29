import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

const ResponseViewer: React.FC = () => {
    const response = useSelector((state: RootState) => state.activities.latestResponse);
    if (!response) return <div className="bg-darkblue-light p-4 rounded">No response yet.</div>;
    return (
        <div className="bg-darkblue-light p-4 rounded mt-4">
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <div className="mb-2">Status: <span className="font-mono">{response.status} {response.statusText}</span></div>
            <div className="mb-2">Headers:
                <pre className="bg-darkblue p-2 rounded text-xs overflow-x-auto">{JSON.stringify(response.headers, null, 2)}</pre>
            </div>
            <div>Body:
                <pre className="bg-darkblue p-2 rounded text-xs overflow-x-auto">{response.body}</pre>
            </div>
        </div>
    );
};

export default ResponseViewer; 