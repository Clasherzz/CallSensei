import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import AIExplanation from "./components/ai/AIExplanation";
import RequestForm from "./components/request/RequestForm";
import ResponseViewer from "./components/response/ResponseViewer";

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiExplanation, setAIExplanation] = useState<string>("");

  return (
    <div className="flex h-screen bg-[#0b0b1ff8] w-screen">
      <Sidebar onSelect={setSelectedId} selectedId={selectedId} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
        <RequestForm selectedId={selectedId} setAIExplanation={setAIExplanation} />
        <ResponseViewer />
        <AIExplanation explanation={aiExplanation} />
      </main>
    </div>
  );
};

export default App;