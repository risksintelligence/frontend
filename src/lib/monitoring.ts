"use client";

import * as Sentry from "@sentry/nextjs";

/**
 * RRIO Monitoring and Logging Utilities
 * Bloomberg-grade observability for financial intelligence platform
 */

// Custom error types for RRIO
export enum RRIOErrorType {
  API_ERROR = 'api_error',
  DATA_QUALITY = 'data_quality',
  PERFORMANCE = 'performance',
  USER_ACTION = 'user_action',
  CACHE_MISS = 'cache_miss',
  NETWORK_ERROR = 'network_error',
  VISUALIZATION_ERROR = 'visualization_error',
}

export interface RRIOErrorContext {
  component?: string;
  action?: string;
  dataSource?: string;
  riskScore?: number;
  userId?: string;
  sessionId?: string;
  cacheLayer?: 'L1' | 'L2' | 'L3';
  apiEndpoint?: string;
  timestamp?: string;
  operation?: string;
  retryAttempt?: number;
  errorId?: string;
  totalRetries?: number;
  inputDataType?: string;
  partner_id?: string;
  endpoint?: string;
  calculated_engagement?: number;
  deliverable_count?: number;
  result?: string;
  duration?: number;
  maxRetries?: number;
  inputData?: string;
}

// Custom monitoring class for RRIO-specific events
export class RRIOMonitoring {
  private static instance: RRIOMonitoring;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUserContext();
  }

  static getInstance(): RRIOMonitoring {
    if (!RRIOMonitoring.instance) {
      RRIOMonitoring.instance = new RRIOMonitoring();
    }
    return RRIOMonitoring.instance;
  }

  private generateSessionId(): string {
    // Generate deterministic session ID based on timestamp and browser fingerprint
    const timestamp = Date.now();
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'server';
    const hash = userAgent.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return `rrio_${timestamp}_${hash.toString(36)}`;
  }

  private initializeUserContext() {
    Sentry.setContext("rrio_session", {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      platform: "web",
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  }

  // Log RRIO-specific errors with rich context
  logError(
    error: Error | string,
    type: RRIOErrorType,
    context?: RRIOErrorContext
  ): string {
    const errorId = `rrio_error_${Date.now()}`;
    
    Sentry.withScope((scope) => {
      scope.setTag("rrio.error_type", type);
      scope.setTag("rrio.component", context?.component || 'unknown');
      scope.setLevel('error');
      
      // Add RRIO-specific context
      scope.setContext("rrio_error", {
        errorId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...context,
      });
      
      // Financial data context
      if (context?.riskScore !== undefined) {
        scope.setTag("rrio.risk_level", this.getRiskLevel(context.riskScore));
        scope.setContext("risk_data", {
          score: context.riskScore,
          level: this.getRiskLevel(context.riskScore),
          timestamp: context.timestamp,
        });
      }
      
      // API context
      if (context?.apiEndpoint) {
        scope.setTag("rrio.api_endpoint", context.apiEndpoint);
        scope.setTag("rrio.cache_layer", context.cacheLayer || 'unknown');
      }
      
      const sentryError = typeof error === 'string' ? new Error(error) : error;
      Sentry.captureException(sentryError);
    });
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[RRIO Error] ${type}:`, error, context);
    }
    
    return errorId;
  }

  // Track Bloomberg-grade performance metrics
  trackPerformance(
    operation: string,
    duration: number,
    context?: RRIOErrorContext
  ) {
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${operation} completed in ${duration}ms`,
      level: 'info',
      data: {
        operation,
        duration,
        sessionId: this.sessionId,
        ...context,
      },
    });

    // Log slow operations
    if (duration > 2000) {
      this.logError(
        `Slow operation: ${operation} took ${duration}ms`,
        RRIOErrorType.PERFORMANCE,
        { ...context, operation }
      );
    }
  }

  // Track user interactions for UX insights
  trackUserAction(
    action: string,
    component: string,
    additionalData?: Record<string, unknown>,
  ) {
    Sentry.addBreadcrumb({
      category: 'ui.interaction',
      message: `User ${action} in ${component}`,
      level: 'info',
      data: {
        action,
        component,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...additionalData,
      },
    });
  }

  // Track data quality issues
  trackDataQuality(
    issue: string,
    dataSource: string,
    severity: 'low' | 'medium' | 'high' = 'medium',
    context?: RRIOErrorContext
  ) {
    const level = severity === 'high' ? 'error' : severity === 'medium' ? 'warning' : 'info';
    
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      scope.setTag("rrio.data_quality", severity);
      scope.setTag("rrio.data_source", dataSource);
      
      scope.setContext("data_quality", {
        issue,
        dataSource,
        severity,
        sessionId: this.sessionId,
        ...context,
      });
      
      Sentry.captureMessage(`Data Quality Issue: ${issue}`, level);
    });
  }

  // Track cache performance for RRIO's 3-tier system
  trackCacheEvent(
    event: 'hit' | 'miss' | 'stale' | 'refresh',
    layer: 'L1' | 'L2' | 'L3',
    key: string,
    context?: RRIOErrorContext
  ) {
    Sentry.addBreadcrumb({
      category: 'cache',
      message: `Cache ${event} on ${layer} for ${key}`,
      level: event === 'miss' ? 'warning' : 'info',
      data: {
        event,
        layer,
        key,
        sessionId: this.sessionId,
        ...context,
      },
    });

    // Track cache misses as potential issues
    if (event === 'miss' && layer === 'L1') {
      this.trackDataQuality(
        `L1 cache miss for ${key}`,
        'redis',
        'low',
        { ...context, cacheLayer: layer }
      );
    }
  }

  // Track API response times and errors
  trackAPICall(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    statusCode: number,
    duration: number,
    context?: RRIOErrorContext
  ) {
    const isError = statusCode >= 400;
    
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${method} ${endpoint} -> ${statusCode} (${duration}ms)`,
      level: isError ? 'error' : 'info',
      data: {
        url: endpoint,
        method,
        status_code: statusCode,
        duration,
        sessionId: this.sessionId,
        ...context,
      },
    });

    if (isError) {
      this.logError(
        `API Error: ${method} ${endpoint} returned ${statusCode}`,
        RRIOErrorType.API_ERROR,
        { ...context, apiEndpoint: endpoint }
      );
    }

    // Track slow API calls
    if (duration > 5000) {
      this.trackPerformance(`API ${method} ${endpoint}`, duration, context);
    }
  }

  // Track data fetch operations for RRIO components
  trackDataFetch(
    component: string,
    status: 'success' | 'error',
    context?: RRIOErrorContext
  ) {
    Sentry.addBreadcrumb({
      category: 'data_fetch',
      message: `Data fetch ${status} for ${component}`,
      level: status === 'error' ? 'error' : 'info',
      data: {
        component,
        status,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...context,
      },
    });

    if (status === 'error') {
      this.logError(
        `Data fetch failed for ${component}`,
        RRIOErrorType.API_ERROR,
        { ...context, component }
      );
    }
  }

  private getRiskLevel(score: number): string {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'low';
    return 'minimal';
  }
}

// Export singleton instance
export const rrio = RRIOMonitoring.getInstance();

// Helper function for timing operations
export function timeOperation<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: RRIOErrorContext
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result
        .then(value => {
          const duration = performance.now() - start;
          rrio.trackPerformance(operation, duration, context);
          return value;
        })
        .catch(error => {
          const duration = performance.now() - start;
          rrio.trackPerformance(operation, duration, context);
          rrio.logError(error, RRIOErrorType.PERFORMANCE, { ...context, operation });
          throw error;
        });
    } else {
      const duration = performance.now() - start;
      rrio.trackPerformance(operation, duration, context);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    rrio.trackPerformance(operation, duration, context);
    rrio.logError(error as Error, RRIOErrorType.PERFORMANCE, { ...context, operation });
    throw error;
  }
}

// Custom hook for component-level error tracking
export function useRRIOErrorHandler(component: string) {
  return {
    logError: (error: Error | string, context?: RRIOErrorContext) =>
      rrio.logError(error, RRIOErrorType.USER_ACTION, { ...context, component }),
    
    trackAction: (action: string, data?: Record<string, unknown>) =>
      rrio.trackUserAction(action, component, data),
    
    trackPerformance: (operation: string, duration: number, context?: RRIOErrorContext) =>
      rrio.trackPerformance(operation, duration, { ...context, component }),
  };
}
