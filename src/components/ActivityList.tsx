import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../state/store/store";
import { ApiRequest } from "../models";

interface ActivityListProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ onSelect, selectedId }) => {
    const requests = useSelector((state: RootState) => state.api.requests);
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

    const handleRename = (id: string, name: string) => {
        // TODO: Add rename action to apiSlice
        console.log("Rename request:", id, name);
    };

    const handleDuplicate = (request: ApiRequest) => {
        // TODO: Add duplicate action to apiSlice
        console.log("Duplicate request:", request);
    };

    const handleDelete = (id: string) => {
        // TODO: Add delete action to apiSlice
        console.log("Delete request:", id);
    };

    return (
        <div>
            <ul>
                {requests.map((request) => (
                    <li
                        key={request.id}
                        className={`mb-1 rounded cursor-pointer ${selectedId === request.id ? 'bg-[#24243af8] text-white' : 'bg-accent'}`}
                        onClick={() => onSelect(request.id)}
                    >
                        <div className="flex flex-col items-start">
                            <span
                                className="block font-medium text-sm truncate max-w-full px-1"
                                title={request.name || request.url || request.id}
                                onClick={e => {
                                    e.stopPropagation();
                                    setEditingId(request.id);
                                    setEditValue(request.name || "");
                                }}
                            >
                                {editingId === request.id ? (
                                    <input
                                        className="bg-darkblue text-white rounded px-1 py-0.5 text-sm w-32"
                                        value={editValue}
                                        autoFocus
                                        onChange={e => setEditValue(e.target.value)}
                                        onBlur={() => {
                                            handleRename(request.id, editValue);
                                            setEditingId(null);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                handleRename(request.id, editValue);
                                                setEditingId(null);
                                            } else if (e.key === "Escape") {
                                                setEditingId(null);
                                            }
                                        }}
                                    />
                                ) : (
                                    request.name || request.url || request.id
                                )}
                            </span>
                            <div className="relative w-full flex justify-end">
                                <button
                                    className="text-white text-xl px-2 py-1 rounded hover:bg-[#24243af8]"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setMenuOpenId(menuOpenId === request.id ? null : request.id);
                                    }}
                                >
                                    &#8230; {/* Unicode for horizontal ellipsis */}
                                </button>
                                {menuOpenId === request.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute z-10 mt-2 w-28 right-0 bg-[#24243af8] rounded shadow-lg border border-gray-200"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-cyan-800"
                                            onClick={() => {
                                                handleDuplicate(request);
                                                setMenuOpenId(null);
                                            }}
                                        >
                                            Duplicate
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cyan-800"
                                            onClick={() => {
                                                handleDelete(request.id);
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