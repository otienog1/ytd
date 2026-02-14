import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { StructuredData } from "@/components/StructuredData";

const overpassMono = Overpass_Mono({
  variable: "--font-overpass-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ytshortsdownload.vercel.app'),

  title: {
    default: 'YouTube Shorts Downloader - Download Shorts Videos Online Free',
    template: '%s | YouTube Shorts Downloader'
  },

  description: 'Free online YouTube Shorts downloader. Download YouTube Shorts videos in HD quality without watermark. Fast, secure, and no registration required. Works on all devices.',

  keywords: [
    'youtube shorts downloader',
    'download youtube shorts',
    'youtube shorts download',
    'shorts downloader',
    'youtube shorts to mp4',
    'save youtube shorts',
    'free youtube shorts downloader',
    'youtube shorts video downloader',
    'download shorts without watermark'
  ],

  authors: [{ name: 'YouTube Shorts Downloader' }],
  creator: 'YouTube Shorts Downloader',
  publisher: 'YouTube Shorts Downloader',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ytshortsdownload.vercel.app',
    siteName: 'YouTube Shorts Downloader',
    title: 'YouTube Shorts Downloader - Download Shorts Videos Free',
    description: 'Free online YouTube Shorts downloader. Download Shorts videos in HD quality without watermark. Fast and secure.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YouTube Shorts Downloader',
      }
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Shorts Downloader - Download Shorts Videos Free',
    description: 'Free online YouTube Shorts downloader. Download Shorts videos in HD quality without watermark.',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // TODO: Add these after verifying with Google/Bing
  // verification: {
  //   google: 'your-google-verification-code',
  //   bing: 'your-bing-verification-code',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6200632303984293" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6200632303984293"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${overpassMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StructuredData />
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
