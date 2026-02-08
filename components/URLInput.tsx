'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { urlSchema, type UrlFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { DownloadStatus } from '@/lib/types';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  status?: DownloadStatus | null;
  onUrlChange?: (url: string) => void;
}

export function URLInput({ onSubmit, isLoading, status, onUrlChange }: URLInputProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  });

  const urlValue = watch('url');

  useEffect(() => {
    if (urlValue && onUrlChange) {
      onUrlChange(urlValue);
    }
  }, [urlValue, onUrlChange]);

  const handleFormSubmit = (data: UrlFormData) => {
    onSubmit(data.url);
  };

  const getProgressValue = () => {
    if (!status) return 0;
    if (status.status === 'completed') return 100;
    if (status.status === 'failed') return 0;
    return status.progress || 0;
  };

  // isLoading already includes both mutation pending and status processing states
  const isProcessing = isLoading;
  const isCompleted = status?.status === 'completed';
  const progress = getProgressValue();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor="url" className="text-base font-semibold text-[var(--foreground)]">YouTube Shorts URL</Label>
        <div className="flex gap-3">
          <Input
            id="url"
            type="text"
            placeholder="Paste your YouTube Shorts URL here..."
            {...register('url')}
            disabled={isLoading || isProcessing}
            className={errors.url ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          <div className="relative">
            <Button
              type="submit"
              disabled={isLoading || isProcessing || isCompleted}
              size="sm"
              className={`whitespace-nowrap h-12 px-3 uppercase text-sm tracking-wider relative overflow-hidden transition-colors duration-300 ${
                isCompleted ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  PROCESSING {progress}%
                </>
              ) : isCompleted ? (
                <>
                  <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  DONE
                </>
              ) : (
                <>
                  <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  DOWNLOAD
                </>
              )}
            </Button>
            {isProcessing && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2d2d2d]">
                <div
                  className="h-full bg-gradient-to-r from-[#E74C3C] to-[#c0392b] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {isCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600" />
            )}
          </div>
        </div>
        {errors.url && (
          <div className="bg-red-900/20 border border-red-500/30 p-3">
            <p className="text-sm text-red-400">{errors.url.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}
