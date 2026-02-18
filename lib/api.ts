import axios from "axios";
import type {
  DownloadRequest,
  DownloadResponse,
  DownloadStatus,
  HistoryResponse,
  HistoryFilters,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ytd.timobosafaris.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async initiateDownload(data: DownloadRequest): Promise<DownloadResponse> {
    const response = await apiClient.post<DownloadResponse>(
      "/api/download",
      data,
    );
    return response.data;
  },

  async getDownloadStatus(jobId: string): Promise<DownloadStatus> {
    const response = await apiClient.get<DownloadStatus>(
      `/api/status/${jobId}`,
    );
    return response.data;
  },

  async getDownloadHistory(filters?: HistoryFilters): Promise<HistoryResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<HistoryResponse>(
      `/api/history?${params.toString()}`
    );
    return response.data;
  },

  async deleteDownload(jobId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/history/${jobId}`
    );
    return response.data;
  },
};

export default api;
