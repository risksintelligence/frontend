'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Factory, Globe, Minus } from 'lucide-react';

interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'rising' | 'falling' | 'stable';
  category: 'growth' | 'employment' | 'inflation' | 'trade';
  lastUpdated: string;
  description: string;
}

interface EconomicIntelDashboardProps {
  timeRange?: '1m' | '3m' | '6m' | '1y';
}

export default function EconomicIntelDashboard({ timeRange = '3m' }: EconomicIntelDashboardProps) {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchEconomicData();
  }, [timeRange]);

  const fetchEconomicData = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/economic?range=${timeRange}`);
      // const data = await response.json();
      
      // Sample economic indicators for demonstration
      const sampleIndicators: EconomicIndicator[] = [
        {
          id: 'gdp',
          name: 'GDP Growth Rate',
          value: 2.1,
          unit: '%',
          change: -0.3,
          changePercent: -12.5,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Quarterly GDP growth rate showing economic expansion pace'
        },
        {
          id: 'unemployment',
          name: 'Unemployment Rate',
          value: 3.7,
          unit: '%',
          change: -0.1,
          changePercent: -2.6,
          trend: 'falling',
          category: 'employment',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly unemployment rate indicating labor market health'
        },
        {
          id: 'inflation',
          name: 'Consumer Price Index',
          value: 3.2,
          unit: '%',
          change: 0.4,
          changePercent: 14.3,
          trend: 'rising',
          category: 'inflation',
          lastUpdated: new Date().toISOString(),
          description: 'Annual inflation rate measuring consumer price changes'
        },
        {
          id: 'employment',
          name: 'Nonfarm Payrolls',
          value: 199000,
          unit: 'jobs',
          change: 15000,
          changePercent: 8.2,
          trend: 'rising',
          category: 'employment',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly job creation excluding agricultural sector'
        },
        {
          id: 'manufacturing',
          name: 'Manufacturing PMI',
          value: 48.7,
          unit: 'index',
          change: -1.2,
          changePercent: -2.4,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Manufacturing activity index indicating sector health'
        },
        {
          id: 'trade-balance',
          name: 'Trade Balance',
          value: -68.9,
          unit: 'billion USD',
          change: -3.2,
          changePercent: 4.9,
          trend: 'falling',
          category: 'trade',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly trade deficit between imports and exports'
        },
        {
          id: 'consumer-spending',
          name: 'Consumer Spending',
          value: 0.7,
          unit: '% change',
          change: 0.2,
          changePercent: 40.0,
          trend: 'rising',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly personal consumption expenditure growth'
        },
        {
          id: 'housing-starts',
          name: 'Housing Starts',
          value: 1.35,
          unit: 'million units',
          change: -0.08,
          changePercent: -5.6,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Annualized housing construction activity'
        }
      ];
      
      setIndicators(sampleIndicators);
    } catch (error) {
      console.error('Error fetching economic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'growth': return DollarSign;
      case 'employment': return Users;
      case 'inflation': return TrendingUp;
      case 'trade': return Globe;
      default: return Factory;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'growth': return 'text-terminal-green';
      case 'employment': return 'text-terminal-blue';
      case 'inflation': return 'text-terminal-orange';
      case 'trade': return 'text-terminal-purple';
      default: return 'text-terminal-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-terminal-red" />;
      default: return <Minus className="w-4 h-4 text-terminal-muted" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'jobs' && value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    if (unit === 'billion USD') {
      return value.toFixed(1);
    }
    if (unit === 'million units') {
      return value.toFixed(2);
    }
    return value.toFixed(1);
  };

  const filteredIndicators = selectedCategory === 'all' 
    ? indicators 
    : indicators.filter(indicator => indicator.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Indicators', count: indicators.length },
    { key: 'growth', label: 'Economic Growth', count: indicators.filter(i => i.category === 'growth').length },
    { key: 'employment', label: 'Employment', count: indicators.filter(i => i.category === 'employment').length },
    { key: 'inflation', label: 'Inflation', count: indicators.filter(i => i.category === 'inflation').length },
    { key: 'trade', label: 'Trade', count: indicators.filter(i => i.category === 'trade').length }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-terminal-bg rounded"></div>
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
          <DollarSign className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            ECONOMIC INTELLIGENCE DASHBOARD
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {['1m', '3m', '6m', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => fetchEconomicData()}
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

      {/* Category Filters */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.key);
            const isSelected = selectedCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isSelected
                    ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-mono text-sm">{category.label}</span>
                <span className="bg-terminal-bg px-2 py-1 rounded text-xs font-mono">
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Economic Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredIndicators.map((indicator) => {
          const Icon = getCategoryIcon(indicator.category);
          const categoryColor = getCategoryColor(indicator.category);
          
          return (
            <div
              key={indicator.id}
              className="bg-terminal-surface border border-terminal-border p-4 rounded hover:bg-terminal-surface/80 transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${categoryColor}`} />
                    <span className="font-mono text-xs text-terminal-muted">
                      {indicator.category.toUpperCase()}
                    </span>
                  </div>
                  {getTrendIcon(indicator.trend)}
                </div>

                {/* Name */}
                <h3 className="font-mono font-semibold text-terminal-text text-sm">
                  {indicator.name.toUpperCase()}
                </h3>

                {/* Value */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-terminal-text">
                      {formatValue(indicator.value, indicator.unit)}
                    </span>
                    <span className="text-terminal-muted font-mono text-xs">
                      {indicator.unit}
                    </span>
                  </div>
                  
                  {/* Change */}
                  <div className={`flex items-center gap-1 text-sm font-mono ${
                    indicator.change > 0 ? 'text-terminal-green' : 
                    indicator.change < 0 ? 'text-terminal-red' : 
                    'text-terminal-muted'
                  }`}>
                    <span>
                      {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(1)}
                    </span>
                    <span>
                      ({indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-terminal-muted font-mono text-xs leading-relaxed">
                  {indicator.description}
                </p>

                {/* Last Updated */}
                <div className="text-terminal-muted font-mono text-xs">
                  Updated: {new Date(indicator.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          ECONOMIC OVERVIEW SUMMARY
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              {indicators.filter(i => i.trend === 'rising').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              RISING INDICATORS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-red mb-1">
              {indicators.filter(i => i.trend === 'falling').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              FALLING INDICATORS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-muted mb-1">
              {indicators.filter(i => i.trend === 'stable').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              STABLE INDICATORS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-text mb-1">
              {indicators.length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              TOTAL MONITORED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}