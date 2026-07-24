import { ImageResponse } from 'next/og';
import { siteConfig } from '@/site.config';

// Social scrapers don't render SVG, so the OG image is a real raster (PNG),
// generated at build time via ImageResponse. See docs/SEO-BASELINE.md §1.
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  // Monochrome, matching the default theme. System font only (no network fetch).
  const tile = (opacity: number) => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    background: '#1c1917',
    opacity,
  });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '96px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          width: 92,
          marginBottom: 48,
        }}
      >
        <div style={tile(1)} />
        <div style={tile(0.55)} />
        <div style={tile(0.55)} />
        <div style={tile(1)} />
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: '-2px',
          color: '#1c1917',
        }}
      >
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 32, color: '#78716c', marginTop: 8 }}>
        {siteConfig.tagline}
      </div>
    </div>,
    size
  );
}
