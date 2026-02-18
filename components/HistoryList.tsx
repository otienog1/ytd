'use client';

import { HistoryItem } from './HistoryItem';
import type { DownloadStatus } from '@/lib/types';

interface HistoryListProps {
  items: DownloadStatus[];
  onDelete: (jobId: string) => void;
  onDownload: (url: string, title: string) => void;
  isLoading?: boolean;
}

export function HistoryList({
  items,
  onDelete,
  onDownload,
  isLoading = false,
}: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-[var(--card-border)] p-4 bg-[var(--background)] animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-40 aspect-video bg-[var(--skeleton-bg)]"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-[var(--skeleton-bg)] rounded w-3/4"></div>
                <div className="h-4 bg-[var(--skeleton-bg)] rounded w-1/2"></div>
                <div className="h-4 bg-[var(--skeleton-bg)] rounded w-1/4"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-[var(--skeleton-bg)] rounded w-24"></div>
                  <div className="h-10 bg-[var(--skeleton-bg)] rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--card-border)]">
        <p className="text-lg text-[var(--text-muted)] mb-2">No downloads found</p>
        <p className="text-sm text-[var(--text-muted)]">
          Start downloading YouTube Shorts to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <HistoryItem
          key={item.jobId}
          item={item}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
