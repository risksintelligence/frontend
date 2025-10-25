'use client';

import { useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import ShapExplanation from './ShapExplanation';

interface RiskFactor {
  name: string;
  score: number;
  impact: 'low' | 'moderate' | 'high';
  trend: 'rising' | 'falling' | 'stable';
  description?: string;
}

interface RiskFactorCardProps {
  factor: RiskFactor;
  icon: LucideIcon;
}

export default function RiskFactorCard({ factor, icon: Icon }: RiskFactorCardProps) {
  const [showShap, setShowShap] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-terminal-red';
    if (score >= 60) return 'text-terminal-orange';
    if (score >= 40) return 'text-terminal-orange';
    if (score >= 20) return 'text-terminal-green';
    return 'text-terminal-green';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MODERATE';
    if (score >= 20) return 'LOW';
    return 'MINIMAL';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-terminal-red';
      case 'moderate': return 'text-terminal-orange';
      case 'low': return 'text-terminal-green';
      default: return 'text-terminal-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-3 h-3 text-terminal-red" />;
      case 'falling': return <TrendingDown className="w-3 h-3 text-terminal-green" />;
      default: return <Minus className="w-3 h-3 text-terminal-muted" />;
    }
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border p-4 rounded hover:bg-terminal-surface/80 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-terminal-green" />
          <h3 className="font-mono font-semibold text-terminal-text text-sm">
            {factor.name.toUpperCase()}
          </h3>
        </div>
        {getTrendIcon(factor.trend)}
      </div>

      <div className="space-y-3">
        {/* Risk Score */}
        <div className="flex items-center justify-between">
          <span className="text-terminal-muted font-mono text-xs">Risk Score</span>
          <div className="text-right">
            <div className={`text-lg font-mono font-bold ${getScoreColor(factor.score || 0)}`}>
              {(factor.score || 0).toFixed(1)}
            </div>
            <div className={`text-xs font-mono ${getScoreColor(factor.score || 0)}`}>
              {getScoreLevel(factor.score || 0)}
            </div>
          </div>
        </div>

        {/* Impact Level */}
        <div className="flex items-center justify-between">
          <span className="text-terminal-muted font-mono text-xs">Impact</span>
          <span className={`text-xs font-mono font-semibold ${getImpactColor(factor.impact)}`}>
            {factor.impact.toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-terminal-bg rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${getScoreColor(factor.score || 0).replace('text-', 'bg-')}`}
              style={{ width: `${factor.score || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Description */}
        {factor.description && (
          <p className="text-terminal-muted font-mono text-xs leading-relaxed">
            {factor.description}
          </p>
        )}

        {/* SHAP Explanation Toggle */}
        <button
          onClick={() => setShowShap(!showShap)}
          className="flex items-center gap-2 text-xs font-mono text-terminal-green hover:text-terminal-text transition-colors w-full justify-center py-2 mt-2 border border-terminal-border rounded hover:bg-terminal-bg"
        >
          <Brain className="w-3 h-3" />
          <span>Explanation</span>
          {showShap ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* SHAP Explanation */}
      {showShap && (
        <div className="border-t border-terminal-border p-4">
          <ShapExplanation 
            riskScore={factor.score || 0}
            predictionId={`factor-${factor.name || 'unknown'}`}
            showDetails={false}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}