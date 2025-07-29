// store/api/apiSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as models from "../../models/index";
import { ApiState } from "./apiState";
import type { ApiResponse } from "./apiState";

const initialState: ApiState = {
  collections: [],
  folders: [],
  requests: [],
  loading: false,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    addCollection(state, action: PayloadAction<models.ApiCollection>) {
      state.collections.push(action.payload);
    },
    addFolder(state, action: PayloadAction<models.ApiFolder>) {
      state.folders.push(action.payload);
    },
    addRequest(state, action: PayloadAction<models.ApiRequest>) {
      state.requests.push(action.payload);
    },
    selectCollection(state, action: PayloadAction<string>) {
      state.selectedCollectionId = action.payload;
    },
    selectFolder(state, action: PayloadAction<string>) {
      state.selectedFolderId = action.payload;
    },
    selectRequest(state, action: PayloadAction<string>) {
      state.selectedRequestId = action.payload;
    },
    setLatestResponse(state, action: PayloadAction<ApiResponse | null>) {
      state.latestResponse = action.payload || undefined;
    },
  },
});

export const {
  addCollection,
  addFolder,
  addRequest,
  selectCollection,
  selectFolder,
  selectRequest,
  setLatestResponse,
} = apiSlice.actions;

export default apiSlice.reducer;
