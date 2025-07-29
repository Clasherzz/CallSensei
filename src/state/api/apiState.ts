// store/api/apiState.ts
import * as models from "../../models";

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
  timestamp: number;
}

export interface ApiState {
  collections: models.ApiCollection[];
  folders: models.ApiFolder[];
  requests: models.ApiRequest[];

  selectedCollectionId?: string;
  selectedFolderId?: string;
  selectedRequestId?: string;

  latestResponse?: ApiResponse;
  loading: boolean;
  error?: string;
}
