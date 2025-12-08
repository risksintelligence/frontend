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
  // Removed rewrites - frontend now calls backend directly via api-config.ts
  // This prevents proxy issues and socket hang up errors
  // Removed headers config - no longer needed since we call backend directly
  // CORS is handled by the backend FastAPI application
};

export default nextConfig;
