'use client';

import RiskOverviewDashboard from '@/components/risk/RiskOverviewDashboard';

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-text">
          RISK INTELLIGENCE OVERVIEW
        </h1>
        
        <div className="text-terminal-muted font-mono text-sm">
          Real-time risk assessment and monitoring
        </div>
      </div>
      
      <RiskOverviewDashboard />
    </div>
  );
}