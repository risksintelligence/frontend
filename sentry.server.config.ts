import * as Sentry from "@sentry/nextjs";

/**
 * RRIO Server-Side Sentry Configuration
 * Server-side error monitoring for API routes and SSR
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Performance monitoring for server-side
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Server-specific integrations
  integrations: [
    Sentry.httpIntegration(),
  ],
  
  beforeSend(event) {
    // Add RRIO-specific server context
    event.tags = {
      ...event.tags,
      component: 'frontend-server',
      platform: 'rrio',
      runtime: 'nodejs',
    };
    
    event.contexts = {
      ...event.contexts,
      app: {
        name: 'RRIO Frontend Server',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
      runtime: {
        name: 'node',
        version: process.version,
      },
    };
    
    return event;
  },
  
  // Filter server-side noise
  ignoreErrors: [
    'ECONNRESET',
    'ENOTFOUND',
    'ECONNREFUSED', 
    'socket hang up',
    'EPIPE',
    'Client disconnected',
  ],
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
});