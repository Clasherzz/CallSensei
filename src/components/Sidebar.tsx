// callsensei/src/components/Sidebar.tsx
import React from "react";
import ActivityList from "./ActivityList";

interface SidebarProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
    onNewActivity: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId, onNewActivity }) => (
    <aside className="w-64 bg-[#14142bf8] p-4 border-r-1 border-b-cyan-600">
        <div className="flex items-center border-b justify-between mb-2 pb-2">
            <h2 className="text-xl font-bold text-accent  border-gray-300 pb-2 mb-0">Activities</h2>
            <button
                className="ml-2 bg-accent text-white px-2 py-1 rounded text-xs font-semibold border border-gray-300 hover:bg-cyan-800 transition"
                style={{ height: '2rem' }}
                onClick={onNewActivity}
                title="New Activity"
            >
                +
            </button>
        </div>
        <ActivityList onSelect={onSelect} selectedId={selectedId} />
    </aside>
);

export default Sidebar;