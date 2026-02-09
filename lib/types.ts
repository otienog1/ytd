export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  fileSize?: string;
  quality?: string;
}

export interface DownloadRequest {
  url: string;
  cookies?: { [key: string]: string };  // Optional YouTube cookies from browser
}

export interface DownloadResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoInfo?: VideoInfo;
  downloadUrl?: string;
  error?: string;
}

export interface DownloadStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  videoInfo?: VideoInfo;
  downloadUrl?: string;
  error?: string;
}
