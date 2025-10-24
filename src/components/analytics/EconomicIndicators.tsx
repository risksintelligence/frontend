'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, DollarSign, Percent } from 'lucide-react';

interface IndicatorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'rising' | 'falling' | 'stable';
  category: 'economic' | 'employment' | 'inflation' | 'growth';
  lastUpdated: string;
  description: string;
}

interface EconomicIndicatorsProps {
  category?: string;
  layout?: 'grid' | 'list';
}

export default function EconomicIndicators({ category = 'all', layout: initialLayout = 'grid' }: EconomicIndicatorsProps) {
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [layout, setLayout] = useState<'grid' | 'list'>(initialLayout);

  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      // Fetch REAL data from working API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/economic/indicators`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Transform real API data into component format
        const realIndicators: IndicatorData[] = Object.entries(data.data).map(([key, indicator]: [string, any]) => ({
          id: key,
          name: indicator.title || key.replace('_', ' ').toUpperCase(),
          value: indicator.value,
          unit: indicator.units || '',
          change: 0,
          changePercent: 0,
          trend: 'stable' as const,
          category: 'economic' as const,
          description: indicator.title || '',
          lastUpdated: indicator.last_updated || new Date().toISOString()
        }));
        
        setIndicators(realIndicators);
      } else {
        throw new Error('No economic data available from backend');
      }
    } catch (error) {
      console.error('Error fetching economic indicators:', error);
      setIndicators([]);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-700" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getValueColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-emerald-700';
      case 'falling':
        return 'text-red-700';
      default:
        return 'text-slate-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'growth':
        return <TrendingUp className="w-5 h-5 text-blue-700" />;
      case 'employment':
        return <Activity className="w-5 h-5 text-purple-700" />;
      case 'inflation':
        return <Percent className="w-5 h-5 text-amber-700" />;
      default:
        return <DollarSign className="w-5 h-5 text-slate-700" />;
    }
  };

  const filteredIndicators = selectedCategory === 'all' 
    ? indicators 
    : indicators.filter(indicator => indicator.category === selectedCategory);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Economic Data Available</h3>
          <p>Backend API must be fully functional to display real economic indicators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Economic Indicators</h2>
          <p className="text-sm text-slate-500">Real-time economic data from government sources</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="economic">Economic</option>
            <option value="employment">Employment</option>
            <option value="inflation">Inflation</option>
            <option value="growth">Growth</option>
          </select>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayout('grid')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                layout === 'grid'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                layout === 'list'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              LIST
            </button>
          </div>
        </div>
      </div>

      {/* Indicators Display */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndicators.map((indicator) => (
            <div key={indicator.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(indicator.category)}
                  <h3 className="font-medium text-slate-900 text-sm">{indicator.name}</h3>
                </div>
                {getTrendIcon(indicator.trend)}
              </div>
              
              <div className="space-y-2">
                <div className={`text-2xl font-bold font-mono ${getValueColor(indicator.trend)}`}>
                  {typeof indicator.value === 'number' ? indicator.value.toLocaleString() : indicator.value}
                  <span className="text-xs font-normal text-slate-500 ml-1">{indicator.unit}</span>
                </div>
                
                <div className="text-xs text-slate-500">
                  Updated: {new Date(indicator.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Indicator</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Trend</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredIndicators.map((indicator) => (
                  <tr key={indicator.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(indicator.category)}
                        <span className="font-medium text-slate-900">{indicator.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-mono font-semibold ${getValueColor(indicator.trend)}`}>
                        {typeof indicator.value === 'number' ? indicator.value.toLocaleString() : indicator.value}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{indicator.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getTrendIcon(indicator.trend)}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500">
                      {new Date(indicator.lastUpdated).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}