'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { useRiskOverview } from '@/hooks/useRiskOverview';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MetricCard from '@/components/ui/MetricCard';
import { bloombergClasses, getStatusColor, formatNumber } from '@/lib/bloomberg-theme';

export default function RiskOverviewDashboard() {
  const { riskData, loading, error, lastUpdated, refetch } = useRiskOverview();

  const getRiskLevel = (score: number): { level: string; color: string; icon: any } => {
    if (score >= 80) return { level: 'CRITICAL', color: bloombergClasses.text.error, icon: AlertTriangle };
    if (score >= 60) return { level: 'HIGH', color: bloombergClasses.text.warning, icon: TrendingUp };
    if (score >= 40) return { level: 'MODERATE', color: bloombergClasses.text.warning, icon: Minus };
    if (score >= 20) return { level: 'LOW', color: bloombergClasses.text.success, icon: TrendingDown };
    return { level: 'MINIMAL', color: bloombergClasses.text.success, icon: Shield };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className={`w-4 h-4 ${bloombergClasses.text.error}`} />;
      case 'falling': return <TrendingDown className={`w-4 h-4 ${bloombergClasses.text.success}`} />;
      default: return <Minus className={`w-4 h-4 ${bloombergClasses.text.muted}`} />;
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
      <div className={`${bloombergClasses.terminal.card} border-red-600`}>
        <div className={`flex items-center gap-3 ${bloombergClasses.text.error}`}>
          <AlertTriangle className="w-5 h-5" />
          <span className={bloombergClasses.text.primary}>Risk Data Unavailable</span>
        </div>
        <p className={`${bloombergClasses.text.muted} mt-2`}>{error}</p>
        <button 
          onClick={refetch}
          className={`${bloombergClasses.button.primary} mt-4`}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className={bloombergClasses.terminal.card}>
        <div className={`${bloombergClasses.text.muted} text-center`}>
          No risk data available
        </div>
      </div>
    );
  }

  const overallRisk = getRiskLevel(riskData.overall_score);
  const OverallIcon = overallRisk.icon;

  return (
    <div className={`${bloombergClasses.terminal.main} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`${bloombergClasses.text.primary} text-xl font-semibold uppercase tracking-wide`}>
          RISK INTELLIGENCE OVERVIEW
        </h1>
        <div className={`${bloombergClasses.text.muted} text-sm`}>
          Last Updated: {lastUpdated}
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className={bloombergClasses.terminal.panel}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${bloombergClasses.text.primary} text-lg font-semibold uppercase tracking-wide`}>
            OVERALL RISK ASSESSMENT
          </h2>
          {getTrendIcon(riskData.trend)}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <OverallIcon className={`w-8 h-8 ${overallRisk.color}`} />
            <div>
              <div className={`text-3xl ${bloombergClasses.text.primary} font-bold`}>
                {formatNumber(riskData.overall_score, 1)}
              </div>
              <div className={`text-sm ${overallRisk.color} font-semibold`}>
                {overallRisk.level}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className={`${bloombergClasses.text.muted} text-sm uppercase tracking-wide`}>Confidence</span>
              <span className={`${bloombergClasses.text.accent} text-sm font-semibold`}>
                {formatNumber(riskData.confidence * 100, 1)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-600">
              <div 
                className={`${bloombergClasses.data.positive.replace('text-', 'bg-')} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${riskData.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Components */}
      <div className={bloombergClasses.grid.container}>
        <div className={`${bloombergClasses.grid.cols4} gap-4`}>
          <MetricCard
            title="Economic Risk"
            value={formatNumber(riskData.components.economic, 1)}
            trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
            status={riskData.components.economic >= 70 ? 'critical' : riskData.components.economic >= 40 ? 'warning' : 'good'}
            icon={TrendingUp}
          />
          
          <MetricCard
            title="Market Risk"
            value={formatNumber(riskData.components.market, 1)}
            trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
            status={riskData.components.market >= 70 ? 'critical' : riskData.components.market >= 40 ? 'warning' : 'good'}
            icon={TrendingUp}
          />
          
          <MetricCard
            title="Geopolitical Risk"
            value={formatNumber(riskData.components.geopolitical, 1)}
            trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
            status={riskData.components.geopolitical >= 70 ? 'critical' : riskData.components.geopolitical >= 40 ? 'warning' : 'good'}
            icon={AlertTriangle}
          />
          
          <MetricCard
            title="Technical Risk"
            value={formatNumber(riskData.components.technical, 1)}
            trend={riskData.trend === 'rising' ? 'up' : riskData.trend === 'falling' ? 'down' : 'stable'}
            status={riskData.components.technical >= 70 ? 'critical' : riskData.components.technical >= 40 ? 'warning' : 'good'}
            icon={Shield}
          />
        </div>
      </div>

      {/* Risk Methodology Info */}
      <div className={bloombergClasses.terminal.panel}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`${bloombergClasses.text.primary} font-semibold mb-1 uppercase tracking-wide`}>
              Calculation Method
            </h3>
            <p className={`${bloombergClasses.text.secondary} text-sm`}>
              {riskData.calculation_method || 'Multi-factor weighted analysis'}
            </p>
          </div>
          <div>
            <h3 className={`${bloombergClasses.text.primary} font-semibold mb-1 uppercase tracking-wide`}>
              Data Sources
            </h3>
            <p className={`${bloombergClasses.text.secondary} text-sm`}>
              {riskData.data_sources?.join(', ') || 'FRED, BEA, BLS, Market Data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}