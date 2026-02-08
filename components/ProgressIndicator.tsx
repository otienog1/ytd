'use client';

import { Progress } from '@/components/ui/progress';
import type { DownloadStatus } from '@/lib/types';

interface ProgressIndicatorProps {
  status: DownloadStatus;
}

export function ProgressIndicator({ status }: ProgressIndicatorProps) {
  const getStatusText = () => {
    switch (status.status) {
      case 'queued':
        return 'Video is in queue...';
      case 'processing':
        return 'Processing video...';
      case 'completed':
        return 'Video ready for download!';
      case 'failed':
        return 'Download failed';
      default:
        return 'Unknown status';
    }
  };

  const getProgressValue = () => {
    if (status.status === 'completed') return 100;
    if (status.status === 'failed') return 0;
    return status.progress || 0;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-white">{getStatusText()}</span>
        <span className="text-lg font-bold text-[#E74C3C]">{getProgressValue()}%</span>
      </div>
      <Progress value={getProgressValue()} />
      {status.error && (
        <div className="bg-red-900/20 border border-red-500/30 p-3">
          <p className="text-sm text-red-400">{status.error}</p>
        </div>
      )}
    </div>
  );
}
