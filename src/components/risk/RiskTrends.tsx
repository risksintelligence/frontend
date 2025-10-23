'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from 'lucide-react';

interface RiskTrendData {
  date: string;
  overall_score: number;
  economic: number;
  market: number;
  geopolitical: number;
  technical: number;
}

interface RiskTrendsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  showComponents?: boolean;
}

export default function RiskTrends({ timeRange = '30d', showComponents = true }: RiskTrendsProps) {
  const [trendData, setTrendData] = useState<RiskTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'economic' | 'market' | 'geopolitical' | 'technical'>('overall');

  useEffect(() => {
    fetchTrendData();
  }, [timeRange]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch(`/api/v1/risk/trends?range=${timeRange}`);
      // const data = await response.json();
      
      // Sample trend data for demonstration
      const sampleData: RiskTrendData[] = generateSampleTrendData(timeRange);
      setTrendData(sampleData);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleTrendData = (range: string): RiskTrendData[] => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const data: RiskTrendData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate trending data with some volatility
      const baseScore = 75 + Math.sin(i / 10) * 10 + Math.random() * 5 - 2.5;
      
      data.push({
        date: date.toISOString().split('T')[0],
        overall_score: Math.max(0, Math.min(100, baseScore)),
        economic: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
        market: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
        geopolitical: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
        technical: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5))
      });
    }
    
    return data;
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'overall': return 'text-terminal-green';
      case 'economic': return 'text-terminal-blue';
      case 'market': return 'text-terminal-orange';
      case 'geopolitical': return 'text-terminal-red';
      case 'technical': return 'text-terminal-purple';
      default: return 'text-terminal-muted';
    }
  };

  const getChangeDirection = (data: RiskTrendData[], metric: keyof RiskTrendData) => {
    if (data.length < 2) return 'stable';
    
    const current = data[data.length - 1][metric] as number;
    const previous = data[data.length - 2][metric] as number;
    
    if (current > previous + 1) return 'rising';
    if (current < previous - 1) return 'falling';
    return 'stable';
  };

  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-terminal-red" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-terminal-green" />;
      default: return <Minus className="w-4 h-4 text-terminal-muted" />;
    }
  };

  const calculateChange = (data: RiskTrendData[], metric: keyof RiskTrendData) => {
    if (data.length < 2) return 0;
    
    const current = data[data.length - 1][metric] as number;
    const previous = data[data.length - 2][metric] as number;
    
    return current - previous;
  };

  if (loading) {
    return (
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="animate-pulse">
          <div className="h-4 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-terminal-bg rounded"></div>
        </div>
      </div>
    );
  }

  const currentData = trendData[trendData.length - 1];
  const overallDirection = getChangeDirection(trendData, 'overall_score');
  const overallChange = calculateChange(trendData, 'overall_score');

  return (
    <div className="bg-terminal-surface border border-terminal-border p-6 rounded space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-terminal-green" />
          <h3 className="font-mono font-semibold text-terminal-text">
            RISK TRENDS
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {getChangeIcon(overallDirection)}
          <span className={`font-mono text-sm ${
            overallDirection === 'rising' ? 'text-terminal-red' : 
            overallDirection === 'falling' ? 'text-terminal-green' : 
            'text-terminal-muted'
          }`}>
            {overallChange > 0 ? '+' : ''}{overallChange.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-terminal-muted" />
        <div className="flex gap-1">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => fetchTrendData()}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                timeRange === range
                  ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                  : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-48 bg-terminal-bg border border-terminal-border rounded p-4">
        <svg className="w-full h-full" viewBox="0 0 400 160">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={160 - (y * 1.6)}
              x2="400"
              y2={160 - (y * 1.6)}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-terminal-border"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Main trend line */}
          {trendData.length > 1 && (
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-terminal-green"
              points={trendData
                .map((point, index) => {
                  const x = (index / (trendData.length - 1)) * 400;
                  const y = 160 - (point[selectedMetric === 'overall' ? 'overall_score' : selectedMetric] * 1.6);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}
          
          {/* Data points */}
          {trendData.map((point, index) => {
            const x = (index / (trendData.length - 1)) * 400;
            const y = 160 - (point[selectedMetric === 'overall' ? 'overall_score' : selectedMetric] * 1.6);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className="text-terminal-green"
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-terminal-muted font-mono py-2">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
      </div>

      {/* Metric Selector */}
      {showComponents && (
        <div className="space-y-3">
          <h4 className="font-mono font-semibold text-terminal-text text-sm">
            RISK COMPONENTS
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              { key: 'overall', label: 'Overall' },
              { key: 'economic', label: 'Economic' },
              { key: 'market', label: 'Market' },
              { key: 'geopolitical', label: 'Geopolitical' },
              { key: 'technical', label: 'Technical' }
            ].map((metric) => {
              const direction = getChangeDirection(trendData, metric.key as keyof RiskTrendData);
              const change = calculateChange(trendData, metric.key as keyof RiskTrendData);
              const current = currentData?.[metric.key as keyof RiskTrendData] as number;
              
              return (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key as any)}
                  className={`p-3 rounded border transition-colors ${
                    selectedMetric === metric.key
                      ? 'bg-terminal-green/20 border-terminal-green text-terminal-green'
                      : 'border-terminal-border hover:border-terminal-green/50 text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">
                        {metric.label.toUpperCase()}
                      </span>
                      {getChangeIcon(direction)}
                    </div>
                    
                    <div className="text-lg font-mono font-bold">
                      {current?.toFixed(1) || '0.0'}
                    </div>
                    
                    <div className={`text-xs font-mono ${
                      direction === 'rising' ? 'text-terminal-red' : 
                      direction === 'falling' ? 'text-terminal-green' : 
                      'text-terminal-muted'
                    }`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="pt-4 border-t border-terminal-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-terminal-muted font-mono text-xs">CURRENT</div>
            <div className="text-terminal-text font-mono text-lg font-bold">
              {currentData?.overall_score.toFixed(1) || '0.0'}
            </div>
          </div>
          
          <div>
            <div className="text-terminal-muted font-mono text-xs">CHANGE</div>
            <div className={`font-mono text-lg font-bold ${
              overallChange > 0 ? 'text-terminal-red' : 
              overallChange < 0 ? 'text-terminal-green' : 
              'text-terminal-muted'
            }`}>
              {overallChange > 0 ? '+' : ''}{overallChange.toFixed(1)}
            </div>
          </div>
          
          <div>
            <div className="text-terminal-muted font-mono text-xs">VOLATILITY</div>
            <div className="text-terminal-text font-mono text-lg font-bold">
              {Math.abs(overallChange).toFixed(1)}
            </div>
          </div>
          
          <div>
            <div className="text-terminal-muted font-mono text-xs">TREND</div>
            <div className="text-terminal-text font-mono text-lg font-bold">
              {overallDirection.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}