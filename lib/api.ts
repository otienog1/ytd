import axios from 'axios';
import type { DownloadRequest, DownloadResponse, DownloadStatus } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async initiateDownload(data: DownloadRequest): Promise<DownloadResponse> {
    const response = await apiClient.post<DownloadResponse>('/api/download', data);
    return response.data;
  },

  async getDownloadStatus(jobId: string): Promise<DownloadStatus> {
    const response = await apiClient.get<DownloadStatus>(`/api/status/${jobId}`);
    return response.data;
  },

  async getDownloadHistory(): Promise<DownloadStatus[]> {
    const response = await apiClient.get<DownloadStatus[]>('/api/history');
    return response.data;
  },
};

export default api;
