// callsensei/src/components/Sidebar.tsx
import React, { useEffect, useRef } from "react";
import ActivityList from "./ActivityList";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../../state/activitiesSlice";
import type { RequestMethod } from "../../models";
import GitHubAuthButton from "../window/github/GitHubButton";

interface SidebarProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId }) => {
    const dispatch = useDispatch();
    const activities = useSelector((state: any) => (state.activities.activities));
    const initialized = useRef(false);
    const previousActivitiesLength = useRef(activities.length);

    // Ensure at least one activity exists
    useEffect(() => {
        if (!initialized.current && activities.length === 0 && !selectedId) {
            const newReq = { method: "GET" as RequestMethod, url: "", headers: {}, body: "" };
            dispatch(addRequest(newReq));
            initialized.current = true;
        }
    }, [activities.length, dispatch, selectedId]);

    // Auto-select the latest activity if needed
    useEffect(() => {
        if (activities.length > 0) {
            // Check if a new activity was added
            const isNewActivityAdded = activities.length > previousActivitiesLength.current;

            // If no activity is selected, or the selected activity doesn't exist, or a new activity was added
            if (!selectedId || !activities.find((a: any) => a.id === selectedId) || isNewActivityAdded) {
                const latestActivity = activities[activities.length - 1];
                console.log('Auto-selecting latest activity:', latestActivity.id, latestActivity.name, 'isNewActivityAdded:', isNewActivityAdded);
                onSelect(latestActivity.id);
            }
        }

        // Update the previous length for next comparison
        previousActivitiesLength.current = activities.length;
    }, [activities, selectedId, onSelect]);

    const handleNewActivity = () => {
        const newReq = { method: "GET" as RequestMethod, url: "", headers: {}, body: "" };
        console.log('Creating new activity...');
        dispatch(addRequest(newReq));
        // The auto-selection useEffect will handle selecting the new activity
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
                <GitHubAuthButton />
            </div>
            <ActivityList onSelect={onSelect} selectedId={selectedId} />
        </aside>
    );
};

export default Sidebar;