import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // AVIF first — the hero portrait is the LCP element, and AVIF is roughly
    // 30% smaller than WebP at the same perceived quality.
    formats: ['image/avif', 'image/webp'],
    // Next 16 only honours qualities listed here; an unlisted `quality` prop
    // is silently ignored and the request falls back to 75.
    qualities: [62, 75],
  },

  // Long-lived immutable caching for the self-hosted font files. They are
  // content-hashed, so this is safe and removes them from the critical path on
  // any repeat visit.
  async headers() {
    return [
      {
        source: '/_next/static/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  poweredByHeader: false,
};

export default nextConfig;
