import React from 'react';
import { Activity, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface LiveStatusIndicatorProps {
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate?: string;
  label?: string;
}

export default function LiveStatusIndicator({ 
  connectionState, 
  lastUpdate,
  label = 'Live Data'
}: LiveStatusIndicatorProps) {
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Activity className="w-3 h-3 text-green-600" />;
      case 'connecting':
        return <Wifi className="w-3 h-3 text-yellow-600 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 text-gray-600" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-600" />;
      default:
        return <WifiOff className="w-3 h-3 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Offline';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const formatLastUpdate = (timestamp?: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 60) {
        return `${diffSecs}s ago`;
      } else if (diffSecs < 3600) {
        return `${Math.floor(diffSecs / 60)}m ago`;
      } else {
        return date.toLocaleTimeString();
      }
    } catch {
      return '';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{label}</span>
      <span className="font-semibold">{getStatusText()}</span>
      {lastUpdate && connectionState === 'connected' && (
        <span className="text-xs opacity-75">
          {formatLastUpdate(lastUpdate)}
        </span>
      )}
    </div>
  );
}