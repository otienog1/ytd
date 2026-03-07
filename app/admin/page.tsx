'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserData {
  userId: string;
  downloadCount: number;
  completedCount: number;
  failedCount: number;
  lastDownloadAt: string | null;
  totalStorageBytes: number;
  totalStorageGB: number;
}

interface UsersResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if user is admin (you can add the admin email to env var)
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  // Fetch users
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery<UsersResponse>({
    queryKey: ['admin-users', currentPage, debouncedSearch],
    queryFn: () => api.getAllUsers(currentPage, itemsPerPage, debouncedSearch || undefined),
    enabled: isAdmin,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.deleteUserData(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUser(null);
      alert('User data deleted successfully');
    },
    onError: (error: any) => {
      alert(`Failed to delete user data: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (confirm(`Are you sure you want to delete all data for user: ${userId}?\n\nThis action cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

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
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[#E74C3C]" />
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                User Management
              </h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded hover:bg-[var(--card-border)] transition-colors"
            >
              Back to Home
            </button>
          </div>
          <p className="text-[var(--text-muted)]">
            Manage users and their download data
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:border-[#E74C3C] text-[var(--foreground)]"
            />
          </div>
        </div>

        {/* Error State */}
        {usersError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load users. You may not have admin privileges.</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {usersLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E74C3C]"></div>
          </div>
        )}

        {/* Users Table */}
        {!usersLoading && usersData && (
          <>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Completed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Failed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Storage Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Last Download
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)]">
                    {usersData.users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)]">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      usersData.users.map((user) => (
                        <tr
                          key={user.userId}
                          className="hover:bg-[var(--background)] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-[var(--foreground)]">
                              {user.userId}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                            {user.downloadCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                            {user.completedCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                            {user.failedCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                            <div>
                              <div className="font-medium">{user.totalStorageGB} GB</div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {formatBytes(user.totalStorageBytes)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                            {formatDate(user.lastDownloadAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteUser(user.userId)}
                              disabled={deleteUserMutation.isPending && selectedUser === user.userId}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deleteUserMutation.isPending && selectedUser === user.userId
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {usersData.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-[var(--text-muted)]">
                  Showing page {usersData.page} of {usersData.totalPages} ({usersData.total} total users)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={!usersData.hasPrevious}
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded hover:bg-[var(--card-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 text-[var(--foreground)]">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!usersData.hasNext}
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded hover:bg-[var(--card-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
