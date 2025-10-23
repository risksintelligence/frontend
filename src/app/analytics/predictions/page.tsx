'use client';

import { Brain } from 'lucide-react';
import PredictionDashboard from '@/components/analytics/PredictionDashboard';
import ForecastCharts from '@/components/analytics/ForecastCharts';

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-terminal-blue" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-terminal-text">
              PREDICTIONS & FORECASTS
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Machine learning powered economic and market forecasting
            </p>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Models Active: <span className="text-terminal-green">5</span> | 
          Avg Accuracy: <span className="text-terminal-green">94.2%</span>
        </div>
      </div>

      {/* Prediction Dashboard */}
      <div>
        <PredictionDashboard />
      </div>

      {/* Forecast Charts */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="mb-6">
          <h2 className="text-xl font-mono font-semibold text-terminal-text mb-2">
            INTERACTIVE FORECAST VISUALIZATION
          </h2>
          <p className="text-terminal-muted font-mono text-sm">
            Detailed forecast charts with confidence intervals and historical data
          </p>
        </div>
        
        <ForecastCharts timeHorizon="6m" showConfidence={true} />
      </div>
    </div>
  );
}