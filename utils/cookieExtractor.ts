/**
 * YouTube Cookie Extractor for Frontend
 *
 * This utility extracts YouTube cookies from the browser and sends them
 * with download requests to bypass bot detection.
 *
 * IMPORTANT: This only works if the user is logged into YouTube in the same browser.
 */

export interface YouTubeCookies {
  [key: string]: string;
}

/**
 * Extract YouTube cookies from browser
 *
 * Note: This uses the document.cookie API which only has access to
 * cookies that are not HttpOnly. Most YouTube auth cookies ARE HttpOnly,
 * so this may return limited cookies.
 *
 * For better results, we try to get cookies from localStorage/sessionStorage
 * or the user can manually provide them.
 */
export function extractYouTubeCookies(): YouTubeCookies {
  const cookies: YouTubeCookies = {};

  // Get all cookies from document.cookie (non-HttpOnly only)
  const cookieString = document.cookie;

  if (cookieString) {
    // Parse cookies
    const cookiePairs = cookieString.split(';');

    for (const pair of cookiePairs) {
      const [name, value] = pair.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    }
  }

  // Try to extract additional auth info from localStorage
  try {
    // YouTube sometimes stores auth tokens in localStorage
    const ytConfig = localStorage.getItem('yt-remote-session-name');
    if (ytConfig) {
      cookies['yt-remote-session-name'] = ytConfig;
    }
  } catch (e) {
    // localStorage might not be accessible
  }

  if (Object.keys(cookies).length === 0) {
    console.warn('No cookies found - YouTube auth cookies are likely HttpOnly');
  } else {
    console.log(`Extracted ${Object.keys(cookies).length} cookies from browser`);
  }

  return cookies;
}

/**
 * Check if user appears to be logged into YouTube
 * This checks for common YouTube authentication cookies
 */
export function isLoggedIntoYouTube(): boolean {
  const cookies = document.cookie;

  // Common YouTube auth cookies
  const authCookies = ['SSID', 'APISID', 'SAPISID', 'LOGIN_INFO'];

  return authCookies.some(cookieName => cookies.includes(cookieName));
}

/**
 * Open YouTube in a new tab for user to login
 */
export function openYouTubeLogin() {
  window.open('https://www.youtube.com', '_blank');
}

/**
 * Instructions for the user on how to login to YouTube
 */
export const LOGIN_INSTRUCTIONS = {
  title: "Login to YouTube to Enable Downloads",
  steps: [
    "Click 'Login to YouTube' button to open YouTube in a new tab",
    "Login to your YouTube account in that tab",
    "Browse YouTube or watch a video (this refreshes cookies)",
    "Come back to this tab and try downloading again",
    "Your cookies will be automatically used for the download"
  ],
  notes: [
    "You only need to do this once per browser session",
    "Your cookies are sent directly from your browser to our server",
    "We don't store your cookies - they're used only for the download request",
    "This helps bypass YouTube's bot detection by using your authenticated session"
  ]
};

/**
 * Prompt user to login to YouTube if not already logged in
 * Returns true if user appears logged in, false otherwise
 */
export async function ensureYouTubeLogin(): Promise<boolean> {
  if (isLoggedIntoYouTube()) {
    console.log('User appears to be logged into YouTube');
    return true;
  }

  console.warn('User does not appear to be logged into YouTube');
  return false;
}
