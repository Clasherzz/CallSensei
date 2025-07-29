import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../state/store";
import { duplicateRequest, deleteRequest, renameActivity } from "../../state/activitiesSlice";

interface ActivityListProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ onSelect, selectedId }) => {
    const activities = useSelector((state: RootState) => state.activities.activities);
    const dispatch = useDispatch();
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    useEffect(() => {
        if (!menuOpenId) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpenId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpenId]);

    return (
        <div>
            <ul>
                {activities.map((a) => (
                    <li
                        key={a.id}
                        className={`mb-1 rounded cursor-pointer ${selectedId === a.id ? 'bg-[#24243af8] text-white' : 'bg-accent'}`}
                        onClick={() => onSelect(a.id)}
                    >
                        <div className="flex flex-col items-start">
                            <span
                                className="block font-medium text-sm truncate max-w-full px-1"
                                title={a.name || a.url || a.id}
                                onClick={e => {
                                    e.stopPropagation();
                                    setEditingId(a.id);
                                    setEditValue(a.name || "");
                                }}
                            >
                                {editingId === a.id ? (
                                    <input
                                        className="bg-darkblue text-white rounded px-1 py-0.5 text-sm w-32"
                                        value={editValue}
                                        autoFocus
                                        onChange={e => setEditValue(e.target.value)}
                                        onBlur={() => {
                                            dispatch(renameActivity({ id: a.id, name: editValue }));
                                            setEditingId(null);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                dispatch(renameActivity({ id: a.id, name: editValue }));
                                                setEditingId(null);
                                            } else if (e.key === "Escape") {
                                                setEditingId(null);
                                            }
                                        }}
                                    />
                                ) : (
                                    a.name || a.url || a.id
                                )}
                            </span>
                            <div className="relative w-full flex justify-end">
                                <button
                                    className="text-white text-xl px-2 py-1 rounded hover:bg-[#24243af8]"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setMenuOpenId(menuOpenId === a.id ? null : a.id);
                                    }}
                                >
                                    &#8230; {/* Unicode for horizontal ellipsis */}
                                </button>
                                {menuOpenId === a.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute z-10 mt-2 w-28 right-0 bg-[#24243af8] rounded shadow-lg border border-gray-200"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-cyan-800"
                                            onClick={() => {
                                                dispatch(duplicateRequest(a.id));
                                                setMenuOpenId(null);
                                            }}
                                        >
                                            Duplicate
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cyan-800"
                                            onClick={() => {
                                                dispatch(deleteRequest(a.id));
                                                setMenuOpenId(null);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList; 