import axios from "axios";
import type {
  DownloadRequest,
  DownloadResponse,
  DownloadStatus,
  HistoryResponse,
  HistoryFilters,
} from "./types";
import { auth } from "./firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ytd.timobosafaris.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include user email in admin requests
apiClient.interceptors.request.use(async (config) => {
  // If it's an admin or storage stats route, add the user email header
  if (config.url?.includes('/api/admin') || config.url?.includes('/api/storage/stats')) {
    const user = auth?.currentUser;
    if (user?.email) {
      config.headers['X-User-Email'] = user.email;
    }
  }
  return config;
});

export const api = {
  async initiateDownload(data: DownloadRequest): Promise<DownloadResponse> {
    const response = await apiClient.post<DownloadResponse>(
      "/api/download/",
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

  // Admin endpoints
  async getStorageStats(): Promise<any> {
    const response = await apiClient.get('/api/storage/stats');
    return response.data;
  },

  async getAllUsers(page: number = 1, limit: number = 20, search?: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const response = await apiClient.get(`/api/admin/users?${params.toString()}`);
    return response.data;
  },

  async getUserDetails(userId: string): Promise<any> {
    const response = await apiClient.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  async deleteUserData(userId: string): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const response = await apiClient.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  async syncStorageStats(): Promise<{ message: string; task_id: string; status: string }> {
    const response = await apiClient.post('/api/admin/sync-storage-stats');
    return response.data;
  },

  async getSyncStatus(taskId: string): Promise<{ task_id: string; status: string; result: any }> {
    const response = await apiClient.get(`/api/admin/sync-storage-stats/status/${taskId}`);
    return response.data;
  },
};

export default api;
