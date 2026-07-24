import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enforce consistent URLs (see docs/SEO-BASELINE.md §3). Client sites tune
  // www/non-www redirects at the Vercel level; the showcase keeps it simple.
  trailingSlash: false,
  // All showcase imagery is local (public/placeholders) — no remote hosts by design.
  // Placeholders are our own SVGs; allow next/image to serve them (they are
  // trusted, first-party files, sandboxed by the CSP below).
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
