'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { Loader2, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[var(--card-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card-bg)]/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="text-xl font-bold text-[var(--foreground)]">
                YT Shorts DL
              </span>
            </Link>

            {/* Navigation Links - Only show when authenticated */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors hover:text-[#E74C3C] ${
                    isActive('/')
                      ? 'text-[#E74C3C]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/stats"
                  className={`text-sm font-medium transition-colors hover:text-[#E74C3C] ${
                    isActive('/stats')
                      ? 'text-[#E74C3C]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  Storage Stats
                </Link>
              </div>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[var(--text-muted)]" />
              ) : user ? (
                <>
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-[var(--text-muted)]">
                    <User className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation - Only show when authenticated */}
          {user && (
            <div className="md:hidden pb-4 flex items-center space-x-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-[#E74C3C] ${
                  isActive('/')
                    ? 'text-[#E74C3C]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/stats"
                className={`text-sm font-medium transition-colors hover:text-[#E74C3C] ${
                  isActive('/stats')
                    ? 'text-[#E74C3C]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Storage Stats
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
