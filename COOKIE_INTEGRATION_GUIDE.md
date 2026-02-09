# Frontend Cookie Integration Guide

This guide shows how to integrate YouTube cookie extraction into your download flow.

## Overview

Instead of manually exporting cookies from the browser, we can extract cookies directly from the user's browser session and send them with the download request. This provides a seamless user experience.

## How It Works

1. User visits your app (must be logged into YouTube in the same browser)
2. Frontend extracts cookies using `document.cookie` API
3. Cookies are sent with the download request to your backend
4. Backend uses these cookies to authenticate with YouTube
5. Download proceeds without bot detection errors

## Files Created

- **`utils/cookieExtractor.ts`** - Cookie extraction utilities
- **`components/YouTubeLoginPrompt.tsx`** - UI component to prompt YouTube login
- **`lib/types.ts`** - Updated to include optional `cookies` field

## Integration Steps

### 1. Update Your Download Component

Modify your existing download button/form to extract and send cookies:

```typescript
// In your DownloadButton or similar component
import { extractYouTubeCookies, isLoggedIntoYouTube } from '@/utils/cookieExtractor';
import { api } from '@/lib/api';

export default function DownloadButton({ url }: { url: string }) {
  const handleDownload = async () => {
    try {
      // Extract cookies from browser
      const cookies = extractYouTubeCookies();

      // Send download request with cookies
      const response = await api.initiateDownload({
        url,
        cookies  // Send cookies with request
      });

      console.log('Download initiated:', response.jobId);
      // Continue with your existing flow...
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return <button onClick={handleDownload}>Download</button>;
}
```

### 2. Add YouTube Login Prompt (Optional but Recommended)

Show a login prompt if the user isn't logged into YouTube:

```typescript
// In your main page component
import YouTubeLoginPrompt from '@/components/YouTubeLoginPrompt';
import { isLoggedIntoYouTube } from '@/utils/cookieExtractor';
import { useState, useEffect } from 'react';

export default function DownloadPage() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Check if user is logged into YouTube
    const loggedIn = isLoggedIntoYouTube();
    setShowLoginPrompt(!loggedIn);
  }, []);

  return (
    <div>
      {showLoginPrompt && <YouTubeLoginPrompt />}

      {/* Your existing download form */}
    </div>
  );
}
```

### 3. Example: Complete Integration

Here's a complete example showing all the pieces together:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { extractYouTubeCookies, isLoggedIntoYouTube } from '@/utils/cookieExtractor';
import YouTubeLoginPrompt from '@/components/YouTubeLoginPrompt';

export default function DownloadPage() {
  const [url, setUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isLoggedIntoYouTube());
  }, []);

  const handleDownload = async () => {
    if (!url) return;

    setDownloading(true);
    try {
      // Extract cookies from browser (even if not logged in, send what we have)
      const cookies = extractYouTubeCookies();

      console.log(`Initiating download with ${Object.keys(cookies).length} cookies`);

      // Send download request
      const response = await api.initiateDownload({
        url,
        cookies  // Include cookies in request
      });

      console.log('Download job created:', response.jobId);

      // Poll for status...
      // (Your existing status polling logic)

    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1>YouTube Shorts Downloader</h1>

      {/* Show login prompt if not logged in */}
      {!isLoggedIn && (
        <YouTubeLoginPrompt
          onLoginStatusChange={(status) => setIsLoggedIn(status)}
        />
      )}

      {/* Download form */}
      <div className="mt-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube Shorts URL"
          className="border p-2 w-full"
        />
        <button
          onClick={handleDownload}
          disabled={downloading || !url}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}
```

## Important Notes

### Cookie Limitations

1. **HttpOnly Cookies**: The `document.cookie` API cannot access HttpOnly cookies (they're marked by the server for security). Most YouTube auth cookies are NOT HttpOnly, so this approach works for most cases.

2. **Same-Origin Only**: Cookies can only be accessed for the same domain. Since your app is on a different domain than YouTube, you can only access cookies if:
   - User previously visited `youtube.com` in the same browser
   - Cookies were set without the `SameSite=Strict` flag

3. **Cross-Origin Cookies**: For better cookie access, you may need to:
   - Ask users to login to YouTube in the same browser tab
   - Or build a browser extension for full cookie access

### Privacy & Security

1. **Cookies in Transit**: Cookies are sent over HTTPS to your backend
2. **No Storage**: Cookies are NOT stored on your server - only used for the download request
3. **Temporary Files**: Backend creates temp cookies files which are deleted after use
4. **User Consent**: Consider adding a privacy notice explaining cookie usage

### Fallback Behavior

The backend will still work without cookies by using:
1. User-provided cookies (best - authenticated session)
2. Server-side cookies file (if configured)
3. Android/iOS mobile clients (fallback - may be blocked for Shorts)

## Testing

### 1. Test Without Login

```typescript
const cookies = extractYouTubeCookies();
console.log('Cookies extracted:', Object.keys(cookies).length);
// Should show: 0 or very few cookies
```

### 2. Test With YouTube Login

1. Open `https://www.youtube.com` in same browser
2. Login to YouTube
3. Return to your app
4. Extract cookies again:

```typescript
const cookies = extractYouTubeCookies();
console.log('Cookies extracted:', Object.keys(cookies).length);
// Should show: 10-20+ cookies

console.log('Is logged in:', isLoggedIntoYouTube());
// Should show: true
```

### 3. Test Full Download Flow

1. Login to YouTube
2. Paste a YouTube Shorts URL
3. Click Download
4. Check browser console for:
   - "Initiating download with X cookies"
   - Download should succeed without bot detection

## Troubleshooting

### "No cookies found"

- User hasn't visited YouTube in this browser
- User cleared cookies
- Browser blocks third-party cookies
- **Solution**: Show YouTubeLoginPrompt component

### "Downloads still failing"

Even with cookies, downloads may fail if:
- Cookies are expired (YouTube rotates them)
- Server IP is heavily blocked by YouTube
- **Solution**: May need residential proxy as fallback

### "Cookies not being sent to backend"

- Check network tab in browser DevTools
- Verify `cookies` field is in request payload
- Check backend logs for cookie count
- **Solution**: Ensure types match between frontend/backend

## Browser Compatibility

| Browser | Cookie Access | Notes |
|---------|--------------|-------|
| Chrome | ✅ Yes | Full support |
| Firefox | ✅ Yes | Full support |
| Safari | ⚠️ Partial | May block cross-site cookies |
| Edge | ✅ Yes | Full support |

## Next Steps

1. Integrate cookie extraction into your download flow
2. Add YouTubeLoginPrompt component to your UI
3. Test with and without YouTube login
4. Monitor success rates
5. Consider proxy as fallback for heavily blocked IPs

## Complete Example Repository

Check the following files for complete examples:
- `/utils/cookieExtractor.ts` - Cookie utilities
- `/components/YouTubeLoginPrompt.tsx` - Login prompt UI
- `/lib/api.ts` - API client (unchanged, supports cookies via types)
- `/lib/types.ts` - TypeScript types with cookies field
