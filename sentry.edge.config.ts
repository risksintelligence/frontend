import * as Sentry from "@sentry/nextjs";

/**
 * RRIO Edge Runtime Sentry Configuration  
 * Error monitoring for Edge API routes and middleware
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Performance monitoring for edge
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  
  beforeSend(event) {
    // Add RRIO-specific edge context
    event.tags = {
      ...event.tags,
      component: 'frontend-edge',
      platform: 'rrio',
      runtime: 'edge',
    };
    
    event.contexts = {
      ...event.contexts,
      app: {
        name: 'RRIO Frontend Edge',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
      runtime: {
        name: 'edge',
        version: 'unknown',
      },
    };
    
    return event;
  },
  
  // Edge-specific error filtering
  ignoreErrors: [
    'Network request failed',
    'Body is unusable',
    'Stream error',
  ],
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
});