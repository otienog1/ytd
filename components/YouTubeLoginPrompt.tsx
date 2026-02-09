'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { isLoggedIntoYouTube, openYouTubeLogin, LOGIN_INSTRUCTIONS } from '@/utils/cookieExtractor';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface YouTubeLoginPromptProps {
  onLoginStatusChange?: (isLoggedIn: boolean) => void;
}

export default function YouTubeLoginPrompt({ onLoginStatusChange }: YouTubeLoginPromptProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check login status on mount
    const loggedIn = isLoggedIntoYouTube();
    setIsLoggedIn(loggedIn);
    onLoginStatusChange?.(loggedIn);

    // Check periodically (in case user logs in in another tab)
    const interval = setInterval(() => {
      const newStatus = isLoggedIntoYouTube();
      if (newStatus !== isLoggedIn) {
        setIsLoggedIn(newStatus);
        onLoginStatusChange?.(newStatus);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoggedIn, onLoginStatusChange]);

  const handleLoginClick = () => {
    openYouTubeLogin();
    setShowInstructions(true);
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span>YouTube session detected</span>
      </div>
    );
  }

  return (
    <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            YouTube Login Required
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            To download YouTube Shorts, you need to be logged into YouTube in this browser.
            This helps bypass bot detection.
          </p>

          <Button
            onClick={handleLoginClick}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Login to YouTube
          </Button>

          {showInstructions && (
            <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-100 mb-2">
                {LOGIN_INSTRUCTIONS.title}
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                {LOGIN_INSTRUCTIONS.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <div className="mt-3 space-y-1">
                {LOGIN_INSTRUCTIONS.notes.map((note, index) => (
                  <p key={index} className="text-xs text-yellow-700 dark:text-yellow-300">
                    • {note}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
