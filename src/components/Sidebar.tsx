// callsensei/src/components/Sidebar.tsx
import React from "react";
import ActivityList from "./ActivityList";

interface SidebarProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId }) => (
    <aside className="w-64 bg-cyan-950 p-4 border-r-1 border-b-cyan-600">
        <ActivityList onSelect={onSelect} selectedId={selectedId} />
    </aside>
);

export default Sidebar;