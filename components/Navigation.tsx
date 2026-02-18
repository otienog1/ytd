'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/history', label: 'History' },
  ];

  return (
    <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-[var(--foreground)] hover:text-[#E74C3C] transition-colors"
            >
              YouTube Shorts Downloader
            </Link>
            <div className="flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[#E74C3C] border-b-2 border-[#E74C3C]'
                      : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
