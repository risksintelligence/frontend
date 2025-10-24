'use client';

import { useState, useEffect } from 'react';
import RiskFactorCard from '@/components/risk/RiskFactorCard';
import RiskHeatmap from '@/components/risk/RiskHeatmap';
import { Shield, TrendingUp, AlertTriangle, Activity, Zap, BarChart3 } from 'lucide-react';

interface RiskFactor {
  name: string;
  score: number;
  impact: 'low' | 'moderate' | 'high';
  trend: 'rising' | 'falling' | 'stable';
  description: string;
}

export default function RiskFactorsPage() {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'heatmap'>('cards');

  useEffect(() => {
    fetchRiskFactors();
  }, []);

  const fetchRiskFactors = async () => {
    try {
      setLoading(true);
      // fetch from API
      // const response = await fetch('/api/v1/risk/factors');
      // const data = await response.json();
      
      // Load real risk factors from API
      const response = await fetch('/api/v1/risk/factors');
      if (!response.ok) {
        throw new Error('Failed to fetch risk factors');
      }
      
      const data = await response.json();
      const realFactors: RiskFactor[] = data.factors || [];
      
      setRiskFactors(realFactors);
    } catch (error) {
      console.error('Error fetching risk factors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFactorIcon = (name: string) => {
    if (name.toLowerCase().includes('gdp') || name.toLowerCase().includes('growth')) {
      return TrendingUp;
    }
    if (name.toLowerCase().includes('unemployment') || name.toLowerCase().includes('employment')) {
      return Activity;
    }
    if (name.toLowerCase().includes('inflation') || name.toLowerCase().includes('price')) {
      return AlertTriangle;
    }
    if (name.toLowerCase().includes('market') || name.toLowerCase().includes('volatility')) {
      return BarChart3;
    }
    if (name.toLowerCase().includes('political') || name.toLowerCase().includes('regulatory')) {
      return Shield;
    }
    return Zap;
  };

  const categorizedFactors = {
    'Economic Indicators': riskFactors.filter(factor => 
      factor.name.toLowerCase().includes('gdp') || 
      factor.name.toLowerCase().includes('unemployment') || 
      factor.name.toLowerCase().includes('inflation')
    ),
    'Market Conditions': riskFactors.filter(factor => 
      factor.name.toLowerCase().includes('market') || 
      factor.name.toLowerCase().includes('credit') || 
      factor.name.toLowerCase().includes('currency')
    ),
    'Geopolitical Factors': riskFactors.filter(factor => 
      factor.name.toLowerCase().includes('political') || 
      factor.name.toLowerCase().includes('trade') || 
      factor.name.toLowerCase().includes('regulatory')
    ),
    'Operational Risks': riskFactors.filter(factor => 
      factor.name.toLowerCase().includes('supply') || 
      factor.name.toLowerCase().includes('energy') || 
      factor.name.toLowerCase().includes('technology')
    )
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-white min-h-screen">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-1/6 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-slate-900">
          RISK FACTORS ANALYSIS
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm font-mono rounded transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CARDS
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1 text-sm font-mono rounded transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              HEATMAP
            </button>
          </div>
          
          <div className="text-slate-500 font-mono text-sm">
            {riskFactors.length} factors monitored
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 font-mono text-xs mb-1">HIGH RISK</div>
          <div className="text-2xl font-mono font-bold text-red-700">
            {riskFactors.filter(f => f.score >= 70).length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 font-mono text-xs mb-1">MODERATE RISK</div>
          <div className="text-2xl font-mono font-bold text-amber-700">
            {riskFactors.filter(f => f.score >= 40 && f.score < 70).length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 font-mono text-xs mb-1">LOW RISK</div>
          <div className="text-2xl font-mono font-bold text-emerald-700">
            {riskFactors.filter(f => f.score < 40).length}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="text-slate-500 font-mono text-xs mb-1">RISING TRENDS</div>
          <div className="text-2xl font-mono font-bold text-red-700">
            {riskFactors.filter(f => f.trend === 'rising').length}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {Object.entries(categorizedFactors).map(([category, factors]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-mono font-semibold text-slate-900 border-b border-slate-200 pb-2">
                {category.toUpperCase()}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {factors.map((factor, index) => (
                  <RiskFactorCard
                    key={`${category}-${index}`}
                    factor={factor}
                    icon={getFactorIcon(factor.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RiskHeatmap timeRange="1d" showLegend={true} />
      )}
    </div>
  );
}