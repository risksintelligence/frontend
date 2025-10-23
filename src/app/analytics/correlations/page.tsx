'use client';

import { Network } from 'lucide-react';
import CorrelationMatrix from '@/components/analytics/CorrelationMatrix';

export default function CorrelationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="w-8 h-8 text-terminal-cyan" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-terminal-text">
              CORRELATION ANALYSIS
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Factor correlation analysis and relationship mapping
            </p>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Methods: <span className="text-terminal-green">Pearson, Spearman, Kendall</span>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div>
        <CorrelationMatrix timeRange="3m" />
      </div>

      {/* Correlation Analysis Information */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          CORRELATION ANALYSIS METHODOLOGY
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              CORRELATION TYPES
            </h4>
            <div className="space-y-3">
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  PEARSON CORRELATION
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Measures linear relationships between continuous variables
                </div>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  SPEARMAN RANK
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Measures monotonic relationships using rank ordering
                </div>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  KENDALL TAU
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Robust correlation measure for small sample sizes
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              STRENGTH INTERPRETATION
            </h4>
            <div className="space-y-3">
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  CORRELATION RANGES
                </div>
                <ul className="text-terminal-muted font-mono text-xs space-y-1">
                  <li>• |r| ≥ 0.7: Strong correlation</li>
                  <li>• 0.5 ≤ |r| &lt; 0.7: Moderate</li>
                  <li>• 0.3 ≤ |r| &lt; 0.5: Weak</li>
                  <li>• |r| &lt; 0.3: Very weak</li>
                </ul>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  STATISTICAL SIGNIFICANCE
                </div>
                <ul className="text-terminal-muted font-mono text-xs space-y-1">
                  <li>• p &lt; 0.01: Highly significant</li>
                  <li>• p &lt; 0.05: Significant</li>
                  <li>• p &lt; 0.10: Marginally significant</li>
                  <li>• p ≥ 0.10: Not significant</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Factor Relationships */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          KEY ECONOMIC RELATIONSHIPS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              NEGATIVE CORRELATIONS
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• GDP Growth ↔ Unemployment</li>
              <li>• Bond Prices ↔ Interest Rates</li>
              <li>• Dollar Strength ↔ Exports</li>
              <li>• Employment ↔ Inflation (short-term)</li>
            </ul>
          </div>
          
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              POSITIVE CORRELATIONS
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• GDP Growth ↔ Employment</li>
              <li>• Inflation ↔ Interest Rates</li>
              <li>• Market Volatility ↔ Risk</li>
              <li>• Consumer Spending ↔ GDP</li>
            </ul>
          </div>
          
          <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
              COMPLEX RELATIONSHIPS
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• Non-linear relationships</li>
              <li>• Time-varying correlations</li>
              <li>• Regime-dependent patterns</li>
              <li>• Lagged correlations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          ANALYSIS GUIDELINES
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              INTERPRETATION TIPS
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• Correlation does not imply causation</li>
              <li>• Consider time lags between variables</li>
              <li>• Check for spurious correlations</li>
              <li>• Analyze correlation stability over time</li>
              <li>• Consider external factors and confounders</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              PRACTICAL APPLICATIONS
            </h4>
            <ul className="space-y-2 text-terminal-muted font-mono text-xs">
              <li>• Risk factor identification</li>
              <li>• Portfolio diversification</li>
              <li>• Economic forecasting</li>
              <li>• Policy impact assessment</li>
              <li>• Market timing strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}