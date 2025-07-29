// callsensei/src/components/Sidebar.tsx
import React, { useEffect, useRef } from "react";
import ActivityList from "./ActivityList";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../../state/activitiesSlice";

interface SidebarProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId }) => {
    const dispatch = useDispatch();
    const activities = useSelector((state: any) => (state.activities.activities));
    const initialized = useRef(false);

    // Ensure at least one activity exists
    useEffect(() => {
        if (!initialized.current && activities.length === 0 && !selectedId) {
            const newReq = { method: "GET", url: "", headers: {}, body: "" };
            dispatch(addRequest(newReq));
            initialized.current = true;
        }
    }, [activities.length, dispatch, selectedId]);

    // Auto-select the latest activity if needed
    useEffect(() => {
        if (activities.length > 0 && (!selectedId || !activities.find((a: any) => a.id === selectedId))) {
            onSelect(activities[activities.length - 1].id);
        }
    }, [activities, selectedId, onSelect]);

    const handleNewActivity = () => {
        const newReq = { method: "GET", url: "", headers: {}, body: "" };
        dispatch(addRequest(newReq));
        setTimeout(() => {
            const latest = activities[activities.length];
            onSelect(latest?.id || null);
        }, 0);
    };
    return (
        <aside className="w-64 bg-[#14142bf8] p-4 border-r-1 border-b-cyan-600">
            <div className="flex items-center border-b justify-between mb-2 pb-2">
                <h2 className="text-xl font-bold text-accent  border-gray-300 pb-2 mb-0">Activities</h2>
                <button
                    className="ml-2 bg-accent text-white px-2 py-1 rounded text-xs font-semibold border border-gray-300 hover:bg-cyan-800 transition"
                    style={{ height: '2rem' }}
                    onClick={handleNewActivity}
                    title="New Activity"
                >
                    +
                </button>
            </div>
            <ActivityList onSelect={onSelect} selectedId={selectedId} />
        </aside>
    );
};

export default Sidebar;