'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';

interface RiskScoreDisplayProps {
  score: number;
  trend: 'rising' | 'falling' | 'stable';
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function RiskScoreDisplay({ 
  score, 
  trend, 
  confidence, 
  size = 'md',
  showDetails = true 
}: RiskScoreDisplayProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'CRITICAL', color: 'text-terminal-red', icon: AlertTriangle };
    if (score >= 60) return { level: 'HIGH', color: 'text-terminal-orange', icon: TrendingUp };
    if (score >= 40) return { level: 'MODERATE', color: 'text-terminal-orange', icon: Minus };
    if (score >= 20) return { level: 'LOW', color: 'text-terminal-green', icon: TrendingDown };
    return { level: 'MINIMAL', color: 'text-terminal-green', icon: Shield };
  };

  const getTrendIcon = (trend: string) => {
    const iconClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
    
    switch (trend) {
      case 'rising': return <TrendingUp className={`${iconClass} text-terminal-red`} />;
      case 'falling': return <TrendingDown className={`${iconClass} text-terminal-green`} />;
      default: return <Minus className={`${iconClass} text-terminal-muted`} />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return {
          container: 'p-6',
          score: 'text-4xl',
          level: 'text-base',
          icon: 'w-10 h-10'
        };
      case 'md':
        return {
          container: 'p-4',
          score: 'text-3xl',
          level: 'text-sm',
          icon: 'w-8 h-8'
        };
      case 'sm':
        return {
          container: 'p-3',
          score: 'text-xl',
          level: 'text-xs',
          icon: 'w-6 h-6'
        };
    }
  };

  const riskLevel = getRiskLevel(score);
  const RiskIcon = riskLevel.icon;
  const sizeClasses = getSizeClasses();

  return (
    <div className={`bg-terminal-surface border border-terminal-border rounded ${sizeClasses.container}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono font-semibold text-terminal-text">
          RISK SCORE
        </h3>
        {getTrendIcon(trend)}
      </div>

      <div className="flex items-center gap-4">
        {/* Risk Icon & Score */}
        <div className="flex items-center gap-3">
          <RiskIcon className={`${sizeClasses.icon} ${riskLevel.color}`} />
          <div>
            <div className={`${sizeClasses.score} font-mono font-bold ${riskLevel.color}`}>
              {score.toFixed(1)}
            </div>
            <div className={`${sizeClasses.level} font-mono ${riskLevel.color}`}>
              {riskLevel.level}
            </div>
          </div>
        </div>

        {/* Confidence & Progress */}
        {showDetails && (
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted font-mono text-xs">Confidence</span>
              <span className="text-terminal-text font-mono text-xs">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
            
            {/* Confidence Bar */}
            <div className="w-full bg-terminal-bg rounded-full h-2">
              <div 
                className="bg-terminal-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-terminal-bg rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${riskLevel.color.replace('text-', 'bg-')}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Level Description */}
      {showDetails && size !== 'sm' && (
        <div className="mt-4 pt-3 border-t border-terminal-border">
          <p className="text-terminal-muted font-mono text-xs">
            {getRiskDescription(riskLevel.level)}
          </p>
        </div>
      )}
    </div>
  );
}

function getRiskDescription(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return 'Immediate attention required. High probability of significant impact.';
    case 'HIGH':
      return 'Elevated risk levels. Monitor closely and consider mitigation strategies.';
    case 'MODERATE':
      return 'Standard risk levels. Regular monitoring and basic controls sufficient.';
    case 'LOW':
      return 'Below average risk. Maintain current monitoring protocols.';
    case 'MINIMAL':
      return 'Negligible risk levels. Standard operational procedures apply.';
    default:
      return 'Risk assessment pending.';
  }
}