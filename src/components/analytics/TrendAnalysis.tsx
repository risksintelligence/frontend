'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart, Filter } from 'lucide-react';


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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/analytics/trends?range=${timeRange}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        setTrendResults(data.data.trends || []);
      } else {
        throw new Error('Trend analysis data not available from backend');
      }
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      setTrendResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-700" />;
      default: return <Minus className="w-4 h-4 text-slate-500" />;
    }
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
          <div className="h-6 bg-white rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded border border-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (trendResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Trend Analysis Data Available</h3>
          <p>Backend API must be fully functional to display statistical trend analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-semibold text-slate-900">
            Statistical Trend Analysis
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => fetchTrendAnalysis()}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                timeRange === range.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-sm px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 text-slate-900 text-sm px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="strength">Trend Strength</option>
              <option value="volatility">Volatility</option>
              <option value="change">Recent Change</option>
            </select>
          </div>
          
          <div className="text-slate-500 text-sm">
            {sortedResults.length} indicators analyzed
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 text-xs mb-1">RISING TRENDS</div>
          <div className="text-2xl font-semibold text-emerald-700">
            {trendResults.filter(r => r.trend === 'rising').length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 text-xs mb-1">FALLING TRENDS</div>
          <div className="text-2xl font-semibold text-red-700">
            {trendResults.filter(r => r.trend === 'falling').length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 text-xs mb-1">STABLE TRENDS</div>
          <div className="text-2xl font-semibold text-slate-500">
            {trendResults.filter(r => r.trend === 'stable').length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 text-xs mb-1">STRONG TRENDS</div>
          <div className="text-2xl font-semibold text-emerald-700">
            {trendResults.filter(r => r.strength === 'strong').length}
          </div>
        </div>
      </div>

      {/* Trend Analysis Results */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            Trend Analysis Results
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Indicator</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Trend</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Strength</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">R²</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Volatility</th>
                <th className="text-left p-4 text-xs text-slate-500 uppercase tracking-wider">Recent Change</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="text-sm text-slate-900 font-semibold">
                      {result.indicator}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                      {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(result.trend)}
                      <span className={`text-sm ${
                        result.trend === 'rising' ? 'text-emerald-700' : 
                        result.trend === 'falling' ? 'text-red-700' : 
                        'text-slate-500'
                      }`}>
                        {result.trend.charAt(0).toUpperCase() + result.trend.slice(1)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`text-sm ${
                      result.strength === 'strong' ? 'text-emerald-700' : 
                      result.strength === 'moderate' ? 'text-amber-700' : 
                      'text-slate-500'
                    }`}>
                      {result.strength.charAt(0).toUpperCase() + result.strength.slice(1)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-900">
                      {result.r_squared.toFixed(3)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-900">
                      {result.volatility.toFixed(1)}%
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className={`font-mono text-sm ${
                      result.recent_change > 0 ? 'text-emerald-700' : 
                      result.recent_change < 0 ? 'text-red-700' : 
                      'text-slate-500'
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
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">
          Statistical Methodology
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">
              Trend Classification
            </h4>
            
            <div className="space-y-2 text-xs text-slate-500">
              <div><strong>Rising:</strong> Positive slope with R² &gt; 0.3</div>
              <div><strong>Falling:</strong> Negative slope with R² &gt; 0.3</div>
              <div><strong>Stable:</strong> Low slope magnitude or R² &lt; 0.3</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">
              Strength Metrics
            </h4>
            
            <div className="space-y-2 text-xs text-slate-500">
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