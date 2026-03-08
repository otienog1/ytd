'use client';


//src/components/Header.tsx

import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon, Shield, HardDrive } from 'lucide-react';

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    // Check if user is admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isAdmin = user?.email === adminEmail;

    return (
        <header className="bg-[var(--card-bg)] border-b border-[var(--card-border)]">
            <div className="container mx-auto px-4 py-5">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-[var(--foreground)] hover:text-[#E74C3C] transition-colors">
                        YTShorts<span className="text-[#E74C3C]">DL</span>
                    </Link>
                    <div className="flex gap-8 items-center">
                        {isAdmin && (
                            <>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium"
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin
                                </Link>
                                <Link
                                    href="/stats"
                                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium"
                                >
                                    <HardDrive className="w-4 h-4" />
                                    Storage
                                </Link>
                            </>
                        )}
                        <Link href="/faq" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                            FAQ
                        </Link>
                        <Link href="/privacy-policy" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                            Privacy
                        </Link>
                        <Link href="/terms-of-use" className="text-sm text-[var(--text-muted)] hover:text-[#E74C3C] transition-colors font-medium">
                            Terms
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md hover:bg-[var(--border-color)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-[var(--text-muted)]" />
                            ) : (
                                <Moon className="w-5 h-5 text-[var(--text-muted)]" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
