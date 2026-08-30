import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
  { key: 'Origin-Agent-Cluster', value: '?1' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://www.tiktok.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; object-src 'none'; img-src 'self' data: blob: https://img.clerk.com https://*.clerk.accounts.dev; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://*.clerk.accounts.dev https://api.clerk.com https://challenges.cloudflare.com; upgrade-insecure-requests" },
];

const privateControlPlaneHeaders = [
  { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/admin/:path*', headers: privateControlPlaneHeaders },
      { source: '/api/admin/:path*', headers: privateControlPlaneHeaders },
      { source: '/akun/:path*', headers: privateControlPlaneHeaders },
      { source: '/masuk/:path*', headers: privateControlPlaneHeaders },
      { source: '/daftar/:path*', headers: privateControlPlaneHeaders },
    ];
  },
};

export default nextConfig;
