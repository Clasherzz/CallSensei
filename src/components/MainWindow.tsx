import React from "react";
import AIExplanation from "./ai/AIExplanation";
import RequestForm from "./request/RequestForm";
import ResponseViewer from "./response/ResponseViewer";

interface MainWindowProps {
    selectedId: string | null;
    setAIExplanation: (explanation: string) => void;
    aiExplanation: string;
}

const MainWindow: React.FC<MainWindowProps> = ({
    selectedId,
    setAIExplanation,
    aiExplanation
}) => {
    return (
        <main className="flex-1 p-8 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
            <RequestForm selectedId={selectedId} setAIExplanation={setAIExplanation} />
            <ResponseViewer />
            <AIExplanation explanation={aiExplanation} />
        </main>
    );
};

export default MainWindow; 