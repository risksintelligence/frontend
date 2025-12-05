"use client";

import { useState, useEffect, useCallback } from "react";
import { WifiOff, Clock } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { rrio, RRIOErrorType } from "@/lib/monitoring";
import { buildApiUrl } from "@/lib/api-config";

interface OfflineDetectorProps {
  children: React.ReactNode;
  showBanner?: boolean;
}


const testAPIConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(buildApiUrl('/health'), {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    // Log connectivity check result to monitoring
    rrio.trackAPICall('/health', 'GET', response.status, 0, {
      component: 'OfflineDetector',
      action: 'connectivity_check',
      result: response.ok ? 'success' : 'failure'
    });
    
    return response.ok;
  } catch (error) {
    // Log connectivity failure to monitoring
    rrio.logError(new Error(`API connectivity check failed: ${(error as Error).message}`), RRIOErrorType.NETWORK_ERROR, {
      component: 'OfflineDetector',
      action: 'connectivity_check_failed',
      endpoint: buildApiUrl('/health')
    });
    
    return false;
  }
};

export default function OfflineDetector({ children, showBanner = true }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true); // Start optimistic
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [hasInitialCheck, setHasInitialCheck] = useState<boolean>(false);

  const checkConnectivity = useCallback(async () => {
    setIsChecking(true);
    
    // Only check browser status if we've already done initial check
    if (hasInitialCheck) {
      const browserOnline = navigator?.onLine ?? true;
      if (!browserOnline) {
        if (isOnline) {
          setIsOnline(false);
          setOfflineSince(new Date());
        }
        setIsChecking(false);
        return;
      }
    }

    // Test actual API connectivity
    const apiConnected = await testAPIConnectivity();
    
    if (apiConnected && !isOnline) {
      setIsOnline(true);
      setOfflineSince(null);
    } else if (!apiConnected && isOnline && hasInitialCheck) {
      // Only mark offline after initial check to avoid false positives during page load
      setIsOnline(false);
      setOfflineSince(new Date());
    }
    
    setHasInitialCheck(true);
    setIsChecking(false);
  }, [hasInitialCheck, isOnline]);

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);
    };

    const handleOffline = () => {
      const offlineTime = new Date();
      setIsOnline(false);
      setOfflineSince(offlineTime);
      
      // Log offline event to monitoring
      rrio.trackUserAction('connection_lost', 'OfflineDetector', {
        timestamp: offlineTime.toISOString(),
        navigator_online: navigator?.onLine
      });
    };

    // Delay initial connectivity check to allow app to fully load
    const initialCheckTimeout = setTimeout(() => {
      checkConnectivity();
    }, 2000);

    // Set up periodic connectivity checks (every 60 seconds, less aggressive)
    const connectivityCheckInterval = setInterval(checkConnectivity, 60000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(connectivityCheckInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectivity]);

  if (!isOnline && showBanner) {
    return (
      <div className="min-h-screen bg-terminal-bg">
        {/* Offline Banner */}
        <div className="bg-terminal-red text-white p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <div>
                <p className="font-mono text-sm font-semibold">
                  No Internet Connection
                </p>
                <p className="font-mono text-xs opacity-90">
                  You’re viewing cached data. Some features may be unavailable.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {offlineSince && (
                <div className="flex items-center gap-1 text-xs font-mono opacity-90">
                  <Clock className="w-3 h-3" />
                  Offline since {offlineSince.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded font-mono text-xs transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>

        {/* Offline Dashboard */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="terminal-card text-center py-12">
            <WifiOff className="w-16 h-16 text-terminal-red mx-auto mb-4" />
            
            <h1 className="text-2xl font-bold text-terminal-text font-mono mb-2">
              RRIO OFFLINE MODE
            </h1>
            
            <p className="text-terminal-muted font-mono mb-6">
              Internet connection lost. Real-time data updates are unavailable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-terminal-surface rounded border border-terminal-border p-4">
                <p className="text-sm font-mono text-terminal-text font-semibold mb-2">
                  Cached Data
                </p>
                <p className="text-xs font-mono text-terminal-muted">
                  Last synced data is still accessible
                </p>
              </div>
              
              <div className="bg-terminal-surface rounded border border-terminal-border p-4">
                <p className="text-sm font-mono text-terminal-text font-semibold mb-2">
                  Limited Features
                </p>
                <p className="text-xs font-mono text-terminal-muted">
                  Real-time updates temporarily disabled
                </p>
              </div>
              
              <div className="bg-terminal-surface rounded border border-terminal-border p-4">
                <p className="text-sm font-mono text-terminal-text font-semibold mb-2">
                  Auto-Reconnect
                </p>
                <p className="text-xs font-mono text-terminal-muted">
                  Will resume when connection returns
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={checkConnectivity}
                disabled={isChecking}
                className="bg-terminal-green hover:bg-terminal-green/80 text-white px-6 py-2 rounded font-mono text-sm transition-colors mr-4 disabled:opacity-50"
              >
                {isChecking ? 'Checking...' : 'Try Again'}
              </button>
              <button
                onClick={() => setIsOnline(true)}
                className="bg-terminal-surface hover:bg-terminal-border text-terminal-text px-6 py-2 rounded font-mono text-sm border border-terminal-border transition-colors"
              >
                Continue Offline
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-terminal-border">
              <p className="text-xs text-terminal-muted font-mono">
                Connection lost at {offlineSince?.toLocaleString()} · RRIO Resilience Intelligence Observatory
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add online status indicator to children when back online
  return (
    <div className="relative">
      {!isOnline && (
        <div className="fixed top-4 right-4 z-50">
          <StatusBadge variant="critical">
            <WifiOff className="w-3 h-3 mr-1" />
            OFFLINE
          </StatusBadge>
        </div>
      )}
      {children}
    </div>
  );
}
