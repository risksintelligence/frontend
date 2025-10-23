'use client';

import { DollarSign } from 'lucide-react';
import EconomicIntelDashboard from '@/components/analytics/EconomicIntelDashboard';
import EconomicIndicators from '@/components/analytics/EconomicIndicators';

export default function EconomicIntelligence() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-terminal-green" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-terminal-text">
              ECONOMIC INTELLIGENCE
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Real-time economic indicators and market intelligence
            </p>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Data Sources: <span className="text-terminal-green">FRED, BEA, BLS, Census</span>
        </div>
      </div>

      {/* Economic Intelligence Dashboard */}
      <div>
        <EconomicIntelDashboard />
      </div>

      {/* Detailed Economic Indicators */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="mb-6">
          <h2 className="text-xl font-mono font-semibold text-terminal-text mb-2">
            DETAILED INDICATORS MONITOR
          </h2>
          <p className="text-terminal-muted font-mono text-sm">
            Comprehensive economic indicators with targets and trend analysis
          </p>
        </div>
        
        <EconomicIndicators layout="grid" />
      </div>
    </div>
  );
}