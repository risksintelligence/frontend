/**
 * Error Boundary component for RiskX application
 * Professional error handling with logging and recovery options
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'widget';
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generate unique event ID for tracking
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
      eventId
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    this.logErrorToService(error, errorInfo, eventId);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo, eventId: string) => {
    // In production, replace this with actual error reporting service
    const errorReport = {
      eventId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      level: this.props.level || 'component'
    };

    // Example: Send to error monitoring service
    // errorReportingService.captureException(errorReport);
    
    console.warn('Error report:', errorReport);
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private renderErrorDetails = () => {
    const { error, errorInfo, eventId } = this.state;
    const { showDetails = process.env.NODE_ENV === 'development' } = this.props;

    if (!showDetails || !error) return null;

    return (
      <details className="mt-6 text-left">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
          Technical Details
        </summary>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs font-mono">
          <div className="mb-2">
            <strong>Event ID:</strong> {eventId}
          </div>
          <div className="mb-2">
            <strong>Error:</strong> {error.message}
          </div>
          {error.stack && (
            <div className="mb-2">
              <strong>Stack Trace:</strong>
              <pre className="whitespace-pre-wrap mt-1 text-red-600">
                {error.stack}
              </pre>
            </div>
          )}
          {errorInfo?.componentStack && (
            <div>
              <strong>Component Stack:</strong>
              <pre className="whitespace-pre-wrap mt-1 text-blue-600">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  private renderPageError = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-charcoal-gray mb-2">
              System Error
            </h1>
            
            <p className="text-gray-600 mb-6">
              The Risk Intelligence Observatory encountered an unexpected error. 
              Our team has been notified and is working to resolve the issue.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-navy-blue text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full border border-gray-300 text-charcoal-gray py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reload Page
              </button>
            </div>

            {this.renderErrorDetails()}
          </div>
        </div>
      </div>
    );
  };

  private renderComponentError = () => {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Component Error
        </h3>
        
        <p className="text-red-600 mb-4 text-sm">
          This component failed to load properly. Please try refreshing or contact support if the issue persists.
        </p>

        <button
          onClick={this.handleRetry}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Retry Component
        </button>

        {this.renderErrorDetails()}
      </div>
    );
  };

  private renderWidgetError = () => {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-yellow-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm font-medium">Widget Unavailable</span>
        </div>
        
        <p className="text-yellow-700 text-xs mt-1">
          Data temporarily unavailable
        </p>
        
        <button
          onClick={this.handleRetry}
          className="mt-2 text-xs text-yellow-800 hover:text-yellow-900 underline"
        >
          Retry
        </button>
      </div>
    );
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback based on error level
      const { level = 'component' } = this.props;
      
      switch (level) {
        case 'page':
          return this.renderPageError();
        case 'widget':
          return this.renderWidgetError();
        case 'component':
        default:
          return this.renderComponentError();
      }
    }

    return this.props.children;
  }
}

// Wrapper components for different error levels
export const PageErrorBoundary: React.FC<{ children: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }> = ({ 
  children, 
  onError 
}) => (
  <ErrorBoundary level="page" onError={onError}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ErrorBoundary level="component" fallback={fallback}>
    {children}
  </ErrorBoundary>
);

export const WidgetErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="widget">
    {children}
  </ErrorBoundary>
);

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by error handler:', error, errorInfo);
    
    // In production, send to error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalInfo: errorInfo
    };
    
    console.warn('Error report:', errorReport);
  };
};

export default ErrorBoundary;