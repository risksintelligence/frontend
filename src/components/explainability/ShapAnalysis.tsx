"use client";

import { getAccessibilityPattern, getRiskTextColor } from "@/lib/risk-colors";
import StatusBadge from "@/components/ui/StatusBadge";

interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
  importance: number;
  description?: string;
}

interface ShapAnalysisProps {
  features: ShapFeature[];
  baseValue: number;
  currentScore: number;
  model: string;
  timestamp?: string;
  title?: string;
}

export default function ShapAnalysis({
  features,
  baseValue,
  currentScore,
  model,
  timestamp,
  title = "ML Explainability"
}: ShapAnalysisProps) {
  // Sort features by absolute contribution (most impactful first)
  const sortedFeatures = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  
  // Calculate total contribution
  const totalContribution = features.reduce((sum, f) => sum + f.contribution, 0);
  const maxAbsContribution = Math.max(...features.map(f => Math.abs(f.contribution)));

  const getContributionColor = (contribution: number) => {
    if (contribution > 0) return "text-terminal-red bg-red-50 border-red-200";
    if (contribution < 0) return "text-terminal-green bg-green-50 border-green-200";
    return "text-terminal-muted bg-terminal-surface border-terminal-border";
  };

  const getContributionSymbol = (contribution: number) => {
    if (contribution > 0) return "▲";
    if (contribution < 0) return "▼";
    return "—";
  };

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            ML Explainability
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title} - SHAP Analysis
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Model: {model}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge 
            variant={currentScore >= 70 ? "critical" : currentScore >= 40 ? "warning" : "good"}
          >
            {currentScore.toFixed(1)} GRII
          </StatusBadge>
          <span className={`text-xs font-mono ${getRiskTextColor(currentScore)}`}>
            {getAccessibilityPattern(currentScore)}
          </span>
        </div>
      </div>

      {/* Base Value and Prediction */}
      <div className="bg-terminal-surface rounded border border-terminal-border p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-terminal-muted font-mono mb-1">Base Value</p>
            <p className="text-lg font-bold font-mono text-terminal-text">
              {baseValue.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-terminal-muted font-mono mb-1">Contribution</p>
            <p className={`text-lg font-bold font-mono ${totalContribution >= 0 ? 'text-terminal-red' : 'text-terminal-green'}`}>
              {totalContribution >= 0 ? '+' : ''}{totalContribution.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-terminal-muted font-mono mb-1">Final Score</p>
            <p className={`text-lg font-bold font-mono ${getRiskTextColor(currentScore)}`}>
              {currentScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contributions */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
          Feature Impact Ladder
        </p>
        
        {sortedFeatures.map((feature, index) => {
          const barWidth = Math.abs(feature.contribution) / maxAbsContribution * 100;
          const contributionColor = getContributionColor(feature.contribution);
          const symbol = getContributionSymbol(feature.contribution);
          const riskColor = getRiskTextColor(Math.abs(feature.contribution * 10)); // Scale for risk color

          return (
            <div
              key={feature.name}
              className="flex items-center justify-between rounded border border-terminal-border bg-terminal-bg p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono ${riskColor}`}>
                    #{index + 1}
                  </span>
                  <p className="text-sm font-semibold text-terminal-text font-mono truncate">
                    {feature.name}
                  </p>
                  <span className={`text-xs font-mono ${contributionColor.split(' ')[0]}`}>
                    {symbol}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-terminal-surface rounded-full h-2 relative">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        feature.contribution >= 0 ? 'bg-red-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <p className="text-xs text-terminal-muted font-mono">
                    Value: {feature.value.toFixed(2)}
                  </p>
                </div>
                
                {feature.description && (
                  <p className="text-xs text-terminal-muted font-mono mt-1">
                    {feature.description}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold font-mono ${contributionColor.split(' ')[0]}`}>
                  {feature.contribution >= 0 ? '+' : ''}{feature.contribution.toFixed(2)}
                </p>
                <p className="text-xs text-terminal-muted font-mono">
                  {(feature.importance * 100).toFixed(1)}% imp
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-terminal-surface rounded border border-terminal-border p-3">
        <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
          Model Performance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm font-bold font-mono text-terminal-text">
              {features.length}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Features
            </p>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-terminal-text">
              {features.filter(f => f.contribution > 0).length}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Risk Drivers
            </p>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-terminal-text">
              {features.filter(f => f.contribution < 0).length}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Risk Reducers
            </p>
          </div>
          <div>
            <p className={`text-sm font-bold font-mono ${getRiskTextColor(Math.abs(totalContribution))}`}>
              {Math.abs(totalContribution).toFixed(1)}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Net Impact
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono">
          Data: ML Pipeline L1 · Updated {timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors">
          View Methodology Docs →
        </button>
      </div>
    </section>
  );
}