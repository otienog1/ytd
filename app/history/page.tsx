'use client';

import { DownloadHistory } from '@/components/DownloadHistory';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <DownloadHistory />
        </div>
      </div>
    </ProtectedRoute>
  );
}
