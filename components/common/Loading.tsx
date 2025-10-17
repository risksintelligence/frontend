/**
 * Loading component for RiskX application
 * Professional loading indicators with proper accessibility
 */
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  message?: string;
  className?: string;
}

interface LoadingSpinnerProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-navy-blue ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingPulse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex space-x-2 ${className}`} role="status" aria-label="Loading">
      <div className="w-2 h-2 bg-navy-blue rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-navy-blue rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-navy-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  message,
  className = ''
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return <LoadingPulse className={className} />;
      case 'skeleton':
        return <LoadingSkeleton className={className} />;
      case 'spinner':
      default:
        return <LoadingSpinner size={size} className={className} />;
    }
  };

  if (message) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        {renderLoader()}
        <p className="mt-4 text-sm text-charcoal-gray font-medium">{message}</p>
      </div>
    );
  }

  return renderLoader();
};

// Specialized loading components for common use cases

export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading risk intelligence data..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto" />
        <h2 className="mt-6 text-lg font-semibold text-charcoal-gray">
          Risk Intelligence Observatory
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export const CardLoading: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      )}
      <LoadingSkeleton lines={3} />
    </div>
  );
};

export const ChartLoading: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </div>
  );
};

export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InlineLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <span className="inline-flex items-center space-x-2 text-sm text-charcoal-gray">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </span>
  );
};

export default Loading;