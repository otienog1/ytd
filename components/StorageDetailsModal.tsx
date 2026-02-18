'use client';

import { X } from 'lucide-react';
import { StorageStats } from './StorageStats';

interface StorageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StorageDetailsModal({ isOpen, onClose }: StorageDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[var(--card-bg)] rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Storage Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--background)] rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-[var(--foreground)]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <StorageStats />
          </div>
        </div>
      </div>
    </div>
  );
}
