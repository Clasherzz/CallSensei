import React, { useState } from "react";
import ActivityList from "./components/ActivityList";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./state/store";
import { setLatestResponse } from "./state/activitiesSlice";
import { explainEndpoint, explainResponse } from "./services/aiService";

const App: React.FC = () => {
  const activities = useSelector((state: RootState) => state.activities.activities);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiExplanation, setAIExplanation] = useState<string>("");

  const selectedActivity = activities.find(a => a.id === selectedId) || null;

  const handleRequestSubmit = async (data: any) => {
    setSelectedId(activities.length > 0 ? activities[activities.length - 1].id : null);
    setAIExplanation(await explainEndpoint(data));
    // Send the request
    try {
      const res = await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: ["POST", "PUT", "PATCH"].includes(data.method) ? data.body : undefined,
      });
      const resBody = await res.text();
      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: resBody,
      };
      dispatch(setLatestResponse(responseData));
      setAIExplanation(await explainResponse(responseData));
    } catch (e) {
      dispatch(setLatestResponse(null));
      setAIExplanation("Failed to send request: " + (e as Error).message);
    }
  };

  return (
    <div className="flex h-screen bg-darkblue w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-darkblue-light p-4">
        <ActivityList onSelect={setSelectedId} selectedId={selectedId} />
      </aside>
      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
        <RequestForm onSubmit={handleRequestSubmit} />
        <ResponseViewer />
        <div className="bg-darkblue-light p-4 rounded mt-4">
          <h3 className="text-lg font-semibold mb-2">AI Explanation</h3>
          <p className="text-accent whitespace-pre-line">{aiExplanation || "AI will explain the endpoint and response here."}</p>
        </div>
      </main>
    </div>
  );
};

export default App;
