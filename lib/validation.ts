import { z } from "zod";

// Platform enum matching backend
export type Platform = "youtube" | "tiktok" | "instagram" | "unknown";

// URL patterns for each platform
const PLATFORM_PATTERNS: Record<Exclude<Platform, "unknown">, RegExp[]> = {
  youtube: [
    // YouTube Shorts
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
    // Short youtu.be links
    /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
  ],
  tiktok: [
    // Standard TikTok video URL
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)(\?.*)?$/,
    // Short vm.tiktok.com links
    /^https?:\/\/vm\.tiktok\.com\/[\w]+\/?(\?.*)?$/,
    // Mobile t.tiktok.com links
    /^https?:\/\/(www\.)?tiktok\.com\/t\/[\w]+\/?(\?.*)?$/,
    // Generic tiktok.com with video
    /^https?:\/\/(www\.)?tiktok\.com\/.*\/video\/(\d+)(\?.*)?$/,
  ],
  instagram: [
    // Instagram posts
    /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?(\?.*)?$/,
    // Instagram reels (singular)
    /^https?:\/\/(www\.)?instagram\.com\/reel\/[\w-]+\/?(\?.*)?$/,
    // Instagram reels (plural)
    /^https?:\/\/(www\.)?instagram\.com\/reels\/[\w-]+\/?(\?.*)?$/,
    // Instagram stories
    /^https?:\/\/(www\.)?instagram\.com\/stories\/[\w.-]+\/\d+\/?(\?.*)?$/,
    // Instagram TV (IGTV)
    /^https?:\/\/(www\.)?instagram\.com\/tv\/[\w-]+\/?(\?.*)?$/,
  ],
};

/**
 * Detect the platform from a URL
 */
export function detectPlatform(url: string): Platform {
  if (!url) return "unknown";

  const trimmedUrl = url.trim();

  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(trimmedUrl)) {
        return platform as Platform;
      }
    }
  }

  return "unknown";
}

/**
 * Check if a URL is from a supported platform
 */
export function isSupportedUrl(url: string): boolean {
  return detectPlatform(url) !== "unknown";
}

/**
 * Get list of supported platforms
 */
export function getSupportedPlatforms(): Platform[] {
  return ["youtube", "tiktok", "instagram"];
}

/**
 * URL validation schema for all supported platforms
 */
export const urlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => isSupportedUrl(url),
      {
        message:
          "Please enter a valid video URL (YouTube Shorts, TikTok, or Instagram)",
      }
    ),
});

export type UrlFormData = z.infer<typeof urlSchema>;

/**
 * Extract video ID from URL (any platform)
 */
export function extractVideoId(url: string): string | null {
  const platform = detectPlatform(url);

  switch (platform) {
    case "youtube": {
      // YouTube Shorts: youtube.com/shorts/{ID} or youtu.be/{ID}
      const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];

      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) return shortMatch[1];

      return null;
    }

    case "tiktok": {
      // TikTok: /video/{numeric_id}
      const match = url.match(/\/video\/(\d+)/);
      if (match) return match[1];

      // For short URLs, generate a hash-like identifier
      // (actual resolution happens on backend)
      return `tiktok_${url.split("/").pop()?.split("?")[0] || "unknown"}`;
    }

    case "instagram": {
      // Instagram: /p/{shortcode} or /reel/{shortcode} or /reels/{shortcode}
      const postMatch = url.match(/\/(p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/);
      if (postMatch) return postMatch[2];

      // Stories: /stories/{username}/{story_id}
      const storyMatch = url.match(/\/stories\/[\w.-]+\/(\d+)/);
      if (storyMatch) return storyMatch[1];

      return null;
    }

    default:
      return null;
  }
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    youtube: "YouTube Shorts",
    tiktok: "TikTok",
    instagram: "Instagram",
    unknown: "Unknown",
  };
  return names[platform];
}

/**
 * Get platform icon/emoji
 */
export function getPlatformIcon(platform: Platform): string {
  const icons: Record<Platform, string> = {
    youtube: "📺",
    tiktok: "🎵",
    instagram: "📸",
    unknown: "🔗",
  };
  return icons[platform];
}

// Legacy exports for backwards compatibility
const YOUTUBE_SHORTS_PATTERNS = PLATFORM_PATTERNS.youtube;

export function isValidYouTubeShorts(url: string): boolean {
  return detectPlatform(url) === "youtube";
}

export function isValidVideoUrl(url: string): boolean {
  return isSupportedUrl(url);
}
