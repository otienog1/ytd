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

  // Don't show anything - cookies can't be reliably detected from browser
  // due to HttpOnly restrictions. Just let downloads work with fallback methods.
  return null;
}
