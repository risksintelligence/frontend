'use client';

import RiskAlerts from '@/components/risk/RiskAlerts';

export default function RiskAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-text">
          RISK ALERTS MANAGEMENT
        </h1>
        
        <div className="text-terminal-muted font-mono text-sm">
          Real-time risk monitoring and notifications
        </div>
      </div>
      
      <RiskAlerts showFilters={true} />
    </div>
  );
}