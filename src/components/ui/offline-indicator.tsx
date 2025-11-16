'use client';

import { useEffect, useState } from 'react';
import { semanticColors } from '../../lib/theme';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    // Check initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineBanner) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 p-3 text-white text-center text-sm font-medium"
      style={{ backgroundColor: semanticColors.criticalRisk }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="animate-pulse">●</span>
        <span>
          Offline Mode - GRII data may be stale. Reconnecting automatically...
        </span>
        <button
          onClick={() => setShowOfflineBanner(false)}
          className="ml-2 text-white hover:text-gray-200"
          aria-label="Dismiss offline notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnline, setLastOnline] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
    };

    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span 
        className="w-2 h-2 rounded-full"
        style={{ 
          backgroundColor: isOnline ? semanticColors.minimalRisk : semanticColors.criticalRisk 
        }}
      />
      <span className="text-[#64748b]">
        {isOnline ? 'Live' : `Offline since ${lastOnline.toLocaleTimeString()}`}
      </span>
    </div>
  );
}