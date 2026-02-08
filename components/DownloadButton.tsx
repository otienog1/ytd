'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  downloadUrl: string;
  filename?: string;
}

export function DownloadButton({ downloadUrl, filename = 'video.mp4' }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownload} className="w-full">
      <Download className="mr-2 h-5 w-5" />
      Download MP4
    </Button>
  );
}
