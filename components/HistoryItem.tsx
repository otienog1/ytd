'use client';

import { formatDistanceToNow } from 'date-fns';
import { Download, Trash2 } from 'lucide-react';
import type { DownloadStatus } from '@/lib/types';

interface HistoryItemProps {
  item: DownloadStatus;
  onDelete: (jobId: string) => void;
  onDownload: (url: string, title: string) => void;
}

export function HistoryItem({ item, onDelete, onDownload }: HistoryItemProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      queued: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return badges[status as keyof typeof badges] || badges.queued;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-[var(--card-border)] p-4 bg-[var(--background)] hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        {item.videoInfo?.thumbnail && (
          <div className="sm:w-40 flex-shrink-0">
            <img
              src={item.videoInfo.thumbnail}
              alt={item.videoInfo.title || 'Video thumbnail'}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-[var(--foreground)] line-clamp-2">
              {item.videoInfo?.title || 'Unknown Video'}
            </h3>
            <span
              className={`px-3 py-1 text-xs font-medium border whitespace-nowrap ${getStatusBadge(item.status)}`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mb-3">
            {item.videoInfo?.duration && (
              <span>Duration: {formatDuration(item.videoInfo.duration)}</span>
            )}
            {item.fileSize && <span>Size: {formatFileSize(item.fileSize)}</span>}
            {item.videoInfo?.quality && <span>Quality: {item.videoInfo.quality}</span>}
            {item.storageProvider && (
              <span>
                Storage:{' '}
                {item.storageProvider === 'gcs'
                  ? 'Google Cloud'
                  : item.storageProvider === 'azure'
                    ? 'Azure'
                    : 'AWS S3'}
              </span>
            )}
          </div>

          {item.createdAt && (
            <p className="text-xs text-[var(--text-muted)] mb-3">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          )}

          {item.error && (
            <p className="text-sm text-red-600 mb-3 p-2 bg-red-50 border border-red-200">
              Error: {item.error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {item.status === 'completed' && item.downloadUrl && (
              <button
                onClick={() =>
                  onDownload(item.downloadUrl!, item.videoInfo?.title || 'video')
                }
                className="flex items-center gap-2 px-4 py-2 bg-[#E74C3C] text-white text-sm font-medium hover:bg-[#c0392b] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <button
              onClick={() => onDelete(item.jobId)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
