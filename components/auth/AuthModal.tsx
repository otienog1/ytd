'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  const handleClose = () => {
    onClose();
    // Reset to login view after closing
    setTimeout(() => setView('login'), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[var(--card-bg)] border-[var(--card-border)]">
        {view === 'login' ? (
          <LoginForm
            onSwitchToSignup={() => setView('signup')}
            onClose={handleClose}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setView('login')}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
