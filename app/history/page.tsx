'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HistoryList } from '@/components/HistoryList';
import { HistoryFilters } from '@/components/HistoryFilters';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import type { HistoryFilters as Filters } from '@/lib/types';

export default function HistoryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });

  // Fetch history data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['history', filters],
    queryFn: () => api.getDownloadHistory(filters),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (jobId: string) => api.deleteDownload(jobId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Download deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete download',
        variant: 'destructive',
      });
    },
  });

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this download?')) {
      deleteMutation.mutate(jobId);
    }
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download started',
      description: 'Your video download has started',
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
              Download History
            </h1>
            <p className="text-base text-[var(--text-muted)] max-w-2xl mx-auto">
              View and manage your YouTube Shorts download history
            </p>
          </div>

          {/* Filters */}
          <HistoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={() => refetch()}
            isRefreshing={isLoading}
          />

          {/* Results Count */}
          {data && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                Showing{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {data.items.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {data.total}
                </span>{' '}
                results
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Page{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {data.page}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--foreground)]">
                  {data.totalPages}
                </span>
              </p>
            </div>
          )}

          {/* History List */}
          <HistoryList
            items={data?.items || []}
            onDelete={handleDelete}
            onDownload={handleDownload}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
              hasNext={data.hasNext}
              hasPrevious={data.hasPrevious}
            />
          )}
        </div>
      </div>
    </main>
  );
}
