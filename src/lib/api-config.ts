/**
 * Centralized API Configuration for RRIO Frontend
 * Handles both development and production API routing
 */

import { createMockFetch, shouldUseMockApi } from './mock-api';

/**
 * Get the correct API base URL for the current environment
 * Always use direct backend URL to avoid Next.js rewrite issues
 */
export function getApiBaseUrl(): string {
  // More robust production detection
  const isProduction = process.env.NODE_ENV === 'production' || 
                       typeof window !== 'undefined' && window.location.hostname.includes('.up.railway.app');
  
  if (isProduction) {
    // Use direct backend URL in production
    return 'https://backend-production-83c7.up.railway.app';
  } else {
    // In development, use the configured backend URL or default to localhost
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  }
}

/**
 * Build a complete API endpoint URL
 * @param path - The API path (e.g., '/api/v1/analytics/geri')
 * @returns Complete URL for the API endpoint
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl + normalizedPath;
}

/**
 * Get the appropriate fetch function for the current environment
 * In CI/test environments, use mock fetch to avoid production API calls
 */
export function getApiFetch(): typeof fetch {
  if (shouldUseMockApi()) {
    return createMockFetch();
  }
  return fetch;
}

/**
 * Common fetch options for API calls
 */
export const defaultFetchOptions: RequestInit = {
  cache: "no-store",
  headers: { 
    "Content-Type": "application/json",
  },
};