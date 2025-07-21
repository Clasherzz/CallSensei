import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../state/store";
import { duplicateRequest, deleteRequest } from "../state/activitiesSlice";

interface ActivityListProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ onSelect, selectedId }) => {
    const activities = useSelector((state: RootState) => state.activities.activities);
    const dispatch = useDispatch();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-accent">Activities</h2>
            <ul>
                {activities.map((a) => (
                    <li key={a.id} className={`mb-2 p-2 rounded cursor-pointer ${selectedId === a.id ? 'bg-accent text-darkblue' : 'bg-darkblue'}`}
                        onClick={() => onSelect(a.id)}>
                        <div className="flex justify-between items-center">
                            <span>{a.name || a.url || a.id}</span>
                            <div className="space-x-2">
                                <button className="text-xs px-2 py-1 bg-darkblue-light rounded" onClick={e => { e.stopPropagation(); dispatch(duplicateRequest(a.id)); }}>Duplicate</button>
                                <button className="text-xs px-2 py-1 bg-red-600 rounded" onClick={e => { e.stopPropagation(); dispatch(deleteRequest(a.id)); }}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList; 