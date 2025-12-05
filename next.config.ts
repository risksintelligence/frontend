import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Turbopack for Next.js 16
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      'prop-types': 'prop-types',
    },
  },
  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // In production on Railway, use the backend URL
    // In development, use local backend
    const isProduction = process.env.NODE_ENV === 'production';
    const backendUrl = isProduction 
      ? 'https://backend-production-83c7.up.railway.app'
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
