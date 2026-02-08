import { z } from "zod";

// YouTube Shorts URL patterns
const YOUTUBE_SHORTS_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
  /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
];

export const urlSchema = z.object({
  url: z.string()
    .url("Please enter a valid URL")
    .refine((url) => {
      return YOUTUBE_SHORTS_PATTERNS.some(pattern => pattern.test(url));
    }, {
      message: "Please enter a valid YouTube Shorts URL (youtube.com/shorts/...)",
    }),
});

export type UrlFormData = z.infer<typeof urlSchema>;

export function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_SHORTS_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      return match[1] || match[2];
    }
  }
  return null;
}

export function isValidYouTubeShorts(url: string): boolean {
  try {
    urlSchema.parse({ url });
    return true;
  } catch {
    return false;
  }
}
