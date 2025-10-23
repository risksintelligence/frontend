'use client';

import RiskMethodology from '@/components/risk/RiskMethodology';

export default function RiskMethodologyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-text">
          RISK ASSESSMENT METHODOLOGY
        </h1>
        
        <div className="text-terminal-muted font-mono text-sm">
          Comprehensive risk calculation framework
        </div>
      </div>
      
      <RiskMethodology />
    </div>
  );
}