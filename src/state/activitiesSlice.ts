import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type RequestItem = {
    id: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    name?: string;
};

export type ResponseData = {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
};

interface ActivitiesState {
    activities: RequestItem[];
    latestResponse: ResponseData | null;
}

const initialState: ActivitiesState = {
    activities: [],
    latestResponse: null,
};

const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        addRequest: (state, action: PayloadAction<Omit<RequestItem, 'id'>>) => {
            state.activities.push({ ...action.payload, id: Math.random().toString(36).substr(2, 9), name: 'New Window' });
        },
        duplicateRequest: (state, action: PayloadAction<string>) => {
            const orig = state.activities.find(a => a.id === action.payload);
            if (orig) {
                state.activities.push({ ...orig, id: Math.random().toString(36).substr(2, 9), name: (orig.name || 'Request') + ' (copy)' });
            }
        },
        deleteRequest: (state, action: PayloadAction<string>) => {
            state.activities = state.activities.filter(a => a.id !== action.payload);
        },
        setLatestResponse: (state, action: PayloadAction<ResponseData | null>) => {
            state.latestResponse = action.payload;
        },
        updateActivity: (state, action: PayloadAction<{ id: string; data: Partial<Omit<RequestItem, 'id'>> }>) => {
            const activity = state.activities.find(a => a.id === action.payload.id);
            if (activity) {
                Object.assign(activity, action.payload.data);
            }
        },
        renameActivity: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const activity = state.activities.find(a => a.id === action.payload.id);
            if (activity) {
                activity.name = action.payload.name;
            }
        },
    },
});

export const { addRequest, duplicateRequest, deleteRequest, setLatestResponse, updateActivity, renameActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer; 