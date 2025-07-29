import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import AIExplanation from "./components/AIExplanation";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./state/store/store";
import { addRequest, selectRequest, setLatestResponse } from "./state/api/apiSlice";
import { explainEndpoint, explainResponse } from "./services/aiService";
import { ApiRequest } from "./models";

const App: React.FC = () => {
  const { requests, selectedRequestId } = useSelector((state: RootState) => state.api);
  const dispatch = useDispatch();
  const [aiExplanation, setAIExplanation] = useState<string>("");
  const initialized = useRef(false);

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || null;

  useEffect(() => {
    if (!initialized.current && requests.length === 0 && !selectedRequestId) {
      const newRequest = new ApiRequest(
        crypto.randomUUID(),
        "New Request",
        "GET",
        "",
        {},
        undefined,
        undefined,
        Date.now()
      );
      dispatch(addRequest(newRequest));
      dispatch(selectRequest(newRequest.id));
      initialized.current = true;
    }
  }, [requests.length, dispatch, selectedRequestId]);

  useEffect(() => {
    // If a new request was added, select it
    if (requests.length > 0 && (!selectedRequestId || !requests.find(r => r.id === selectedRequestId))) {
      dispatch(selectRequest(requests[requests.length - 1].id));
    }
  }, [requests, selectedRequestId, dispatch]);

  const handleRequestSubmit = async (data: any) => {
    setAIExplanation(await explainEndpoint(data));
    // Send the request
    try {
      const startTime = Date.now();
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
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
      };
      dispatch(setLatestResponse(responseData));
      setAIExplanation(await explainResponse(responseData));
      // Rename request if name is still default
      if (selectedRequest && (selectedRequest.name === 'New Request' || !selectedRequest.name) && data.url) {
        // TODO: Add rename action to apiSlice
        // dispatch(renameRequest({ id: selectedRequest.id, name: data.url }));
      }
    } catch (e) {
      setAIExplanation("Failed to send request: " + (e as Error).message);
    }
  };

  const handleNewRequest = () => {
    const newRequest = new ApiRequest(
      crypto.randomUUID(),
      "New Request",
      "GET",
      "",
      {},
      undefined,
      undefined,
      Date.now()
    );
    dispatch(addRequest(newRequest));
    dispatch(selectRequest(newRequest.id));
  };

  const handleUpdateRequest = (data: any) => {
    // Optionally handle after update
  };

  return (
    <div className="flex h-screen bg-[#0b0b1ff8] w-screen">
      <Sidebar onSelect={(id) => dispatch(selectRequest(id))} selectedId={selectedRequestId || null} onNewActivity={handleNewRequest} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
        <RequestForm activity={selectedRequest} onSubmit={handleRequestSubmit} onUpdate={handleUpdateRequest} />
        <ResponseViewer />
        <AIExplanation explanation={aiExplanation} />
      </main>
    </div>
  );
};

export default App;
