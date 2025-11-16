'use client';

import { useEffect, useState } from 'react';
import { semanticColors } from '../../lib/theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: Date;
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date()
      };
      setError(errorInfo);
      onError?.(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date()
      };
      setError(errorInfo);
      onError?.(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  if (error) {
    return fallback || <DefaultErrorFallback error={error} onRetry={() => setError(null)} />;
  }

  return <>{children}</>;
}

function DefaultErrorFallback({ error, onRetry }: { error: ErrorInfo; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: semanticColors.criticalRisk }}
        >
          !
        </span>
        <h3 className="text-sm font-semibold text-[#0f172a]">Component Error</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-[#475569]">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs rounded border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors"
          >
            Retry
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 text-xs rounded text-[#64748b] hover:text-[#374151] transition-colors"
          >
            Refresh Page
          </button>
        </div>
        
        <p className="text-xs text-[#94a3b8]">
          Error logged: {error.timestamp.toLocaleTimeString()} | 
          Support: Contact RRIO team via transparency portal
        </p>
      </div>
    </div>
  );
}

export function APIErrorFallback({ 
  error, 
  onRetry, 
  componentName 
}: { 
  error: Error; 
  onRetry: () => void;
  componentName: string;
}) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isTimeoutError = error.message.includes('timeout');
  
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: semanticColors.highRisk }}
        >
          ⚠
        </span>
        <h3 className="text-sm font-semibold text-[#0f172a]">
          {componentName} Unavailable
        </h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-[#475569]">
          {isNetworkError && 'Network connection issue. Check your internet connection.'}
          {isTimeoutError && 'Request timed out. The GRII API may be experiencing high load.'}
          {!isNetworkError && !isTimeoutError && 'API service temporarily unavailable.'}
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs rounded bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors"
          >
            Retry Request
          </button>
          
          <span className="text-xs text-[#64748b]">
            Auto-retry in 30s
          </span>
        </div>
        
        <p className="text-xs text-[#94a3b8]">
          Status: GRII API monitoring dashboard | 
          Live updates when service resumes
        </p>
      </div>
    </div>
  );
}