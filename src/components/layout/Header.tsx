'use client';

import { useState, useEffect } from 'react';
import { systemApi } from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Header() {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await systemApi.getHealth();
        if (response.status === 'success') {
          setSystemHealth(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch system health:', error);
      }
    };

    fetchHealth();
    const healthInterval = setInterval(fetchHealth, 30000); // Every 30 seconds

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getSystemStatus = () => {
    if (!systemHealth) return 'offline';
    
    const { components } = systemHealth;
    if (components?.api === 'operational') {
      return 'online';
    }
    return 'warning';
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-700 to-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-heading">
                  RiskX Intelligence
                </h1>
                <p className="text-xs text-muted font-mono">
                  Risk Intelligence Observatory
                </p>
              </div>
            </div>
          </div>

          {/* Center - System Status */}
          <div className="flex items-center space-x-4">
            <StatusBadge 
              status={getSystemStatus()} 
              text="System" 
              size="sm"
            />
            {systemHealth?.components && (
              <div className="flex items-center space-x-2 text-xs text-muted">
                <span>API:</span>
                <StatusBadge 
                  status={systemHealth.components.api === 'operational' ? 'online' : 'offline'}
                  text={systemHealth.components.api}
                  size="sm"
                />
              </div>
            )}
          </div>

          {/* Right - Time and Environment */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-mono text-heading">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-xs text-muted">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
            <div className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <span className="text-muted">ENV:</span>
              <span className="text-heading ml-1 font-mono">PROD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}