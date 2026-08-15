import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { siteConfig } from '@/site.config';
import { LenisProvider } from '@/lib/animations/lenis-provider';
import { ConsentBanner } from '@/components/consent-banner';
import './globals.css';

// Self-hosted at build time by next/font, display: swap (SEO-BASELINE §5).
// Geist carries both roles; globals.css points --font-display and --font-body
// at it, so the library's Manrope/Inter mapping is overridden without touching
// the trencadis:css region.
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.ogLocale,
    // og:image (+ twitter:image) come from app/opengraph-image.tsx (generated PNG).
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  // A client site is meant to be found — index/follow is the default, so no
  // `robots` override here (unlike the Trencadís showcase, which is noindex).
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground min-h-screen antialiased">
        {siteConfig.smoothScroll ? <LenisProvider>{children}</LenisProvider> : children}
        <ConsentBanner />
      </body>
    </html>
  );
}
