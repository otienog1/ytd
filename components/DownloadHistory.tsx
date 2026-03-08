'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Download, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LocalHistory } from '@/lib/localHistory';
import { Pagination } from './Pagination';
import { api } from '@/lib/api';
import type { HistoryResponse, DownloadStatus } from '@/lib/types';

export function DownloadHistory() {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localHistory, setLocalHistory] = useState<DownloadStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingAgain, setDownloadingAgain] = useState<Set<string>>(new Set());
  const [redownloadUrls, setRedownloadUrls] = useState<Map<string, string>>(new Map()); // Map old jobId to new download URL
  const itemsPerPage = 10;

  // Fetch server history for authenticated users with pagination
  const { data: historyResponse, isLoading, error, refetch: refetchHistory } = useQuery<HistoryResponse>({
    queryKey: ['downloadHistory', user?.uid, currentPage],
    queryFn: () => api.getDownloadHistory({
      page: currentPage,
      limit: itemsPerPage,
    }),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Load local history for anonymous users
  useEffect(() => {
    if (!user) {
      setLocalHistory(LocalHistory.getAll() as DownloadStatus[]);

      // Refresh local history every 5 seconds to clean expired items
      const interval = setInterval(() => {
        setLocalHistory(LocalHistory.getAll() as DownloadStatus[]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Reset to page 1 when user changes
  useEffect(() => {
    setCurrentPage(1);
  }, [user?.uid]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Use server history for authenticated users, local history for anonymous
  const history = user ? historyResponse?.items : localHistory;
  const totalPages = historyResponse?.totalPages || 1;
  const hasNext = historyResponse?.hasNext || false;
  const hasPrevious = historyResponse?.hasPrevious || false;
  const totalCount = historyResponse?.total || localHistory.length;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of history section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadAgain = async (item: DownloadStatus) => {
    if (!item.videoInfo?.id) {
      return;
    }

    // Add to downloading set
    setDownloadingAgain(prev => new Set(prev).add(item.jobId));

    try {
      // Construct YouTube Shorts URL from video ID
      const youtubeUrl = `https://www.youtube.com/shorts/${item.videoInfo.id}`;

      // Initiate new download using the API
      const response = await api.initiateDownload({
        url: youtubeUrl,
        user_id: user?.uid,
      });

      // Poll for download status in the background
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getDownloadStatus(response.jobId);

          if (status.status === 'completed' && status.downloadUrl) {
            // Clear polling interval
            clearInterval(pollInterval);

            // Store the download URL mapped to the original jobId
            setRedownloadUrls(prev => new Map(prev).set(item.jobId, status.downloadUrl));

            // Remove from downloading set
            setDownloadingAgain(prev => {
              const newSet = new Set(prev);
              newSet.delete(item.jobId);
              return newSet;
            });

            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification('Download Ready!', {
                body: `${item.videoInfo?.title || 'Video'} is ready to download`,
                icon: '/favicon.ico'
              });
            }
          } else if (status.status === 'failed') {
            // Clear polling interval
            clearInterval(pollInterval);

            // Remove from downloading set
            setDownloadingAgain(prev => {
              const newSet = new Set(prev);
              newSet.delete(item.jobId);
              return newSet;
            });
          }
        } catch (error) {
          console.error('Error polling download status:', error);
        }
      }, 3000); // Poll every 3 seconds

      // Clear interval after 5 minutes to prevent infinite polling
      setTimeout(() => {
        clearInterval(pollInterval);
        setDownloadingAgain(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.jobId);
          return newSet;
        });
      }, 300000);

    } catch (error: any) {
      console.error('Error re-initiating download:', error);
      // Remove from downloading set on error
      setDownloadingAgain(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.jobId);
        return newSet;
      });
    }
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
          ({totalCount} download{totalCount !== 1 ? 's' : ''})
        </span>
        {user && totalPages > 1 && (
          <span className="text-sm font-normal text-[var(--text-muted)] ml-2">
            - Page {currentPage} of {totalPages}
          </span>
        )}
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

                  {/* Download actions */}
                  {item.downloadUrl || redownloadUrls.has(item.jobId) ? (
                    // Active download link (either original or redownloaded)
                    <a
                      href={redownloadUrls.get(item.jobId) || item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-[#E74C3C] hover:text-[#c0392b] font-medium text-sm transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : item.status === 'completed' && user && (
                    // Expired download - show "Download" button or processing state
                    downloadingAgain.has(item.jobId) ? (
                      <div className="inline-flex items-center gap-2 mt-3 text-[#E74C3C] font-medium text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E74C3C]"></div>
                        Processing...
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadAgain(item);
                        }}
                        className="inline-flex items-center gap-2 mt-3 text-[#E74C3C] hover:underline font-medium text-sm transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )
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
                    <span className={`font-medium ${
                      item.status === 'completed' ? 'text-green-500' :
                      item.status === 'failed' ? 'text-red-500' :
                      item.status === 'processing' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  {item.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Created:</span>
                      <span className="text-[var(--foreground)]">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination - only for authenticated users with multiple pages */}
      {user && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />
      )}
    </div>
  );
}
