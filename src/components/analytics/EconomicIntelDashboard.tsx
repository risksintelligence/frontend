'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Factory, Globe, Minus, Plus } from 'lucide-react';

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
      
      // Load real economic indicators from API
      const response = await fetch(`/api/v1/analytics/economic?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch economic indicators');
      }
      
      const data = await response.json();
      const realIndicators: EconomicIndicator[] = data.indicators || [];
      
      setIndicators(realIndicators);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-slate-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-terminal-green" />
            <h2 className="text-xl font-mono font-semibold text-terminal-text">
              ECONOMIC INTELLIGENCE MONITOR
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-sm rounded px-3 py-1">
              {timeRange === '1m' ? '1 Month' : 
               timeRange === '3m' ? '3 Months' : 
               timeRange === '6m' ? '6 Months' : '1 Year'}
            </span>
            
            <button
              onClick={fetchEconomicData}
              className="px-3 py-1 bg-terminal-green text-terminal-bg font-mono text-sm rounded hover:bg-terminal-green/80 transition-colors"
            >
              REFRESH
            </button>
          </div>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          DETAILED INDICATORS MONITOR
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {indicators.map((indicator) => {
          const Icon = getCategoryIcon(indicator.category);
          const isPositive = indicator.change > 0;
          
          return (
            <div
              key={indicator.id}
              className="bg-terminal-surface border border-terminal-border p-4 rounded hover:bg-terminal-bg/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-terminal-green" />
                  <span className="font-mono text-xs text-terminal-muted uppercase tracking-wide">
                    {indicator.category}
                  </span>
                </div>
                
                <div className={`flex items-center gap-1 ${
                  indicator.trend === 'rising' ? 'text-red-400' :
                  indicator.trend === 'falling' ? 'text-green-400' : 'text-terminal-muted'
                }`}>
                  {indicator.trend === 'rising' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : indicator.trend === 'falling' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                </div>
              </div>
              
              {/* Main Value */}
              <div className="mb-2">
                <h3 className="font-mono font-semibold text-terminal-text text-sm mb-1 line-clamp-2">
                  {indicator.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-terminal-text">
                    {indicator.value.toLocaleString()}
                  </span>
                  <span className="text-sm font-mono text-terminal-muted">
                    {indicator.unit}
                  </span>
                </div>
              </div>
              
              {/* Change */}
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-1 font-mono text-sm ${
                  isPositive ? 'text-red-400' : 'text-green-400'
                }`}>
                  {isPositive ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  <span>
                    {Math.abs(indicator.change).toFixed(2)} ({Math.abs(indicator.changePercent).toFixed(1)}%)
                  </span>
                </div>
                
                <span className="text-xs font-mono text-terminal-muted">
                  vs prev
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-terminal-bg rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      indicator.trend === 'rising' ? 'bg-red-400' :
                      indicator.trend === 'falling' ? 'bg-green-400' : 'bg-terminal-muted'
                    }`}
                    style={{ width: `${Math.min(Math.abs(indicator.changePercent), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-xs font-mono text-terminal-muted leading-relaxed line-clamp-2">
                {indicator.description}
              </p>
              
              {/* Timestamp */}
              <div className="mt-3 pt-2 border-t border-terminal-border">
                <span className="text-xs font-mono text-terminal-muted">
                  Updated: {new Date(indicator.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
