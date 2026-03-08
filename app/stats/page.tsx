'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { StorageStats } from '@/components/StorageStats';
import { StorageAlert } from '@/components/StorageAlert';

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check if user is admin
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E74C3C]"></div>
      </div>
    );
  }

  // Don't render anything if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Storage Statistics
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded hover:bg-[var(--card-border)] transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Storage Alert */}
          <StorageAlert />

            {/* Storage Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stats */}
              <div className="lg:col-span-2">
                <div className="bg-[var(--card-bg)] p-8 border border-[var(--card-border)] space-y-6">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    Cloud Storage Overview
                  </h2>

                  <div className="space-y-6">
                    <StorageStats />
                  </div>

                  <div className="pt-6 border-t border-[var(--card-border)]">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                      About Storage Limits
                    </h3>
                    <div className="space-y-3 text-sm text-[var(--text-muted)]">
                      <p>
                        Each cloud provider has a 5GB storage limit. When a provider reaches capacity,
                        the system automatically switches to the next available provider.
                      </p>
                      <p>
                        <strong className="text-[var(--foreground)]">Provider Priority:</strong>
                        {' '}Google Cloud Storage → Azure Blob Storage → AWS S3
                      </p>
                      <p>
                        Storage stats are synced daily at 3 AM UTC to ensure accuracy across all platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)]">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                    Quick Info
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-[var(--foreground)] mb-1">Total Capacity</p>
                      <p className="text-[var(--text-muted)]">15 GB (3 providers × 5 GB)</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)] mb-1">File Retention</p>
                      <p className="text-[var(--text-muted)]">1 hour after download</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)] mb-1">Sync Schedule</p>
                      <p className="text-[var(--text-muted)]">Daily at 3:00 AM UTC</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)]">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                    Storage Providers
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-[var(--text-muted)]">Google Cloud Storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-[var(--text-muted)]">Azure Blob Storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-[var(--text-muted)]">AWS S3 Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
