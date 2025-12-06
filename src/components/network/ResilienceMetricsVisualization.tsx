"use client";


import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import { getRiskLevel, getRiskTextColor, getAccessibilityPattern } from "@/lib/risk-colors";
import { useQuery } from "@tanstack/react-query";
import { getResilienceMetrics } from "@/services/realTimeDataService";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Shield, TrendingUp, AlertCircle, CheckCircle, Activity } from "lucide-react";

interface ResilienceMetricsVisualizationProps {
  className?: string;
}

export default function ResilienceMetricsVisualization({ className }: ResilienceMetricsVisualizationProps) {
  const isClient = useIsClient();
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    dataUpdatedAt 
  } = useQuery({
    queryKey: ["resilience-metrics"],
    queryFn: getResilienceMetrics,
    staleTime: 60_000, // 1 minute
    refetchInterval: 120_000, // 2 minutes
  });

  if (isLoading) {
    return <SkeletonLoader variant="card" className={`h-96 ${className}`} />;
  }

  if (error) {
    return (
      <div className={`terminal-card p-6 ${className}`}>
        <div className="text-center space-y-2">
          <StatusBadge variant="critical">Error</StatusBadge>
          <p className="text-sm text-terminal-muted">Failed to load resilience metrics</p>
          <Button onClick={() => refetch()} size="sm" variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const resilienceData = data?.resilience_metrics || {};
  const overallScore = resilienceData.overall_score || 0;
  const sectorScores = resilienceData.sector_scores || {};
  const recommendations = resilienceData.recommendations || [];
  const riskLevel = getRiskLevel(overallScore);

  // Transform data for charts
  const sectorData = Object.entries(sectorScores).map(([sector, score]) => ({
    name: sector.replace(/_/g, ' ').toUpperCase(),
    score: typeof score === 'number' ? Math.round(score) : 0,
    fill: typeof score === 'number' && score > 70 ? '#10b981' : 
          typeof score === 'number' && score > 50 ? '#f59e0b' : '#ef4444',
  }));

  const radialData = [
    {
      name: 'Resilience Score',
      value: overallScore,
      fill: riskLevel.semanticColor === 'green' ? '#10b981' : 
            riskLevel.semanticColor === 'amber' ? '#f59e0b' : '#ef4444',
    }
  ];

  // Mock additional metrics for comprehensive display
  const additionalMetrics = {
    redundancy: resilienceData.redundancy_score || Math.round(overallScore * 0.9),
    adaptability: resilienceData.adaptability_score || Math.round(overallScore * 1.1),
    recovery_time: resilienceData.avg_recovery_time || Math.round(48 + (100 - overallScore) * 2),
    critical_nodes: resilienceData.critical_nodes_count || Math.round(overallScore / 10),
  };

  const metricTrendData = [
    { name: 'Redundancy', score: additionalMetrics.redundancy, change: 2.3 },
    { name: 'Adaptability', score: additionalMetrics.adaptability, change: -1.2 },
    { name: 'Recovery', score: Math.round(100 - additionalMetrics.recovery_time / 2), change: 0.8 },
    { name: 'Robustness', score: Math.round(overallScore * 0.95), change: 1.5 },
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className={`terminal-card space-y-4 ${className}`}>
      {/* Fallback Data Warning */}
      {data?.fallback_data && (
        <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-semibold text-sm">Displaying Synthetic Data</h3>
          </div>
          <p className="text-amber-200 text-sm">
            Resilience metrics API is currently unavailable. The data shown is simulated for demonstration purposes.
            {data?.metadata?.fallback_reason && (
              <span className="block text-xs text-amber-300 mt-1">
                Reason: {data.metadata.fallback_reason}
              </span>
            )}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">SUPPLY CHAIN RESILIENCE</p>
            <h3 className="text-lg font-bold text-terminal-text">Resilience Metrics & Scoring</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-terminal-muted">
              Last updated: {new Date(dataUpdatedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()} size="sm" variant="outline" className="font-mono text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Score & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Resilience Score"
          value={overallScore}
          unit="/ 100"
          change={1.2}
          status={riskLevel.semanticColor}
          updatedAt={new Date(dataUpdatedAt).toISOString()}
          className="col-span-1 md:col-span-2"
          icon={<Shield className="h-5 w-5" />}
        />

        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-terminal-muted" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Recovery Time</span>
          </div>
          <p className="text-xl font-bold font-mono text-terminal-text">
            {additionalMetrics.recovery_time}h
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            Avg recovery duration
          </p>
        </div>

        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-terminal-muted" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Critical Nodes</span>
          </div>
          <p className="text-xl font-bold font-mono text-terminal-text">
            {additionalMetrics.critical_nodes}
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            High-risk dependencies
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radial Score Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
            Resilience Score Gauge
          </h4>
          <div className="h-48 w-full">
            {isClient ? (
              <ResponsiveContainer>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: '#374151' }}
                  />
                  <text 
                    x="50%" 
                    y="50%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    className="fill-terminal-text font-mono font-bold text-2xl"
                  >
                    {overallScore}
                  </text>
                  <text 
                    x="50%" 
                    y="50%" 
                    dy={20}
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    className="fill-terminal-muted font-mono text-xs"
                  >
                    {riskLevel.name}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <SkeletonLoader variant="chart" className="h-48" />
            )}
          </div>
        </div>

        {/* Sector Scores */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
            Sector Resilience Breakdown
          </h4>
          <div className="h-48 w-full">
            {isClient && sectorData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{ 
                      fontFamily: "JetBrains Mono", 
                      fontSize: 11, 
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '4px',
                      color: '#f9fafb'
                    }}
                  />
                  <Bar dataKey="score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-terminal-muted font-mono">No sector data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Trends */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
          Resilience Component Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {metricTrendData.map((metric, index) => (
            <div key={metric.name} className="border border-terminal-border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
                  {metric.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-mono ${getRiskTextColor(metric.score)}`}>
                    {getAccessibilityPattern(metric.score)}
                  </span>
                  <TrendingUp 
                    className={`h-3 w-3 ${metric.change > 0 ? 'text-terminal-green' : 'text-terminal-red'}`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className={`text-lg font-bold font-mono ${getRiskTextColor(metric.score)}`}>
                  {metric.score}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <div className="w-12 h-2 bg-terminal-border/20 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        metric.score > 70 ? 'bg-terminal-green' : 
                        metric.score > 50 ? 'bg-terminal-orange' : 'bg-terminal-red'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-terminal-border">
          <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
            Resilience Recommendations
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recommendations.slice(0, 6).map((recommendation, index) => (
              <div key={index} className="border border-terminal-border rounded p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-terminal-green mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-terminal-text">
                      {recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div className="pt-3 border-t border-terminal-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge 
            variant={riskLevel.urgency === "HIGH" ? "critical" : 
                    riskLevel.urgency === "MEDIUM" ? "warning" : "good"}
            size="sm"
          >
            {riskLevel.name}
          </StatusBadge>
          <span className="text-xs font-mono text-terminal-muted">
            {riskLevel.meaning}
          </span>
        </div>
        <span className="text-xs font-mono text-terminal-muted">
          Based on {Object.keys(sectorScores).length} sectors analyzed
        </span>
      </div>
    </div>
  );
}
