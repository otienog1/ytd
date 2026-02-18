'use client';

import { useEffect, useState } from 'react';
import { StorageDetailsModal } from './StorageDetailsModal';

interface StorageIndicatorProps {
  compact?: boolean;
}

interface StorageStatsResponse {
  providers: any[];
  total_used_gb: number;
  total_available_gb: number;
  overall_used_percentage: number;
}

export function StorageIndicator({ compact = false }: StorageIndicatorProps) {
  const [stats, setStats] = useState<StorageStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/storage/stats`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return null;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        >
          <span className="text-[var(--text-muted)]">Storage:</span>
          <span className={`font-medium ${getStatusColor(stats.overall_used_percentage)}`}>
            {stats.total_used_gb.toFixed(1)} GB / {(stats.total_used_gb + stats.total_available_gb).toFixed(1)} GB
          </span>
          <span className="text-[var(--text-muted)]">
            ({stats.overall_used_percentage.toFixed(0)}%)
          </span>
        </button>

        <StorageDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[var(--card-bg)] shadow-2xl p-4 border border-[var(--card-border)] hover:shadow-xl transition-shadow w-full text-left"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Total Storage</span>
          <span className="text-sm text-[var(--text-muted)]">
            {stats.total_used_gb.toFixed(2)} GB used
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              stats.overall_used_percentage >= 90
                ? 'bg-red-500'
                : stats.overall_used_percentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${stats.overall_used_percentage}%` }}
          ></div>
        </div>
      </button>

      <StorageDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
