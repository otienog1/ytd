import { useEffect, useRef, useState, useCallback } from 'react';

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  quality?: string;
  fileSize?: string;
}

interface DownloadStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoInfo?: VideoInfo;
  downloadUrl?: string;
  error?: string;
  storageProvider?: 'gcs' | 'azure' | 's3';
  fileSize?: number;
}

interface UseWebSocketReturn {
  status: DownloadStatus | null;
  isConnected: boolean;
  error: Error | null;
}

export function useWebSocket(jobId: string): UseWebSocketReturn {
  const [status, setStatus] = useState<DownloadStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const pingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Clear status when jobId changes or becomes empty
  useEffect(() => {
    if (!jobId) {
      setStatus(null);
      setIsConnected(false);
      setError(null);
    }
  }, [jobId]);

  const connect = useCallback(() => {
    if (!jobId) return;

    try {
      // Create WebSocket connection
      const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'localhost:3001';
      const wsUrl = `${protocol}//${host}/ws/download/${jobId}`;

      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Send periodic ping to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 30000); // Every 30 seconds
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'status') {
            setStatus(message.data);
            console.log('Status update:', message.data);
          } else if (message.type === 'pong') {
            console.log('Received pong');
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Attempt to reconnect if not normal closure
        if (event.code !== 1000 && reconnectAttempts.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current + 1}/5)`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err as Error);
    }
  }, [jobId]);

  useEffect(() => {
    connect();

    return () => {
      // Cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { status, isConnected, error };
}
