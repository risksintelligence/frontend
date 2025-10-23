'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { useRiskOverview } from '@/hooks/useRiskOverview';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MetricCard from '@/components/ui/MetricCard';

export default function RiskOverviewDashboard() {
  const { riskData, loading, error, lastUpdated, refetch } = useRiskOverview();

  const getRiskLevel = (score: number): { level: string; color: string; icon: any } => {
    if (score >= 80) return { level: 'CRITICAL', color: 'text-terminal-red', icon: AlertTriangle };
    if (score >= 60) return { level: 'HIGH', color: 'text-terminal-orange', icon: TrendingUp };
    if (score >= 40) return { level: 'MODERATE', color: 'text-terminal-orange', icon: Minus };
    if (score >= 20) return { level: 'LOW', color: 'text-terminal-green', icon: TrendingDown };
    return { level: 'MINIMAL', color: 'text-terminal-green', icon: Shield };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-terminal-red" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-terminal-green" />;
      default: return <Minus className="w-4 h-4 text-terminal-muted" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-terminal-surface border border-terminal-red p-6 rounded">
        <div className="flex items-center gap-3 text-terminal-red">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-mono">Risk Data Unavailable</span>
        </div>
        <p className="text-terminal-muted mt-2 font-mono text-sm">{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-terminal-red text-terminal-bg font-mono text-sm rounded hover:bg-terminal-red/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="text-terminal-muted font-mono text-center">
          No risk data available
        </div>
      </div>
    );
  }

  const overallRisk = getRiskLevel(riskData.overall_score);
  const OverallIcon = overallRisk.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-mono font-semibold text-terminal-text">
          RISK INTELLIGENCE OVERVIEW
        </h1>
        <div className="text-terminal-muted font-mono text-sm">
          Last Updated: {lastUpdated}
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-semibold text-terminal-text">
            OVERALL RISK ASSESSMENT
          </h2>
          {getTrendIcon(riskData.trend)}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <OverallIcon className={`w-8 h-8 ${overallRisk.color}`} />
            <div>
              <div className={`text-3xl font-mono font-bold ${overallRisk.color}`}>
                {riskData.overall_score.toFixed(1)}
              </div>
              <div className={`text-sm font-mono ${overallRisk.color}`}>
                {overallRisk.level}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-terminal-muted font-mono text-sm">Confidence</span>
              <span className="text-terminal-text font-mono text-sm">
                {(riskData.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-terminal-bg rounded-full h-2">
              <div 
                className="bg-terminal-green h-2 rounded-full"
                style={{ width: `${riskData.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Economic Risk"
          value={riskData.components.economic.toFixed(1)}
          trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
          status={riskData.components.economic >= 70 ? 'critical' : riskData.components.economic >= 40 ? 'warning' : 'good'}
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Market Risk"
          value={riskData.components.market.toFixed(1)}
          trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
          status={riskData.components.market >= 70 ? 'critical' : riskData.components.market >= 40 ? 'warning' : 'good'}
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Geopolitical Risk"
          value={riskData.components.geopolitical.toFixed(1)}
          trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
          status={riskData.components.geopolitical >= 70 ? 'critical' : riskData.components.geopolitical >= 40 ? 'warning' : 'good'}
          icon={AlertTriangle}
        />
        
        <MetricCard
          title="Technical Risk"
          value={riskData.components.technical.toFixed(1)}
          trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
          status={riskData.components.technical >= 70 ? 'critical' : riskData.components.technical >= 40 ? 'warning' : 'good'}
          icon={Shield}
        />
      </div>

      {/* Risk Methodology Info */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono font-semibold text-terminal-text mb-1">
              Calculation Method
            </h3>
            <p className="text-terminal-muted font-mono text-sm">
              {riskData.calculation_method || 'Multi-factor weighted analysis'}
            </p>
          </div>
          <div>
            <h3 className="font-mono font-semibold text-terminal-text mb-1">
              Data Sources
            </h3>
            <p className="text-terminal-muted font-mono text-sm">
              {riskData.data_sources?.join(', ') || 'FRED, BEA, BLS, Market Data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}