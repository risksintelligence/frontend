'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart, Calendar, Filter } from 'lucide-react';

interface TrendData {
  date: string;
  value: number;
  indicator: string;
  category: string;
}

interface TrendAnalysisResult {
  indicator: string;
  category: string;
  trend: 'rising' | 'falling' | 'stable';
  strength: 'weak' | 'moderate' | 'strong';
  slope: number;
  correlation: number;
  r_squared: number;
  volatility: number;
  recent_change: number;
  recent_change_percent: number;
}

interface TrendAnalysisProps {
  timeRange?: '1m' | '3m' | '6m' | '1y' | '2y';
}

export default function TrendAnalysis({ timeRange = '6m' }: TrendAnalysisProps) {
  const [trendResults, setTrendResults] = useState<TrendAnalysisResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'strength' | 'volatility' | 'change'>('strength');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendAnalysis();
  }, [timeRange]);

  const fetchTrendAnalysis = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/trends?range=${timeRange}`);
      // const data = await response.json();
      
      // Sample trend analysis results
      const sampleResults: TrendAnalysisResult[] = [
        {
          indicator: 'GDP Growth Rate',
          category: 'economic',
          trend: 'falling',
          strength: 'moderate',
          slope: -0.15,
          correlation: -0.78,
          r_squared: 0.61,
          volatility: 12.4,
          recent_change: -0.3,
          recent_change_percent: -12.5
        },
        {
          indicator: 'Unemployment Rate',
          category: 'employment',
          trend: 'stable',
          strength: 'weak',
          slope: 0.02,
          correlation: 0.23,
          r_squared: 0.05,
          volatility: 8.7,
          recent_change: -0.1,
          recent_change_percent: -2.6
        },
        {
          indicator: 'Consumer Price Index',
          category: 'inflation',
          trend: 'rising',
          strength: 'strong',
          slope: 0.28,
          correlation: 0.89,
          r_squared: 0.79,
          volatility: 15.2,
          recent_change: 0.4,
          recent_change_percent: 14.3
        },
        {
          indicator: 'Federal Funds Rate',
          category: 'monetary',
          trend: 'rising',
          strength: 'strong',
          slope: 0.45,
          correlation: 0.92,
          r_squared: 0.85,
          volatility: 22.1,
          recent_change: 0.25,
          recent_change_percent: 5.0
        },
        {
          indicator: 'Manufacturing PMI',
          category: 'economic',
          trend: 'falling',
          strength: 'moderate',
          slope: -0.18,
          correlation: -0.65,
          r_squared: 0.42,
          volatility: 9.8,
          recent_change: -1.2,
          recent_change_percent: -2.4
        },
        {
          indicator: 'Consumer Confidence',
          category: 'sentiment',
          trend: 'falling',
          strength: 'weak',
          slope: -0.08,
          correlation: -0.45,
          r_squared: 0.20,
          volatility: 18.5,
          recent_change: -2.1,
          recent_change_percent: -2.0
        },
        {
          indicator: 'Housing Price Index',
          category: 'housing',
          trend: 'rising',
          strength: 'moderate',
          slope: 0.22,
          correlation: 0.71,
          r_squared: 0.50,
          volatility: 6.3,
          recent_change: 0.8,
          recent_change_percent: 2.1
        },
        {
          indicator: 'Corporate Bond Spreads',
          category: 'financial',
          trend: 'rising',
          strength: 'moderate',
          slope: 0.12,
          correlation: 0.58,
          r_squared: 0.34,
          volatility: 25.7,
          recent_change: 8.5,
          recent_change_percent: 9.5
        },
        {
          indicator: 'Dollar Index (DXY)',
          category: 'currency',
          trend: 'stable',
          strength: 'weak',
          slope: -0.03,
          correlation: -0.18,
          r_squared: 0.03,
          volatility: 11.2,
          recent_change: -0.2,
          recent_change_percent: -0.2
        },
        {
          indicator: 'Oil Prices (WTI)',
          category: 'commodities',
          trend: 'falling',
          strength: 'strong',
          slope: -0.35,
          correlation: -0.81,
          r_squared: 0.66,
          volatility: 28.9,
          recent_change: -4.2,
          recent_change_percent: -5.3
        }
      ];
      
      setTrendResults(sampleResults);
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-terminal-red" />;
      default: return <Minus className="w-4 h-4 text-terminal-muted" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-terminal-green';
      case 'falling': return 'text-terminal-red';
      default: return 'text-terminal-muted';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-terminal-green';
      case 'moderate': return 'text-terminal-orange';
      case 'weak': return 'text-terminal-muted';
      default: return 'text-terminal-muted';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      economic: 'text-terminal-green',
      employment: 'text-terminal-blue',
      inflation: 'text-terminal-orange',
      monetary: 'text-terminal-purple',
      sentiment: 'text-terminal-yellow',
      housing: 'text-terminal-cyan',
      financial: 'text-terminal-red',
      currency: 'text-terminal-pink',
      commodities: 'text-terminal-brown'
    };
    return colors[category] || 'text-terminal-muted';
  };

  const sortResults = (results: TrendAnalysisResult[]) => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'strength':
          const strengthOrder = { strong: 3, moderate: 2, weak: 1 };
          return strengthOrder[b.strength as keyof typeof strengthOrder] - strengthOrder[a.strength as keyof typeof strengthOrder];
        case 'volatility':
          return b.volatility - a.volatility;
        case 'change':
          return Math.abs(b.recent_change_percent) - Math.abs(a.recent_change_percent);
        default:
          return 0;
      }
    });
  };

  const filteredResults = selectedCategory === 'all' 
    ? trendResults 
    : trendResults.filter(result => result.category === selectedCategory);

  const sortedResults = sortResults(filteredResults);

  const categories = [
    'all', 'economic', 'employment', 'inflation', 'monetary', 
    'sentiment', 'housing', 'financial', 'currency', 'commodities'
  ];

  const timeRanges = [
    { key: '1m', label: '1 Month' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' },
    { key: '1y', label: '1 Year' },
    { key: '2y', label: '2 Years' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-terminal-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            STATISTICAL TREND ANALYSIS
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => fetchTrendAnalysis()}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                timeRange === range.key
                  ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                  : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg'
              }`}
            >
              {range.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-terminal-muted" />
            <span className="font-mono text-sm text-terminal-muted">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-sm px-3 py-1 rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-terminal-muted">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-sm px-3 py-1 rounded"
            >
              <option value="strength">TREND STRENGTH</option>
              <option value="volatility">VOLATILITY</option>
              <option value="change">RECENT CHANGE</option>
            </select>
          </div>
          
          <div className="text-terminal-muted font-mono text-sm">
            {sortedResults.length} indicators analyzed
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <div className="text-terminal-muted font-mono text-xs mb-1">RISING TRENDS</div>
          <div className="text-2xl font-mono font-bold text-terminal-green">
            {trendResults.filter(r => r.trend === 'rising').length}
          </div>
        </div>
        
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <div className="text-terminal-muted font-mono text-xs mb-1">FALLING TRENDS</div>
          <div className="text-2xl font-mono font-bold text-terminal-red">
            {trendResults.filter(r => r.trend === 'falling').length}
          </div>
        </div>
        
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <div className="text-terminal-muted font-mono text-xs mb-1">STABLE TRENDS</div>
          <div className="text-2xl font-mono font-bold text-terminal-muted">
            {trendResults.filter(r => r.trend === 'stable').length}
          </div>
        </div>
        
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <div className="text-terminal-muted font-mono text-xs mb-1">STRONG TRENDS</div>
          <div className="text-2xl font-mono font-bold text-terminal-green">
            {trendResults.filter(r => r.strength === 'strong').length}
          </div>
        </div>
      </div>

      {/* Trend Analysis Results */}
      <div className="bg-terminal-surface border border-terminal-border rounded">
        <div className="p-4 border-b border-terminal-border">
          <h3 className="font-mono font-semibold text-terminal-text">
            TREND ANALYSIS RESULTS
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-terminal-bg">
              <tr>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">INDICATOR</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">CATEGORY</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">TREND</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">STRENGTH</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">R²</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">VOLATILITY</th>
                <th className="text-left p-4 font-mono text-xs text-terminal-muted">RECENT CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr key={index} className="border-b border-terminal-border hover:bg-terminal-bg/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-sm text-terminal-text font-semibold">
                      {result.indicator}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${getCategoryColor(result.category)} bg-terminal-surface border border-terminal-border`}>
                      {result.category.toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(result.trend)}
                      <span className={`font-mono text-sm ${getTrendColor(result.trend)}`}>
                        {result.trend.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`font-mono text-sm ${getStrengthColor(result.strength)}`}>
                      {result.strength.toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm text-terminal-text">
                      {result.r_squared.toFixed(3)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm text-terminal-text">
                      {result.volatility.toFixed(1)}%
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className={`font-mono text-sm ${
                      result.recent_change > 0 ? 'text-terminal-green' : 
                      result.recent_change < 0 ? 'text-terminal-red' : 
                      'text-terminal-muted'
                    }`}>
                      {result.recent_change > 0 ? '+' : ''}{result.recent_change.toFixed(2)}
                      <span className="text-xs ml-1">
                        ({result.recent_change_percent > 0 ? '+' : ''}{result.recent_change_percent.toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistical Methodology */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          STATISTICAL METHODOLOGY
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              TREND CLASSIFICATION
            </h4>
            
            <div className="space-y-2 text-xs font-mono text-terminal-muted">
              <div><strong>Rising:</strong> Positive slope with R² &gt; 0.3</div>
              <div><strong>Falling:</strong> Negative slope with R² &gt; 0.3</div>
              <div><strong>Stable:</strong> Low slope magnitude or R² &lt; 0.3</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
              STRENGTH METRICS
            </h4>
            
            <div className="space-y-2 text-xs font-mono text-terminal-muted">
              <div><strong>Strong:</strong> R² &gt; 0.7</div>
              <div><strong>Moderate:</strong> 0.3 &lt; R² ≤ 0.7</div>
              <div><strong>Weak:</strong> R² ≤ 0.3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}