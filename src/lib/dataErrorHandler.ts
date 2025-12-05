import { rrio, RRIOErrorType, RRIOErrorContext } from './monitoring';
import { getValidatorForEndpoint } from './dataValidators';
import * as Sentry from '@sentry/nextjs';

/**
 * Enhanced Data Error Handler
 * Bloomberg-grade error handling and retry logic for financial data
 */

export interface DataFetchConfig {
  endpoint: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  component?: string;
}

export interface DataErrorDetails {
  endpoint: string;
  error: Error;
  statusCode?: number;
  retryAttempt: number;
  timestamp: string;
  component?: string;
}

export class DataError extends Error {
  public readonly endpoint: string;
  public readonly statusCode?: number;
  public readonly retryAttempt: number;
  public readonly originalError: Error;

  constructor(details: DataErrorDetails) {
    super(`Data fetch failed for ${details.endpoint}: ${details.error.message}`);
    this.name = 'DataError';
    this.endpoint = details.endpoint;
    this.statusCode = details.statusCode;
    this.retryAttempt = details.retryAttempt;
    this.originalError = details.error;
  }
}

export class DataErrorHandler {
  private static instance: DataErrorHandler;

  static getInstance(): DataErrorHandler {
    if (!DataErrorHandler.instance) {
      DataErrorHandler.instance = new DataErrorHandler();
    }
    return DataErrorHandler.instance;
  }

  /**
   * Enhanced fetch with automatic retry and comprehensive error logging
   */
  async fetchWithRetry<T>(
    fetchFn: () => Promise<Response>,
    config: DataFetchConfig
  ): Promise<T> {
    const {
      endpoint,
      maxRetries = 3,
      retryDelay = 1000,
      timeout = 10000,
      component = 'DataService'
    } = config;

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const startTime = performance.now();
      
      try {
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetchFn();
        clearTimeout(timeoutId);
        
        // Capture and propagate trace headers for observability
        const requestId = response.headers.get('X-Request-ID');
        const traceId = response.headers.get('X-Trace-ID');
        const spanId = response.headers.get('X-Span-ID');
        
        if (requestId) {
          (window as any).lastRequestId = requestId;
        }
        
        // Add trace context to Sentry
        if (traceId && spanId) {
          Sentry.withScope((scope) => {
            scope.setTag('trace_id', traceId);
            scope.setTag('span_id', spanId);
            scope.setTag('request_id', requestId || 'unknown');
            scope.setContext('rrio_request', {
              endpoint,
              attempt: attempt + 1,
              response_time_ms: performance.now() - startTime
            });
          });
        }
        
        const duration = performance.now() - startTime;
        
        // Log successful API call
        rrio.trackAPICall(endpoint, 'GET', response.status, duration, {
          component,
          action: 'data_fetch_success',
          timestamp: new Date().toISOString()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Track successful data parsing
        rrio.trackPerformance(`Parse ${endpoint}`, performance.now() - startTime, {
          component,
          action: 'data_parse_success'
        });
        
        // Log retry success if this wasn't the first attempt
        if (attempt > 0) {
          rrio.trackUserAction('retry_success', component, {
            endpoint,
            attemptNumber: attempt + 1,
            totalDuration: duration
          });
        }
        
        return data as T;
        
      } catch (error) {
        const duration = performance.now() - startTime;
        lastError = error as Error;
        
        // Determine error type
        const errorType = this.categorizeError(lastError);
        const statusCode = this.extractStatusCode(lastError);
        
        // Send error to Sentry with RRIO context
        Sentry.withScope((scope) => {
          scope.setTag('component', component);
          scope.setTag('endpoint', endpoint);
          scope.setTag('attempt', attempt + 1);
          scope.setTag('error_type', errorType);
          scope.setLevel('error');
          
          scope.setContext('rrio_error', {
            endpoint,
            attempt: attempt + 1,
            maxRetries,
            statusCode,
            duration_ms: duration,
            will_retry: attempt < maxRetries,
            error_category: errorType
          });
          
          // Only capture as exception if this is the final attempt
          if (attempt >= maxRetries) {
            Sentry.captureException(lastError);
          } else {
            Sentry.addBreadcrumb({
              message: `API retry ${attempt + 1}/${maxRetries + 1}`,
              category: 'http',
              level: 'warning',
              data: { endpoint, error: lastError?.message || 'Unknown error' }
            });
          }
        });
        
        // Log the error with rich context
        // const errorId = rrio.logError(lastError, errorType, {
        //   component,
        //   action: 'data_fetch_error',
        //   apiEndpoint: endpoint,
        //   timestamp: new Date().toISOString(),
        //   retryAttempt: attempt,
        //   maxRetries,
        //   duration
        // });
        
        // Track API call failure
        rrio.trackAPICall(endpoint, 'GET', statusCode || 0, duration, {
          component,
          action: 'data_fetch_failure',
          errorId
        });
        
        // If this is the last attempt or a non-retryable error, throw
        if (attempt >= maxRetries || !this.isRetryableError(lastError)) {
          const dataError = new DataError({
            endpoint,
            error: lastError,
            statusCode,
            retryAttempt: attempt,
            timestamp: new Date().toISOString(),
            component
          });
          
          // Log final failure
          rrio.logError(dataError, RRIOErrorType.API_ERROR, {
            component,
            action: 'data_fetch_final_failure',
            apiEndpoint: endpoint,
            totalRetries: attempt
          });
          
          throw dataError;
        }
        
        // Log retry attempt
        rrio.trackUserAction('retry_attempt', component, {
          endpoint,
          attemptNumber: attempt + 1,
          maxRetries,
          error: lastError.message
        });
        
        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Unknown error in fetchWithRetry');
  }

  /**
   * Validate data shape against expected schema
   */
  validateDataShape<T>(
    data: unknown,
    endpoint: string,
    component: string = 'DataValidator'
  ): T {
    const startTime = performance.now();
    
    try {
      const validator = getValidatorForEndpoint(endpoint);
      const validationResult = validator(data, endpoint);
      
      const duration = performance.now() - startTime;
      
      if (!validationResult.isValid) {
        const errorMessage = `Data validation failed for ${endpoint}: ${validationResult.errors.join(', ')}`;
        
        // Log validation failure
        // const errorId = rrio.logError(new Error(errorMessage), RRIOErrorType.DATA_QUALITY, {
        //   component,
        //   action: 'data_validation_failed',
        //   apiEndpoint: endpoint,
        //   timestamp: new Date().toISOString(),
        //   duration
        // });
        
        // Track data quality issue
        rrio.trackDataQuality(
          errorMessage,
          endpoint,
          'high',
          {
            component,
            errorId
          }
        );
        
        throw new Error(errorMessage);
      }
      
      // Track successful validation
      rrio.trackPerformance(`Validate ${endpoint}`, duration, {
        component,
        action: 'data_validation_success',
        timestamp: new Date().toISOString()
      });
      
      return validationResult.data as T;
      
    } catch (error) {
      // Log validation error
      // const errorId = rrio.logError(error as Error, RRIOErrorType.DATA_QUALITY, {
      //   component,
      //   action: 'data_validation_error',
      //   apiEndpoint: endpoint,
      //   timestamp: new Date().toISOString(),
      //   duration
      // });
      
      throw error;
    }
  }

  /**
   * Validate, then transform data with comprehensive error tracking
   */
  validateAndTransform<TInput, TOutput>(
    data: TInput,
    transformFn: (data: TInput) => TOutput,
    endpoint: string,
    component: string = 'DataTransformer',
    skipShapeValidation: boolean = false
  ): TOutput {
    const startTime = performance.now();
    
    try {
      // Validate input data exists
      if (!data) {
        throw new Error('No data received from API');
      }
      
      // Optional shape validation before transformation
      let validatedData: TInput = data;
      if (!skipShapeValidation) {
        try {
          validatedData = this.validateDataShape<TInput>(data as unknown, endpoint, component) as TInput;
        } catch (validationError) {
          // Log validation failure but continue with transformation
          rrio.trackDataQuality(
            `Shape validation failed but continuing with transformation: ${(validationError as Error).message}`,
            endpoint,
            'medium',
            { component, action: 'validation_failed_continue' }
          );
        }
      }
      
      // Attempt transformation
      const result = transformFn(validatedData);
      
      // Validate transformation result
      if (!result) {
        throw new Error('Data transformation returned null/undefined');
      }
      
      const duration = performance.now() - startTime;
      
      // Track successful transformation
      rrio.trackPerformance(`Transform ${endpoint}`, duration, {
        component,
        action: 'data_transform_success',
        timestamp: new Date().toISOString()
      });
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Log transformation error (without unused errorId)
      rrio.trackDataQuality(
        `Data transformation failed for ${endpoint}`,
        endpoint,
        'high',
        {
          component,
          inputDataType: typeof data,
          duration,
          inputData: JSON.stringify(data).slice(0, 200) // Truncate for logging
        }
      );
      
      throw error;
    }
  }

  /**
   * Monitor cache performance for backend data
   */
  trackCachePerformance(
    cacheKey: string,
    hit: boolean,
    component: string,
    context?: RRIOErrorContext
  ) {
    rrio.trackCacheEvent(
      hit ? 'hit' : 'miss',
      'L1', // Assuming L1 cache for React Query
      cacheKey,
      {
        component,
        action: hit ? 'cache_hit' : 'cache_miss',
        timestamp: new Date().toISOString(),
        ...context
      }
    );
    
    // Track cache miss as potential performance issue
    if (!hit) {
      rrio.trackDataQuality(
        `Cache miss for ${cacheKey}`,
        'frontend_cache',
        'low',
        {
          component,
          cacheLayer: 'L1',
          ...context
        }
      );
    }
  }

  /**
   * Create fallback data when API fails
   */
  createFallbackData<T>(
    endpoint: string,
    fallbackFn: () => T,
    component: string
  ): T {
    try {
      const fallback = fallbackFn();
      
      // Track fallback usage
      rrio.trackUserAction('fallback_data_used', component, {
        endpoint,
        timestamp: new Date().toISOString(),
        fallbackType: typeof fallback
      });
      
      rrio.trackDataQuality(
        `Using fallback data for ${endpoint}`,
        endpoint,
        'medium',
        {
          component,
          action: 'fallback_data_created'
        }
      );
      
      return fallback;
      
    } catch (error) {
      rrio.logError(error as Error, RRIOErrorType.DATA_QUALITY, {
        component,
        action: 'fallback_creation_error',
        apiEndpoint: endpoint
      });
      
      throw new Error(`Fallback data creation failed for ${endpoint}: ${(error as Error).message}`);
    }
  }

  private categorizeError(error: Error): RRIOErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return RRIOErrorType.NETWORK_ERROR;
    }
    
    if (message.includes('timeout') || message.includes('abort')) {
      return RRIOErrorType.PERFORMANCE;
    }
    
    if (message.includes('json') || message.includes('parse')) {
      return RRIOErrorType.DATA_QUALITY;
    }
    
    if (message.includes('http') || message.includes('status')) {
      return RRIOErrorType.API_ERROR;
    }
    
    return RRIOErrorType.API_ERROR;
  }

  private extractStatusCode(error: Error): number | undefined {
    const match = error.message.match(/HTTP (\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    const statusCode = this.extractStatusCode(error);
    
    // Don't retry client errors (4xx)
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      return false;
    }
    
    // Don't retry auth errors
    if (statusCode === 401 || statusCode === 403) {
      return false;
    }
    
    // Don't retry parsing errors
    if (message.includes('json') || message.includes('parse')) {
      return false;
    }
    
    // Retry network errors, timeouts, and 5xx errors
    return true;
  }
}

// Export singleton instance
export const dataErrorHandler = DataErrorHandler.getInstance();
