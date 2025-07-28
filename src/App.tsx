import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import AIExplanation from "./components/AIExplanation";

import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./state/store";
import { setLatestResponse, addRequest, renameActivity } from "./state/activitiesSlice";
import { explainEndpoint, explainResponse } from "./services/aiService";

const App: React.FC = () => {
  const activities = useSelector((state: RootState) => state.activities.activities);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiExplanation, setAIExplanation] = useState<string>("");
  const initialized = useRef(false);

  const selectedActivity = activities.find(a => a.id === selectedId) || null;

  useEffect(() => {
    if (!initialized.current && activities.length === 0 && !selectedId) {
      const newReq = { method: "GET", url: "", headers: {}, body: "" };
      dispatch(addRequest(newReq));
      initialized.current = true;
    }
  }, [activities.length, dispatch, selectedId]);

  useEffect(() => {
    // If a new activity was added, select it
    if (activities.length > 0 && (!selectedId || !activities.find(a => a.id === selectedId))) {
      setSelectedId(activities[activities.length - 1].id);
    }
  }, [activities, selectedId]);

  const handleRequestSubmit = async (data: any) => {
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
      // Rename window if name is still default
      if (selectedActivity && (selectedActivity.name === 'New Window' || !selectedActivity.name) && data.url) {
        dispatch(renameActivity({ id: selectedActivity.id, name: data.url }));
      }
    } catch (e) {
      dispatch(setLatestResponse(null));
      setAIExplanation("Failed to send request: " + (e as Error).message);
    }
  };

  const handleNewActivity = () => {
    const newReq = { method: "GET", url: "", headers: {}, body: "" };
    dispatch(addRequest(newReq));
    // The useEffect above will select the new activity
  };

  const handleUpdateActivity = (data: any) => {
    // Optionally handle after update
  };

  return (
    <div className="flex h-screen bg-[#0b0b1ff8] w-screen">
      <Sidebar onSelect={setSelectedId} selectedId={selectedId} onNewActivity={handleNewActivity} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
        <RequestForm activity={selectedActivity} onSubmit={handleRequestSubmit} onUpdate={handleUpdateActivity} />
        <ResponseViewer />
        <AIExplanation explanation={aiExplanation} />
      </main>
    </div>
  );
};

export default App;
