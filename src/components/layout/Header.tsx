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
    <header className="bg-terminal-surface border-b border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-terminal-blue to-terminal-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-terminal-text">
                  RiskX Intelligence
                </h1>
                <p className="text-xs text-terminal-muted font-mono">
                  Bloomberg Terminal Style
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
              <div className="flex items-center space-x-2 text-xs text-terminal-muted">
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
              <div className="text-sm font-mono text-terminal-text">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-xs text-terminal-muted">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
            <div className="text-xs bg-terminal-bg px-2 py-1 rounded border border-terminal-border">
              <span className="text-terminal-muted">ENV:</span>
              <span className="text-terminal-text ml-1 font-mono">PROD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}