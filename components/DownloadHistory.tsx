'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Download, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LocalHistory } from '@/lib/localHistory';

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  fileSize?: string;
  quality?: string;
}

interface DownloadHistoryItem {
  jobId: string;
  status: string;
  progress: number;
  videoInfo?: VideoInfo;
  downloadUrl?: string;
  error?: string;
  createdAt?: string;
}

async function fetchDownloadHistory(userId: string): Promise<DownloadHistoryItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/download/history/${userId}?limit=50`);

  if (!response.ok) {
    throw new Error('Failed to fetch download history');
  }

  return response.json();
}

export function DownloadHistory() {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localHistory, setLocalHistory] = useState<DownloadHistoryItem[]>([]);

  // Fetch server history for authenticated users
  const { data: serverHistory, isLoading, error } = useQuery({
    queryKey: ['downloadHistory', user?.uid],
    queryFn: () => fetchDownloadHistory(user!.uid),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Load local history for anonymous users
  useEffect(() => {
    if (!user) {
      setLocalHistory(LocalHistory.getAll());

      // Refresh local history every 5 seconds to clean expired items
      const interval = setInterval(() => {
        setLocalHistory(LocalHistory.getAll());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Use server history for authenticated users, local history for anonymous
  const history = user ? serverHistory : localHistory;

  const toggleExpand = (jobId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Show loading only for authenticated users fetching from server
  if (user && isLoading) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Download History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E74C3C]"></div>
        </div>
      </div>
    );
  }

  // Show error only for authenticated users with server errors
  if (user && error) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Download History</h2>
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">Failed to load download history</p>
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Download History</h2>
        <div className="text-center py-12">
          <Download className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">No downloads yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Your download history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
        Download History
        <span className="text-sm font-normal text-[var(--text-muted)] ml-3">
          ({history.length} download{history.length !== 1 ? 's' : ''})
        </span>
      </h2>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.jobId}
            className="border border-[var(--card-border)] rounded-lg overflow-hidden hover:border-[#E74C3C] transition-colors"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(item.jobId)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {item.videoInfo?.thumbnail && (
                  <img
                    src={item.videoInfo.thumbnail}
                    alt={item.videoInfo.title}
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--foreground)] truncate">
                    {item.videoInfo?.title || 'Unknown Video'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[var(--text-muted)]">
                    {item.videoInfo?.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(item.videoInfo.duration / 60)}:
                        {String(item.videoInfo.duration % 60).padStart(2, '0')}
                      </span>
                    )}

                    {item.videoInfo?.fileSize && (
                      <span>{item.videoInfo.fileSize}</span>
                    )}

                    {item.videoInfo?.quality && (
                      <span className="text-[#E74C3C]">{item.videoInfo.quality}</span>
                    )}
                  </div>

                  {/* Download link */}
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-[#E74C3C] hover:text-[#c0392b] font-medium text-sm transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                      Download Again
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedItems.has(item.jobId) && (
              <div className="px-4 pb-4 pt-2 border-t border-[var(--card-border)] bg-[var(--background)] bg-opacity-50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Video ID:</span>
                    <span className="text-[var(--foreground)] font-mono">
                      {item.videoInfo?.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Job ID:</span>
                    <span className="text-[var(--foreground)] font-mono text-xs">
                      {item.jobId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <span className="text-green-500 font-medium">{item.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
