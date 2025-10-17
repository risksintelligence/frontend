import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, AlertCircle, CheckCircle, RefreshCw, BarChart3, Settings, Info } from 'lucide-react';

interface HeaderProps {
  apiUrl?: string;
}

interface SystemStatus {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
}

export default function Header({ apiUrl = 'http://localhost:8000' }: HeaderProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    checkSystemStatus();
    // Check status every 2 minutes
    const interval = setInterval(checkSystemStatus, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const checkSystemStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/health`);
      
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (statusLoading) {
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    if (!systemStatus) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    return systemStatus.status === 'healthy' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <AlertCircle className="w-4 h-4 text-amber-500" />;
  };

  const getStatusText = () => {
    if (statusLoading) return 'Checking...';
    if (!systemStatus) return 'Offline';
    return systemStatus.status === 'healthy' ? 'Operational' : 'Degraded';
  };

  const getStatusColor = () => {
    if (statusLoading) return 'text-blue-600';
    if (!systemStatus) return 'text-red-600';
    return systemStatus.status === 'healthy' ? 'text-green-600' : 'text-amber-600';
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-professional">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-900">RiskX</h1>
                <p className="text-xs text-gray-500">Risk Intelligence Observatory</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/risk/network"
              className="text-gray-700 hover:text-primary-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Network Analysis
            </Link>
            <Link
              href="/simulation/policy"
              className="text-gray-700 hover:text-primary-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Policy Simulation
            </Link>
            <Link
              href="/explainability/models"
              className="text-gray-700 hover:text-primary-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Model Transparency
            </Link>
          </nav>

          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>

            {/* Environment Badge */}
            {systemStatus && systemStatus.environment !== 'production' && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded border border-amber-200">
                {systemStatus.environment.toUpperCase()}
              </span>
            )}

            {/* Refresh Button */}
            <button
              onClick={checkSystemStatus}
              disabled={statusLoading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh system status"
            >
              <RefreshCw className={`w-4 h-4 ${statusLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Settings */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Info */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* System Information Bar */}
      {systemStatus && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center space-x-6 text-gray-600">
                <span>
                  Last Health Check: {new Date(systemStatus.timestamp).toLocaleTimeString()}
                </span>
                <span>Version: {systemStatus.version}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>Real-time Monitoring Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}