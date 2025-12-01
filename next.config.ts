import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Turbopack for Next.js 16
  turbopack: {
    resolveAlias: {
      'prop-types': 'prop-types',
    },
  },
  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8001/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
