"use client";

import { useIsClient } from "@/hooks/useIsClient";
import { useTimelineCascade } from "@/hooks/useTimelineCascade";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { getRiskTextColor, getAccessibilityPattern } from "@/lib/risk-colors";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Timeline,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";
import { Clock, AlertTriangle, TrendingUp, Globe } from "lucide-react";

type VisualizationType = 'timeline' | 'gantt' | 'flowchart';

interface TimelineCascadeVisualizationProps {
  className?: string;
}

export default function TimelineCascadeVisualization({ className }: TimelineCascadeVisualizationProps) {
  const isClient = useIsClient();
  const {
    data,
    loading,
    error,
    visualizationType,
    setVisualizationType,
    refreshData,
    isStale,
    activeCascades,
    totalEvents,
  } = useTimelineCascade('timeline');

  const [selectedTab, setSelectedTab] = useState<VisualizationType>('timeline');

  const handleVisualizationChange = (type: VisualizationType) => {
    setSelectedTab(type);
    setVisualizationType(type);
  };

  if (loading) {
    return <SkeletonLoader variant="chart" className={`h-96 ${className}`} />;
  }

  if (error) {
    return (
      <div className={`terminal-card p-6 ${className}`}>
        <div className="text-center space-y-2">
          <StatusBadge variant="critical">Error</StatusBadge>
          <p className="text-sm text-terminal-muted">{error}</p>
          <Button onClick={refreshData} size="sm" variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`terminal-card p-4 ${className}`}>
        <p className="text-sm text-terminal-muted font-mono">No timeline data available.</p>
      </div>
    );
  }

  // Transform data for different visualization types
  const timelineData = data.cascade_events.map((event, index) => ({
    name: event.name,
    start: new Date(event.start_time).getTime(),
    end: event.end_time ? new Date(event.end_time).getTime() : new Date().getTime(),
    severity: event.severity,
    impactRegions: event.impact_regions.length,
    supplyChainsAffected: event.supply_chains_affected.length,
    duration: event.end_time 
      ? Math.floor((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60))
      : Math.floor((new Date().getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60)),
    index,
  }));

  const severityDistribution = data.cascade_events.reduce((acc, event) => {
    acc[event.severity] = (acc[event.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(severityDistribution).map(([severity, count]) => ({
    severity: severity.toUpperCase(),
    count,
    fill: severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#10b981'
  }));

  const renderTimelineChart = () => (
    <div className="h-80 w-full">
      {isClient ? (
        <ResponsiveContainer>
          <AreaChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="start"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Impact Score', angle: -90, position: 'insideLeft' }}
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
              labelFormatter={(value) => `Time: ${new Date(value).toLocaleString()}`}
              formatter={(value, name) => [value, name]}
            />
            <Area
              type="monotone"
              dataKey="impactRegions"
              stackId="1"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.6}
              name="Regions Impacted"
            />
            <Area
              type="monotone"
              dataKey="supplyChainsAffected"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
              name="Supply Chains"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <SkeletonLoader variant="chart" className="h-80" />
      )}
    </div>
  );

  const renderGanttChart = () => (
    <div className="space-y-3">
      <div className="h-64 w-full overflow-y-auto">
        {data.cascade_events.map((event, index) => {
          const startTime = new Date(event.start_time);
          const endTime = event.end_time ? new Date(event.end_time) : new Date();
          const duration = Math.max(1, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24)); // Days
          const maxDuration = Math.max(...data.cascade_events.map(e => {
            const s = new Date(e.start_time);
            const end = e.end_time ? new Date(e.end_time) : new Date();
            return (end.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
          }));
          const widthPercent = Math.max(5, (duration / maxDuration) * 100);

          return (
            <div key={event.id} className="flex items-center space-x-3 py-2 border-b border-terminal-border/20">
              <div className="w-32 text-xs font-mono text-terminal-text truncate">
                {event.name}
              </div>
              <div className="flex-1 relative">
                <div 
                  className={`h-6 rounded flex items-center px-2 text-xs font-mono text-white ${
                    event.severity === 'high' ? 'bg-terminal-red' : 
                    event.severity === 'medium' ? 'bg-terminal-orange' : 'bg-terminal-green'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="truncate">
                    {duration < 1 ? '<1d' : `${Math.round(duration)}d`}
                  </span>
                </div>
              </div>
              <div className="w-16 text-xs font-mono text-terminal-muted text-right">
                <StatusBadge 
                  variant={event.severity === 'high' ? 'critical' : event.severity === 'medium' ? 'warning' : 'good'}
                  size="sm"
                >
                  {event.severity}
                </StatusBadge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFlowchart = () => (
    <div className="h-80 w-full">
      {isClient ? (
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="severity" 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }}
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
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <SkeletonLoader variant="chart" className="h-80" />
      )}
    </div>
  );

  const renderVisualization = () => {
    switch (selectedTab) {
      case 'timeline':
        return renderTimelineChart();
      case 'gantt':
        return renderGanttChart();
      case 'flowchart':
        return renderFlowchart();
      default:
        return renderTimelineChart();
    }
  };

  return (
    <div className={`terminal-card space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">CASCADE TIMELINE</p>
            <h3 className="text-lg font-bold text-terminal-text">Supply Chain Event Analysis</h3>
          </div>
          <div className="flex items-center gap-2">
            {isStale && (
              <StatusBadge variant="warning" size="sm">
                Stale Data
              </StatusBadge>
            )}
            <span className="text-xs font-mono text-terminal-muted">
              {data.metadata.generated_at ? new Date(data.metadata.generated_at).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} size="sm" variant="outline" className="font-mono text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="border border-terminal-border rounded p-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-terminal-muted" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Total Events</span>
          </div>
          <p className="text-xl font-bold font-mono text-terminal-text">{totalEvents}</p>
        </div>

        <div className="border border-terminal-border rounded p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-terminal-orange" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Active Cascades</span>
          </div>
          <p className={`text-xl font-bold font-mono ${getRiskTextColor(activeCascades * 20)}`}>
            {activeCascades}
          </p>
        </div>

        <div className="border border-terminal-border rounded p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-terminal-muted" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Critical Paths</span>
          </div>
          <p className="text-xl font-bold font-mono text-terminal-text">
            {data.critical_paths?.length || 0}
          </p>
        </div>

        <div className="border border-terminal-border rounded p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-terminal-muted" />
            <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Time Range</span>
          </div>
          <p className="text-sm font-mono text-terminal-text">
            {Math.ceil(
              (new Date(data.time_range.end_date).getTime() - 
               new Date(data.time_range.start_date).getTime()) / (1000 * 60 * 60 * 24)
            )} days
          </p>
        </div>
      </div>

      {/* Visualization Type Tabs */}
      <div className="border-b border-terminal-border">
        <div className="flex space-x-1">
          {(['timeline', 'gantt', 'flowchart'] as VisualizationType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleVisualizationChange(type)}
              className={`px-4 py-2 text-xs font-mono uppercase transition-colors ${
                selectedTab === type
                  ? 'text-terminal-text border-b-2 border-terminal-text'
                  : 'text-terminal-muted hover:text-terminal-text'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
            {selectedTab} VIEW
          </h4>
          <div className="text-xs font-mono text-terminal-muted">
            Showing {data.cascade_events.length} events
          </div>
        </div>
        {renderVisualization()}
      </div>

      {/* Critical Paths Summary */}
      {data.critical_paths && data.critical_paths.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-terminal-border">
          <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
            Critical Path Analysis
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.critical_paths.slice(0, 4).map((path, index) => (
              <div key={path.path_id} className="border border-terminal-border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
                    Path {index + 1}
                  </span>
                  <StatusBadge 
                    variant={path.risk_level === 'high' ? 'critical' : 
                            path.risk_level === 'medium' ? 'warning' : 'good'}
                    size="sm"
                  >
                    {path.risk_level}
                  </StatusBadge>
                </div>
                <p className="text-xs font-mono text-terminal-text mb-2">{path.description}</p>
                <div className="text-xs font-mono text-terminal-muted">
                  Events: {path.events.join(' → ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}