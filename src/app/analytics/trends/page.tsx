'use client';

import { TrendingUp } from 'lucide-react';
import TrendAnalysis from '@/components/analytics/TrendAnalysis';

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-terminal-orange" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-terminal-text">
              TREND ANALYSIS
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Statistical trend analysis and pattern recognition
            </p>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Algorithms: <span className="text-terminal-green">Linear, Polynomial, Exponential</span>
        </div>
      </div>

      {/* Trend Analysis Tool */}
      <div>
        <TrendAnalysis />
      </div>

      {/* Trend Analysis Information */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          TREND ANALYSIS METHODOLOGY
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              STATISTICAL METHODS
            </h4>
            <div className="space-y-3">
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  LINEAR REGRESSION
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Identifies linear trends and calculates R² values for goodness of fit
                </div>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  POLYNOMIAL FITTING
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Captures non-linear patterns using polynomial regression models
                </div>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  EXPONENTIAL SMOOTHING
                </div>
                <div className="text-terminal-muted font-mono text-xs">
                  Applies exponential smoothing for time series trend analysis
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              INTERPRETATION GUIDE
            </h4>
            <div className="space-y-3">
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  R² VALUES
                </div>
                <ul className="text-terminal-muted font-mono text-xs space-y-1">
                  <li>• R² &gt; 0.8: Strong trend</li>
                  <li>• R² 0.5-0.8: Moderate trend</li>
                  <li>• R² &lt; 0.5: Weak trend</li>
                </ul>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  TREND STRENGTH
                </div>
                <ul className="text-terminal-muted font-mono text-xs space-y-1">
                  <li>• Strong: Consistent direction</li>
                  <li>• Moderate: Some volatility</li>
                  <li>• Weak: High volatility</li>
                </ul>
              </div>
              
              <div className="bg-terminal-bg border border-terminal-border p-3 rounded">
                <div className="font-mono text-terminal-text text-xs font-semibold mb-1">
                  CONFIDENCE LEVELS
                </div>
                <ul className="text-terminal-muted font-mono text-xs space-y-1">
                  <li>• 95%: High confidence</li>
                  <li>• 90%: Good confidence</li>
                  <li>• &lt;90%: Low confidence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          TECHNICAL SPECIFICATIONS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              DATA REQUIREMENTS
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• Minimum 10 data points</li>
              <li>• Regular time intervals</li>
              <li>• Numerical values only</li>
              <li>• Missing data interpolated</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              CALCULATION METHODS
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• Least squares regression</li>
              <li>• Pearson correlation</li>
              <li>• Standard error calculation</li>
              <li>• Confidence intervals</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              UPDATE FREQUENCY
            </h4>
            <ul className="space-y-1 text-terminal-muted font-mono text-xs">
              <li>• Real-time recalculation</li>
              <li>• New data integration</li>
              <li>• Historical recomputation</li>
              <li>• Performance optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}