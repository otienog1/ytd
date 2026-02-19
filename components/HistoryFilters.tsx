'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import type { HistoryFilters as Filters } from '@/lib/types';

interface HistoryFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function HistoryFilters({
  filters,
  onFiltersChange,
  onRefresh,
  isRefreshing = false,
}: HistoryFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as Filters['status'],
      page: 1,
    });
  };

  return (
    <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)] space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-[var(--foreground)] mb-2"
          >
            Search by title
          </label>
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search videos..."
            className="w-full px-4 py-2 border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-[var(--foreground)] mb-2"
          >
            Filter by status
          </label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent transition-all"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
            <option value="queued">Queued</option>
          </select>
        </div>

        {/* Refresh Button */}
        <div className="sm:w-auto flex items-end">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#E74C3C] text-white font-medium hover:bg-[#c0392b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[42px]"
            aria-label="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--text-muted)]">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-3 py-1 bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)]">
                Search: {filters.search}
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)]">
                Status: {filters.status}
              </span>
            )}
            <button
              onClick={() => {
                setSearchInput('');
                onFiltersChange({ page: 1, limit: filters.limit });
              }}
              className="px-3 py-1 text-[#E74C3C] hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
