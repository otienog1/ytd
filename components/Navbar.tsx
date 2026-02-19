'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { Loader2, LogOut, User, Moon, Sun } from 'lucide-react';
import Logo from '@/app/mrdl_logo.svg';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src={Logo}
                alt="YTShortsDL Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-[var(--foreground)]">
                YTShorts<span className="text-[#E74C3C]">DL</span>
              </span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {user && (
                <>
                  <Link
                    href="/history"
                    className={`text-sm font-medium transition-colors hover:text-[#E74C3C] ${
                      isActive('/history')
                        ? 'text-[#E74C3C]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    History
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
                </>
              )}
            </div>

            {/* Right Section - FAQ/Privacy/Terms for anonymous, User info for authenticated */}
            <div className="flex items-center gap-4">
              {!user && (
                <div className="hidden md:flex gap-8 items-center">
                  <Link href="/faq" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                    FAQ
                  </Link>
                  <Link href="/privacy-policy" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                    Privacy
                  </Link>
                  <Link href="/terms-of-use" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                    Terms
                  </Link>
                </div>
              )}

              {/* Theme Toggle - Available for all users */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-[var(--border-color)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-[var(--text-muted)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--text-muted)]" />
                )}
              </button>

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
