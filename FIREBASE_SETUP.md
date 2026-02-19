# Firebase Authentication Setup Guide

## Overview

This application uses Firebase Authentication to protect certain features:
- **Storage Stats Page** (`/stats`) - Only accessible to authenticated users
- **Navigation Links** - Only visible when logged in
- **User Management** - Email/Password and Google Sign-In support

## Prerequisites

1. **Firebase Account**: Create one at [firebase.google.com](https://firebase.google.com)
2. **Node.js**: v18+ installed
3. **npm**: For installing Firebase SDK

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "yt-shorts-downloader")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable the following sign-in methods:

### Email/Password Authentication
- Click **"Email/Password"**
- Toggle **"Enable"**
- Click **"Save"**

### Google Authentication
- Click **"Google"**
- Toggle **"Enable"**
- Select a **support email** from dropdown
- Click **"Save"**

## Step 3: Register Web App

1. In Firebase Console, go to **Project Overview** (gear icon) → **Project settings**
2. Scroll down to "Your apps"
3. Click the **Web icon** (`</>`)
4. Register app:
   - **App nickname**: "YouTube Shorts Downloader Web"
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
5. **Copy the configuration** - you'll need these values

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Firebase config values:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

**Where to find these values:**
- Firebase Console → Project Settings → General → Your apps → Web app → Config

## Step 5: Install Firebase SDK

```bash
cd frontend
npm install firebase
```

## Step 6: Authorize Domain (Production)

When deploying to production:

1. Go to Firebase Console → **Authentication** → **Settings** tab
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your production domain (e.g., `yourapp.vercel.app`)

## Architecture

### Files Created

**Authentication Context:**
- `lib/firebase.ts` - Firebase initialization
- `contexts/AuthContext.tsx` - Auth state management

**Components:**
- `components/auth/LoginForm.tsx` - Login form
- `components/auth/SignupForm.tsx` - Sign up form
- `components/auth/AuthModal.tsx` - Modal wrapper
- `components/auth/ProtectedRoute.tsx` - Route protection
- `components/Navbar.tsx` - Navigation bar with auth

**Pages:**
- `app/stats/page.tsx` - Protected storage stats page

### Authentication Flow

1. **User clicks "Sign In"** → AuthModal opens
2. **User enters credentials** or **clicks "Google"**
3. **Firebase validates** credentials
4. **AuthContext updates** user state
5. **Protected routes** become accessible
6. **Navbar shows** navigation links

### Protected Content

**Requires Authentication:**
- ✅ `/stats` page (Storage Statistics)
- ✅ Navbar links (Home, Storage Stats)
- ✅ User profile display

**Public Access:**
- ✅ `/` homepage (Video downloader)
- ✅ All download functionality

## Usage

### Sign Up
1. Click "Sign In" button in navbar
2. Click "Sign up" link
3. Enter email and password
4. Click "Create Account"

**OR** click "Google" for instant signup

### Sign In
1. Click "Sign In" button in navbar
2. Enter email and password
3. Click "Sign In"

**OR** click "Google" for instant signin

### Access Storage Stats
1. Sign in first
2. Click "Storage Stats" in navbar
3. View real-time cloud storage metrics

### Sign Out
Click "Logout" button in navbar

## Security Best Practices

### Environment Variables
- ✅ **Never commit** `.env.local` to git
- ✅ `.env.example` contains placeholders only
- ✅ All Firebase config uses `NEXT_PUBLIC_*` prefix (safe for browser)

### Firebase Rules
The API keys in `.env.local` are **safe to expose** in client-side code because:
- Firebase Security Rules protect your data
- Authentication is required for protected features
- API key only identifies your Firebase project

### Recommended: Set up Firebase Security Rules

In Firebase Console → **Firestore Database** (if using):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require auth for all reads/writes
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing

### Test Authentication Locally

1. Start development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000

3. Click "Sign In" → Create account

4. Verify:
   - ✅ Sign up works
   - ✅ Google sign-in works
   - ✅ Navigation appears after login
   - ✅ Can access `/stats` page
   - ✅ Redirected from `/stats` if not logged in

### Check Firebase Console

- Go to **Authentication** → **Users** tab
- You should see your test user listed

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
**Fix:** Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`

### "Firebase: Error (auth/invalid-api-key)"
**Fix:** Verify `NEXT_PUBLIC_FIREBASE_API_KEY` is correct (copy from Firebase Console)

### Google Sign-In doesn't work
**Fix:**
1. Ensure Google provider is enabled in Firebase Console
2. Check that domain is authorized (for production)
3. Verify support email is selected

### Can't access /stats page after logging in
**Fix:**
1. Check browser console for errors
2. Verify Firebase connection in Network tab
3. Try clearing browser cache and localStorage

### User state not persisting after refresh
**Fix:** Firebase automatically persists auth state. If not working:
1. Check browser localStorage (should have Firebase tokens)
2. Verify `onAuthStateChanged` is set up in AuthContext
3. Clear browser cache and try again

## Production Deployment

### Vercel / Next.js Deployment

1. Add environment variables in your hosting platform:
   - Go to Settings → Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables
   - Use same values from `.env.local`

2. Deploy:
   ```bash
   git push origin main
   ```

3. After deployment, authorize your domain in Firebase Console

### Verify Production Setup

1. Visit your production URL
2. Try signing up
3. Verify Firebase Console shows the new user

## Additional Features

### Password Reset

Already implemented! User can:
1. Click "Forgot password?" (add this link if needed)
2. Enter email
3. Receive reset link via email

### Email Verification

To require email verification:
```typescript
// In contexts/AuthContext.tsx after signup
await sendEmailVerification(user);
```

### Custom Claims (Admin Users)

To add admin roles:
1. Use Firebase Admin SDK (backend)
2. Set custom claims on user tokens
3. Check claims in AuthContext

## Support

- **Firebase Docs**: https://firebase.google.com/docs/auth
- **Next.js + Firebase**: https://github.com/vercel/next.js/tree/canary/examples/with-firebase

## Summary

You now have:
- ✅ Firebase Authentication configured
- ✅ Email/Password and Google sign-in
- ✅ Protected `/stats` route
- ✅ Conditional navbar visibility
- ✅ Secure environment variable setup
- ✅ Production-ready authentication flow
