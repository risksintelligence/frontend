'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus, Users, Building, Globe } from 'lucide-react';

interface IndicatorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'rising' | 'falling' | 'stable';
  category: 'growth' | 'employment' | 'inflation' | 'trade' | 'housing' | 'consumer';
  lastUpdated: string;
  description: string;
  target?: number;
  targetType?: 'above' | 'below' | 'range';
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
      // In production, fetch from API
      // const response = await fetch('/api/v1/analytics/economic-indicators');
      // const data = await response.json();
      
      // Sample economic indicators
      const sampleIndicators: IndicatorData[] = [
        {
          id: 'gdp-growth',
          name: 'GDP Growth Rate',
          value: 2.1,
          unit: '%',
          change: -0.3,
          changePercent: -12.5,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Quarterly GDP growth rate (annualized)',
          target: 2.5,
          targetType: 'above'
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
          description: 'Monthly unemployment rate',
          target: 4.0,
          targetType: 'below'
        },
        {
          id: 'inflation',
          name: 'Consumer Price Index',
          value: 3.2,
          unit: '% YoY',
          change: 0.4,
          changePercent: 14.3,
          trend: 'rising',
          category: 'inflation',
          lastUpdated: new Date().toISOString(),
          description: 'Annual inflation rate',
          target: 2.0,
          targetType: 'range'
        },
        {
          id: 'payrolls',
          name: 'Nonfarm Payrolls',
          value: 199,
          unit: 'K jobs',
          change: 15,
          changePercent: 8.2,
          trend: 'rising',
          category: 'employment',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly job creation (thousands)',
          target: 200,
          targetType: 'above'
        },
        {
          id: 'manufacturing-pmi',
          name: 'Manufacturing PMI',
          value: 48.7,
          unit: 'index',
          change: -1.2,
          changePercent: -2.4,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Manufacturing activity index',
          target: 50.0,
          targetType: 'above'
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
          description: 'Monthly trade deficit',
          target: -60.0,
          targetType: 'above'
        },
        {
          id: 'consumer-spending',
          name: 'Consumer Spending',
          value: 0.7,
          unit: '% MoM',
          change: 0.2,
          changePercent: 40.0,
          trend: 'rising',
          category: 'consumer',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly personal consumption expenditure growth',
          target: 0.5,
          targetType: 'above'
        },
        {
          id: 'housing-starts',
          name: 'Housing Starts',
          value: 1.35,
          unit: 'million units',
          change: -0.08,
          changePercent: -5.6,
          trend: 'falling',
          category: 'housing',
          lastUpdated: new Date().toISOString(),
          description: 'Annualized housing construction activity',
          target: 1.5,
          targetType: 'above'
        },
        {
          id: 'retail-sales',
          name: 'Retail Sales',
          value: 0.3,
          unit: '% MoM',
          change: -0.2,
          changePercent: -40.0,
          trend: 'falling',
          category: 'consumer',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly retail sales growth',
          target: 0.4,
          targetType: 'above'
        },
        {
          id: 'industrial-production',
          name: 'Industrial Production',
          value: 0.2,
          unit: '% MoM',
          change: 0.1,
          changePercent: 100.0,
          trend: 'rising',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly industrial output growth',
          target: 0.3,
          targetType: 'above'
        }
      ];
      
      setIndicators(sampleIndicators);
    } catch (error) {
      console.error('Error fetching indicators:', error);
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
      case 'housing': return Building;
      case 'consumer': return Users;
      default: return DollarSign;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'growth': return 'text-terminal-green';
      case 'employment': return 'text-terminal-blue';
      case 'inflation': return 'text-terminal-orange';
      case 'trade': return 'text-terminal-purple';
      case 'housing': return 'text-terminal-cyan';
      case 'consumer': return 'text-terminal-pink';
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

  const getTargetStatus = (indicator: IndicatorData) => {
    if (!indicator.target || !indicator.targetType) return null;

    const { value, target, targetType } = indicator;
    let isOnTarget = false;
    let status = '';

    switch (targetType) {
      case 'above':
        isOnTarget = value >= target;
        status = isOnTarget ? 'ABOVE TARGET' : 'BELOW TARGET';
        break;
      case 'below':
        isOnTarget = value <= target;
        status = isOnTarget ? 'BELOW TARGET' : 'ABOVE TARGET';
        break;
      case 'range':
        const range = target * 0.5; // ±50% of target
        isOnTarget = Math.abs(value - target) <= range;
        status = isOnTarget ? 'IN RANGE' : 'OUT OF RANGE';
        break;
    }

    return {
      isOnTarget,
      status,
      color: isOnTarget ? 'text-terminal-green' : 'text-terminal-red'
    };
  };

  const formatValue = (value: number, unit: string) => {
    if (unit.includes('K')) {
      return value.toFixed(0);
    }
    if (unit.includes('billion') || unit.includes('million')) {
      return value.toFixed(1);
    }
    return value.toFixed(1);
  };

  const categories = [
    { key: 'all', label: 'All Indicators', count: indicators.length },
    { key: 'growth', label: 'Economic Growth', count: indicators.filter(i => i.category === 'growth').length },
    { key: 'employment', label: 'Employment', count: indicators.filter(i => i.category === 'employment').length },
    { key: 'inflation', label: 'Inflation', count: indicators.filter(i => i.category === 'inflation').length },
    { key: 'trade', label: 'Trade', count: indicators.filter(i => i.category === 'trade').length },
    { key: 'housing', label: 'Housing', count: indicators.filter(i => i.category === 'housing').length },
    { key: 'consumer', label: 'Consumer', count: indicators.filter(i => i.category === 'consumer').length }
  ];

  const filteredIndicators = selectedCategory === 'all' 
    ? indicators 
    : indicators.filter(indicator => indicator.category === selectedCategory);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 bg-terminal-bg rounded"></div>
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
            ECONOMIC INDICATORS MONITOR
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            className="px-3 py-1 text-xs font-mono rounded bg-terminal-bg border border-terminal-border hover:bg-terminal-surface transition-colors"
          >
            {layout === 'grid' ? 'LIST VIEW' : 'GRID VIEW'}
          </button>
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

      {/* Indicators Display */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndicators.map((indicator) => {
            const Icon = getCategoryIcon(indicator.category);
            const categoryColor = getCategoryColor(indicator.category);
            const targetStatus = getTargetStatus(indicator);
            
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
                        {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)}
                      </span>
                      <span>
                        ({indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Target Status */}
                  {targetStatus && (
                    <div className="flex items-center justify-between">
                      <span className="text-terminal-muted font-mono text-xs">TARGET STATUS</span>
                      <span className={`font-mono text-xs ${targetStatus.color}`}>
                        {targetStatus.status}
                      </span>
                    </div>
                  )}

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
      ) : (
        <div className="space-y-2">
          {filteredIndicators.map((indicator) => {
            const Icon = getCategoryIcon(indicator.category);
            const categoryColor = getCategoryColor(indicator.category);
            const targetStatus = getTargetStatus(indicator);
            
            return (
              <div
                key={indicator.id}
                className="bg-terminal-surface border border-terminal-border p-4 rounded hover:bg-terminal-surface/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${categoryColor}`} />
                    <div>
                      <div className="font-mono font-semibold text-terminal-text text-sm">
                        {indicator.name.toUpperCase()}
                      </div>
                      <div className="text-terminal-muted font-mono text-xs">
                        {indicator.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-mono font-bold text-terminal-text">
                          {formatValue(indicator.value, indicator.unit)}
                        </span>
                        <span className="text-terminal-muted font-mono text-xs">
                          {indicator.unit}
                        </span>
                      </div>
                      <div className={`text-sm font-mono ${
                        indicator.change > 0 ? 'text-terminal-green' : 
                        indicator.change < 0 ? 'text-terminal-red' : 
                        'text-terminal-muted'
                      }`}>
                        {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)} ({indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%)
                      </div>
                    </div>
                    
                    {targetStatus && (
                      <div className="text-right">
                        <div className="text-terminal-muted font-mono text-xs">TARGET</div>
                        <div className={`font-mono text-xs ${targetStatus.color}`}>
                          {targetStatus.status}
                        </div>
                      </div>
                    )}
                    
                    {getTrendIcon(indicator.trend)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          INDICATORS SUMMARY
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              {indicators.filter(i => i.trend === 'rising').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              RISING
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-red mb-1">
              {indicators.filter(i => i.trend === 'falling').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              FALLING
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-muted mb-1">
              {indicators.filter(i => i.trend === 'stable').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              STABLE
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-text mb-1">
              {indicators.length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              TOTAL TRACKED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}