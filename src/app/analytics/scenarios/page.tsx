'use client';

import { Target } from 'lucide-react';
import ScenarioAnalysis from '@/components/analytics/ScenarioAnalysis';

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-terminal-purple" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-terminal-text">
              SCENARIO ANALYSIS
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Interactive what-if modeling and scenario impact analysis
            </p>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Active Scenarios: <span className="text-terminal-green">3</span> | 
          Templates: <span className="text-terminal-green">8</span>
        </div>
      </div>

      {/* Scenario Analysis Tool */}
      <div>
        <ScenarioAnalysis />
      </div>

      {/* Scenario Information */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          SCENARIO MODELING CAPABILITIES
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              ECONOMIC SCENARIOS
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• GDP Growth Rate Changes</li>
              <li>• Interest Rate Adjustments</li>
              <li>• Inflation Rate Variations</li>
              <li>• Employment Rate Shifts</li>
            </ul>
          </div>
          
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              MARKET SCENARIOS
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• Market Volatility Spikes</li>
              <li>• Currency Exchange Shifts</li>
              <li>• Commodity Price Changes</li>
              <li>• Credit Spread Variations</li>
            </ul>
          </div>
          
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              POLICY SCENARIOS
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• Fiscal Policy Changes</li>
              <li>• Monetary Policy Shifts</li>
              <li>• Trade Policy Adjustments</li>
              <li>• Regulatory Updates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          SCENARIO ANALYSIS GUIDE
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              HOW TO USE
            </h4>
            <ol className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>1. Select a scenario template or create custom</li>
              <li>2. Adjust parameter values using sliders</li>
              <li>3. Review impact calculations in real-time</li>
              <li>4. Compare scenarios using side-by-side view</li>
              <li>5. Export results for further analysis</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              INTERPRETATION
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• Green values indicate positive impact</li>
              <li>• Red values indicate negative impact</li>
              <li>• Confidence intervals show uncertainty</li>
              <li>• Time horizon affects prediction accuracy</li>
              <li>• Multiple scenarios provide robust analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}