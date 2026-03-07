'use client';

import { useEffect, useState } from 'react';
import { HardDrive } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface StorageProvider {
  provider: string;
  total_size_bytes: number;
  total_size_gb: number;
  file_count: number;
  available_bytes: number;
  available_gb: number;
  used_percentage: number;
  is_full: boolean;
  last_updated: string;
}

interface StorageStatsResponse {
  providers: StorageProvider[];
  total_used_gb: number;
  total_available_gb: number;
  overall_used_percentage: number;
}

export function StorageStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StorageStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      // Refresh every minute
      const interval = setInterval(fetchStats, 60000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const data = await api.getStorageStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch storage stats');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'gcs':
        return '☁️';
      case 'azure':
        return '🔷';
      case 's3':
        return '📦';
      default:
        return '💾';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'gcs':
        return 'Google Cloud';
      case 'azure':
        return 'Azure Blob';
      case 's3':
        return 'AWS S3';
      default:
        return provider;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)]">
        <div className="animate-pulse">
          <div className="h-4 bg-[var(--skeleton-bg)] rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-[var(--skeleton-bg)] rounded"></div>
            <div className="h-12 bg-[var(--skeleton-bg)] rounded"></div>
            <div className="h-12 bg-[var(--skeleton-bg)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)]">
        <div className="text-red-600">
          <p className="font-medium">Failed to load storage stats</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-3 text-sm text-[#E74C3C] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--foreground)]">
          <HardDrive size={24} />
          Storage Usage
        </h2>
        <button
          onClick={fetchStats}
          className="text-sm text-[#E74C3C] hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Overall stats */}
      <div className="mb-6 p-4 bg-[var(--background)] rounded-lg border border-[var(--card-border)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[var(--text-muted)]">Total Usage</span>
          <span className="text-sm font-medium text-[var(--foreground)]">
            {(stats.total_used_gb || 0).toFixed(2)} GB / {((stats.total_used_gb || 0) + (stats.total_available_gb || 0)).toFixed(2)} GB
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(stats.overall_used_percentage || 0)}`}
            style={{ width: `${stats.overall_used_percentage || 0}%` }}
          ></div>
        </div>
        <div className="mt-2 text-right text-xs text-[var(--text-muted)]">
          {(stats.overall_used_percentage || 0).toFixed(1)}% used
        </div>
      </div>

      {/* Individual providers */}
      <div className="space-y-4">
        {stats.providers.map((provider) => (
          <div
            key={provider.provider}
            className={`p-4 rounded-lg border-2 transition-all ${
              provider.is_full
                ? 'border-red-300 bg-red-50'
                : 'border-[var(--card-border)] hover:border-[#E74C3C]'
            }`}
          >
            {/* Provider header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getProviderIcon(provider.provider)}</span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">{getProviderName(provider.provider)}</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {provider.file_count} files
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {(provider.total_size_gb || 0).toFixed(2)} GB
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {(provider.available_gb || 0).toFixed(2)} GB available
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(provider.used_percentage || 0)}`}
                style={{ width: `${provider.used_percentage || 0}%` }}
              ></div>
            </div>

            {/* Status */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">
                {(provider.used_percentage || 0).toFixed(1)}% used
              </span>
              {provider.is_full && (
                <span className="text-red-600 font-medium">
                  ⚠️ Storage Full
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warning message if any provider is full */}
      {stats.providers.some(p => p.is_full) && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
          <p className="font-medium">Storage Alert</p>
          <p className="text-sm mt-1">
            One or more storage providers have reached capacity. New downloads will use available providers.
          </p>
        </div>
      )}
    </div>
  );
}
