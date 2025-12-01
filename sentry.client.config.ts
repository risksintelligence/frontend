/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // ...
  debug: process.env.NODE_ENV === "development",
  
  environment: process.env.NODE_ENV,
  
  // Replay settings (using new API)
  replaysSessionSampleRate: 0.1, // 10% of sessions will be recorded
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors will be recorded
  
  // Filter out RRIO-specific non-error events
  beforeSend(event, hint) {
    // Don't send debug-level events in production
    if (event.level === "debug" && process.env.NODE_ENV === "production") {
      return null;
    }
    
    // Add RRIO context to all events
    event.tags = {
      ...event.tags,
      service: "rrio-frontend",
      component: "dashboard"
    };
    
    // Add request ID if available from headers
    if (typeof window !== "undefined" && (window as any).lastRequestId) {
      event.tags.request_id = (window as any).lastRequestId;
    }
    
    return event;
  },
  
  // integrations: [] // Replay integration is now configured via options above
});
