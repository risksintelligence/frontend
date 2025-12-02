/**
 * Centralized API Configuration for RRIO Frontend
 * Handles both development and production API routing
 */

/**
 * Get the correct API base URL for the current environment
 * In production: Use relative paths to leverage Next.js rewrites and avoid CORS
 * In development: Use full backend URL for direct connection
 */
export function getApiBaseUrl(): string {
  // More robust production detection
  const isProduction = process.env.NODE_ENV === 'production' || 
                       typeof window !== 'undefined' && window.location.hostname.includes('.up.railway.app');
  
  if (isProduction) {
    // Use relative paths in production - Next.js will rewrite /api/v1/* to backend
    return '';
  } else {
    // In development, use the configured backend URL or default to localhost
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";
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
 * Common fetch options for API calls
 */
export const defaultFetchOptions: RequestInit = {
  cache: "no-store",
  headers: { 
    "Content-Type": "application/json",
  },
};