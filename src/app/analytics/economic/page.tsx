'use client';

import { DollarSign } from 'lucide-react';
import EconomicIntelDashboard from '@/components/analytics/EconomicIntelDashboard';
import EconomicIndicators from '@/components/analytics/EconomicIndicators';

export default function EconomicIntelligence() {
  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-emerald-700" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              ECONOMIC INTELLIGENCE
            </h1>
            <p className="text-slate-700 font-mono text-sm">
              Real-time economic indicators and market intelligence
            </p>
          </div>
        </div>
        
        <div className="text-slate-500 font-mono text-sm">
          Data Sources: <span className="text-emerald-700">FRED, BEA, BLS, Census</span>
        </div>
      </div>

      {/* Economic Intelligence Dashboard */}
      <div>
        <EconomicIntelDashboard />
      </div>

      {/* Detailed Economic Indicators */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-mono font-semibold text-slate-900 mb-2">
            DETAILED INDICATORS MONITOR
          </h2>
          <p className="text-slate-500 font-mono text-sm">
            Comprehensive economic indicators with targets and trend analysis
          </p>
        </div>
        
        <EconomicIndicators layout="grid" />
      </div>
    </div>
  );
}