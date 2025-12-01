"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { rrio, RRIOErrorType } from "@/lib/monitoring";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to RRIO monitoring system
    const errorId = rrio.logError(error, RRIOErrorType.VISUALIZATION_ERROR, {
      component: this.props.context || 'UnknownComponent',
      action: 'component_render_error',
      timestamp: new Date().toISOString(),
    });

    this.setState({ error, errorInfo, errorId });
    
    // Log error details
    console.error(`[ErrorBoundary] ${this.props.context || 'Unknown'} error:`, error);
    console.error('Error info:', errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    rrio.trackUserAction('retry_after_error', this.props.context || 'ErrorBoundary', {
      errorId: this.state.errorId,
      originalError: this.state.error?.message,
    });
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  handleReportBug = () => {
    rrio.trackUserAction('report_bug', this.props.context || 'ErrorBoundary', {
      errorId: this.state.errorId,
      error: this.state.error?.message,
    });
    
    if (this.state.errorId) {
      navigator.clipboard.writeText(`Error ID: ${this.state.errorId}\nComponent: ${this.props.context || 'Unknown'}\nError: ${this.state.error?.message}`);
      alert('Error details copied to clipboard. Please contact support with this information.');
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="terminal-card border-terminal-red/50 bg-red-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                System Error
              </p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Component Failure
              </h3>
            </div>
            <StatusBadge variant="critical">
              ERROR
            </StatusBadge>
          </div>

          <div className="bg-terminal-surface rounded border border-terminal-border p-4 mb-4">
            <p className="text-sm font-mono text-terminal-text mb-2">
              {this.props.context ? `Context: ${this.props.context}` : 'Unknown component error'}
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-terminal-red break-all mb-2">
                {this.state.error.message}
              </p>
            )}
            {this.state.errorId && (
              <p className="text-xs font-mono text-terminal-muted">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={this.handleRetry}
              className="bg-terminal-green hover:bg-terminal-green/80 text-white px-4 py-2 rounded font-mono text-sm transition-colors"
            >
              Retry Component
            </button>
            <button
              onClick={this.handleReportBug}
              className="bg-terminal-orange hover:bg-terminal-orange/80 text-white px-4 py-2 rounded font-mono text-sm transition-colors"
            >
              Report Bug
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-terminal-surface hover:bg-terminal-border text-terminal-text px-4 py-2 rounded font-mono text-sm border border-terminal-border transition-colors"
            >
              Reload Page
            </button>
          </div>

          <div className="border-t border-terminal-border pt-4 mt-4">
            <p className="text-xs text-terminal-muted font-mono">
              Error: {new Date().toLocaleTimeString()} UTC · Contact support if issue persists
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
