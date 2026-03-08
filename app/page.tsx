'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { URLInput } from '@/components/URLInput';
import { VideoPreview } from '@/components/VideoPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { useToast } from '@/components/ui/use-toast';
import YouTubeLoginPrompt from '@/components/YouTubeLoginPrompt';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { StorageAlert } from '@/components/StorageAlert';
import { useWebSocket } from '@/hooks/useWebSocket';
import { extractYouTubeCookies } from '@/utils/cookieExtractor';
import { useAuth } from '@/contexts/AuthContext';
import { LocalHistory } from '@/lib/localHistory';
import api from '@/lib/api';
import type { DownloadResponse } from '@/lib/types';

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [isProcessingStarted, setIsProcessingStarted] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Use WebSocket for real-time updates instead of polling
  const { status, isConnected, error: wsError } = useWebSocket(jobId || '');

  const downloadMutation = useMutation({
    mutationFn: (url: string) => {
      // Extract YouTube cookies from browser and send with request
      const cookies = extractYouTubeCookies();
      console.log(`Initiating download with ${Object.keys(cookies).length} cookies`);

      return api.initiateDownload({
        url,
        cookies,
        user_id: user?.uid // Send Firebase user ID if authenticated
      });
    },
    onSuccess: (data: DownloadResponse) => {
      setJobId(data.jobId);
      setIsProcessingStarted(true);
      toast({
        title: 'Video processing started',
        description: 'Your video is being processed via real-time connection...',
      });
    },
    onError: (error: any) => {
      setIsProcessingStarted(false);
      toast({
        title: 'Error',
        description: error?.response?.data?.error || 'Failed to process video',
        variant: 'destructive',
      });
    },
  });

  // Stop processing indicator when job is complete or failed
  if (status && (status.status === 'completed' || status.status === 'failed')) {
    if (isProcessingStarted) {
      setIsProcessingStarted(false);
    }
  }

  // Save completed downloads to local history for anonymous users
  useEffect(() => {
    if (!user && status && status.status === 'completed' && jobId) {
      LocalHistory.add({
        jobId,
        status: status.status,
        progress: status.progress,
        videoInfo: status.videoInfo,
        downloadUrl: status.downloadUrl,
        error: status.error,
      });
    }
  }, [status, jobId, user]);

  const handleSubmit = (url: string) => {
    setJobId(null);
    setIsProcessingStarted(false);
    setSubmittedUrl(url);
    downloadMutation.mutate(url);
  };

  const handleUrlChange = (currentUrl: string) => {
    // Only reset if the URL is different from the one we're currently processing
    // This allows the user to start a new download
    if (currentUrl && currentUrl !== submittedUrl) {
      setJobId(null);
      setIsProcessingStarted(false);
      setSubmittedUrl(''); // Clear submitted URL to allow new submission
    }
  };

  // Determine if we're in an active processing state
  // Keep showing processing until status is completed or failed
  const isActivelyProcessing = downloadMutation.isPending || isProcessingStarted;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Hero Section - Only show to anonymous users */}
          {!user && (
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                Video Downloader - YouTube Shorts, TikTok & Instagram
              </h1>
              <p className="text-base text-[var(--text-muted)] max-w-2xl mx-auto">
                Free online video downloader to save YouTube Shorts, TikTok videos, and Instagram Reels in MP4 format. Download in HD quality without watermark. Fast, secure, and works on all devices - no registration required.
              </p>
            </div>
          )}

          {/* Connection Status - Only show when actively processing */}
          {jobId && isProcessingStarted && (
            <div className="flex justify-center pt-2">
              <ConnectionStatus isConnected={isConnected} error={wsError} />
            </div>
          )}

          {/* Storage Alert */}
          <StorageAlert />

          {/* Main Download Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left & Center Columns - Input & How to Use (2/3 width) */}
            <div className="md:col-span-2 flex flex-col">
              <div className="bg-[var(--card-bg)] p-8 border border-[var(--card-border)] space-y-8 flex-1">
                {/* YouTube Login Prompt */}
                <YouTubeLoginPrompt />

                <URLInput onSubmit={handleSubmit} isLoading={isActivelyProcessing} status={status} onUrlChange={handleUrlChange} />

                {/* How to Use Section */}
                <div className="space-y-6 pt-4">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">How It Works</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-[#E74C3C] flex items-center justify-center text-white text-xl font-bold">
                        1
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Copy URL</h3>
                      <p className="text-[var(--text-muted)] text-sm">
                        Copy the video URL from YouTube Shorts, TikTok, or Instagram
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-[#E74C3C] flex items-center justify-center text-white text-xl font-bold">
                        2
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Paste & Process</h3>
                      <p className="text-[var(--text-muted)] text-sm">
                        Paste the URL above and click the download button
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-[#E74C3C] flex items-center justify-center text-white text-xl font-bold">
                        3
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Save Video</h3>
                      <p className="text-[var(--text-muted)] text-sm">
                        Save the MP4 file to your device
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Preview, Download & Storage Stats (1/3 width) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {isActivelyProcessing && !status?.videoInfo && (
                <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)] flex-1">
                  <div className="space-y-4 animate-pulse">
                    <div className="border-2 border-[var(--card-border)] p-5 space-y-4 bg-[var(--background)]">
                      <div className="aspect-video relative overflow-hidden bg-[var(--skeleton-bg)]"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-[var(--skeleton-bg)] rounded w-3/4"></div>
                        <div className="flex gap-4">
                          <div className="h-3 bg-[var(--skeleton-bg)] rounded w-16"></div>
                          <div className="h-3 bg-[var(--skeleton-bg)] rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-14 bg-[var(--skeleton-bg)] rounded w-full"></div>
                  </div>
                </div>
              )}
              {status?.videoInfo && status.status !== 'failed' && (
                <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)] flex-1">
                  <VideoPreview
                    videoInfo={status.videoInfo}
                    downloadUrl={status.downloadUrl}
                    showDownloadButton={status.status === 'completed'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Features Section - Only show to anonymous users */}
          {!user && (
            <div className="bg-[var(--card-bg)] p-8 border border-[var(--card-border)] space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] text-center">
                Why Choose Our Video Downloader?
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">100% Free & No Registration</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Download videos from YouTube Shorts, TikTok, and Instagram completely free. No sign-up, no login, no subscription required.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">HD Quality Without Watermark</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Save videos in original HD quality - 1080p, 720p, or 480p. No watermarks added to your downloaded videos.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Multiple Platforms Supported</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Download from YouTube Shorts, TikTok videos, Instagram Reels, Posts, and Stories - all in one place.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Works on All Devices</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Download videos on any device - Windows, Mac, Android, iPhone, or tablet. Our tool is fully responsive and mobile-friendly.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">MP4 Format Compatible</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    All videos are downloaded in MP4 format, compatible with all media players and devices. Play your videos anywhere, anytime.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">No Software Installation</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Use our online video downloader directly in your browser. No apps, extensions, or software downloads needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ad Banner */}
          <div className="flex justify-center py-2">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6200632303984293"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-3 pt-8">
            <p>
              By using this service, you agree to our{' '}
              <a href="/terms-of-use" className="text-[#E74C3C] hover:text-[#c0392b] underline transition-colors">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-[#E74C3C] hover:text-[#c0392b] underline transition-colors">
                Privacy Policy
              </a>
            </p>
            <p>
              This tool is for personal use only. Respect copyright laws and YouTube&apos;s Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
