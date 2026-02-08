'use client';

import Image from 'next/image';
import type { VideoInfo } from '@/lib/types';
import { DownloadButton } from '@/components/DownloadButton';

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  downloadUrl?: string;
  showDownloadButton?: boolean;
}

export function VideoPreview({ videoInfo, downloadUrl, showDownloadButton }: VideoPreviewProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="border-2 border-[var(--card-border)] p-5 space-y-4 bg-[var(--background)] hover:border-[#E74C3C]/30 transition-colors">
        <div className="aspect-video relative overflow-hidden bg-black shadow-lg">
          <Image
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-[var(--foreground)] leading-tight">{videoInfo.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(videoInfo.duration)}
            </span>
            {videoInfo.quality && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {videoInfo.quality}
              </span>
            )}
            {videoInfo.fileSize && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {videoInfo.fileSize}
              </span>
            )}
          </div>
        </div>
      </div>
      {showDownloadButton && downloadUrl && (
        <div className="mt-4">
          <DownloadButton downloadUrl={downloadUrl} filename={`${videoInfo.title || 'video'}.mp4`} />
        </div>
      )}
    </>
  );
}
