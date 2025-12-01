"use client";

import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface InlineErrorProps {
  error?: Error | null;
  title?: string;
  message?: string;
  retryAction?: () => void;
  showDetails?: boolean;
  isNetworkError?: boolean;
  timestamp?: string;
}

export default function InlineError({
  error,
  title = "Data Unavailable",
  message,
  retryAction,
  showDetails = false,
  isNetworkError = false,
  timestamp
}: InlineErrorProps) {
  const getErrorMessage = () => {
    if (message) return message;
    if (isNetworkError) return "Network connection failed. Check your internet connection.";
    if (error?.message) return error.message;
    return "An unexpected error occurred while loading data.";
  };

  const getErrorType = () => {
    if (isNetworkError) return "Network Error";
    if (error?.name === "TypeError") return "Data Error";
    if (error?.name === "SyntaxError") return "Parsing Error";
    return "System Error";
  };

  return (
    <div className="rounded border border-terminal-red/30 bg-red-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isNetworkError ? (
            <WifiOff className="w-4 h-4 text-terminal-red" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-terminal-red" />
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
              {getErrorType()}
            </p>
            <h3 className="text-sm font-semibold text-terminal-text font-mono">
              {title}
            </h3>
          </div>
        </div>
        <StatusBadge variant="critical">
          FAILED
        </StatusBadge>
      </div>

      <div className="bg-terminal-surface rounded border border-terminal-border p-3 mb-3">
        <p className="text-sm text-terminal-text font-mono">
          {getErrorMessage()}
        </p>
        
        {showDetails && error && (
          <details className="mt-2">
            <summary className="text-xs text-terminal-muted font-mono cursor-pointer">
              Technical Details
            </summary>
            <div className="mt-2 p-2 bg-terminal-bg rounded border border-terminal-border">
              <p className="text-xs font-mono text-terminal-red break-all">
                {error.stack || error.toString()}
              </p>
            </div>
          </details>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {retryAction && (
            <button
              onClick={retryAction}
              className="flex items-center gap-1 bg-terminal-green hover:bg-terminal-green/80 text-white px-3 py-1 rounded font-mono text-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
          {isNetworkError && (
            <button
              onClick={() => window.navigator.onLine && retryAction?.()}
              disabled={!window.navigator.onLine}
              className="flex items-center gap-1 bg-terminal-surface hover:bg-terminal-border disabled:opacity-50 text-terminal-text px-3 py-1 rounded font-mono text-xs border border-terminal-border transition-colors"
            >
              <Wifi className="w-3 h-3" />
              Check Connection
            </button>
          )}
        </div>
        <p className="text-xs text-terminal-muted font-mono">
          Failed: {timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
      </div>
    </div>
  );
}