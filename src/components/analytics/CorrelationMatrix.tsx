'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CorrelationData {
  factor1: string;
  factor2: string;
  correlation: number;
  pValue: number;
  significance: 'high' | 'medium' | 'low';
  relationship: 'positive' | 'negative' | 'neutral';
}

interface CorrelationMatrixProps {
  timeRange?: '1m' | '3m' | '6m' | '1y';
}

export default function CorrelationMatrix({ timeRange = '3m' }: CorrelationMatrixProps) {
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  useEffect(() => {
    fetchCorrelationData();
  }, [timeRange]);

  const fetchCorrelationData = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/correlations?range=${timeRange}`);
      // const data = await response.json();
      
      // Sample correlation data
      const sampleCorrelations: CorrelationData[] = [
        {
          factor1: 'GDP Growth',
          factor2: 'Unemployment Rate',
          correlation: -0.78,
          pValue: 0.001,
          significance: 'high',
          relationship: 'negative'
        },
        {
          factor1: 'GDP Growth',
          factor2: 'Inflation Rate',
          correlation: 0.45,
          pValue: 0.023,
          significance: 'medium',
          relationship: 'positive'
        },
        {
          factor1: 'GDP Growth',
          factor2: 'Interest Rates',
          correlation: 0.32,
          pValue: 0.087,
          significance: 'low',
          relationship: 'positive'
        },
        {
          factor1: 'GDP Growth',
          factor2: 'Market Volatility',
          correlation: -0.52,
          pValue: 0.008,
          significance: 'high',
          relationship: 'negative'
        },
        {
          factor1: 'Unemployment Rate',
          factor2: 'Inflation Rate',
          correlation: -0.34,
          pValue: 0.056,
          significance: 'low',
          relationship: 'negative'
        },
        {
          factor1: 'Unemployment Rate',
          factor2: 'Interest Rates',
          correlation: -0.41,
          pValue: 0.034,
          significance: 'medium',
          relationship: 'negative'
        },
        {
          factor1: 'Unemployment Rate',
          factor2: 'Market Volatility',
          correlation: 0.67,
          pValue: 0.002,
          significance: 'high',
          relationship: 'positive'
        },
        {
          factor1: 'Inflation Rate',
          factor2: 'Interest Rates',
          correlation: 0.73,
          pValue: 0.001,
          significance: 'high',
          relationship: 'positive'
        },
        {
          factor1: 'Inflation Rate',
          factor2: 'Market Volatility',
          correlation: 0.28,
          pValue: 0.124,
          significance: 'low',
          relationship: 'positive'
        },
        {
          factor1: 'Interest Rates',
          factor2: 'Market Volatility',
          correlation: 0.19,
          pValue: 0.203,
          significance: 'low',
          relationship: 'positive'
        }
      ];
      
      setCorrelations(sampleCorrelations);
    } catch (error) {
      console.error('Error fetching correlation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'text-terminal-red';
    if (abs >= 0.5) return 'text-terminal-orange';
    if (abs >= 0.3) return 'text-terminal-blue';
    return 'text-terminal-muted';
  };

  const getCorrelationBg = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'bg-terminal-red/10 border-terminal-red/20';
    if (abs >= 0.5) return 'bg-terminal-orange/10 border-terminal-orange/20';
    if (abs >= 0.3) return 'bg-terminal-blue/10 border-terminal-blue/20';
    return 'bg-terminal-bg border-terminal-border';
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-terminal-red" />;
      default: return <Minus className="w-4 h-4 text-terminal-muted" />;
    }
  };

  const getSignificanceLevel = (significance: string) => {
    switch (significance) {
      case 'high': return { label: 'HIGH', color: 'text-terminal-green' };
      case 'medium': return { label: 'MEDIUM', color: 'text-terminal-orange' };
      default: return { label: 'LOW', color: 'text-terminal-red' };
    }
  };

  const uniqueFactors = Array.from(
    new Set([
      ...correlations.map(c => c.factor1),
      ...correlations.map(c => c.factor2)
    ])
  );

  const filteredCorrelations = selectedFactors.length > 0
    ? correlations.filter(correlation => 
        selectedFactors.includes(correlation.factor1) || 
        selectedFactors.includes(correlation.factor2)
      )
    : correlations;

  const toggleFactorFilter = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <TrendingUp className="w-6 h-6 text-terminal-blue" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            CORRELATION MATRIX ANALYSIS
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {['1m', '3m', '6m', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => fetchCorrelationData()}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                timeRange === range
                  ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/30'
                  : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Factor Filters */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-terminal-muted">FILTER BY FACTORS:</span>
          <button
            onClick={() => setSelectedFactors([])}
            className="px-3 py-1 text-xs font-mono bg-terminal-bg border border-terminal-border rounded hover:bg-terminal-surface transition-colors"
          >
            CLEAR ALL
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {uniqueFactors.map((factor) => (
            <button
              key={factor}
              onClick={() => toggleFactorFilter(factor)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                selectedFactors.includes(factor)
                  ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/30'
                  : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
              }`}
            >
              {factor.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Correlation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCorrelations.map((correlation, index) => {
          const significance = getSignificanceLevel(correlation.significance);
          
          return (
            <div
              key={index}
              className={`p-6 rounded border ${getCorrelationBg(correlation.correlation)} hover:bg-opacity-80 transition-colors`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRelationshipIcon(correlation.relationship)}
                    <span className={`px-2 py-1 rounded text-xs font-mono ${significance.color} bg-terminal-bg border border-terminal-border`}>
                      {significance.label} SIG
                    </span>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${getCorrelationColor(correlation.correlation)}`}>
                    {correlation.correlation >= 0 ? '+' : ''}{correlation.correlation.toFixed(3)}
                  </div>
                </div>

                {/* Factor Names */}
                <div className="space-y-2">
                  <div className="font-mono font-semibold text-terminal-text text-sm">
                    {correlation.factor1.toUpperCase()}
                  </div>
                  <div className="text-terminal-muted font-mono text-xs">
                    vs
                  </div>
                  <div className="font-mono font-semibold text-terminal-text text-sm">
                    {correlation.factor2.toUpperCase()}
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">CORRELATION</div>
                    <div className={`font-mono text-lg font-bold ${getCorrelationColor(correlation.correlation)}`}>
                      {Math.abs(correlation.correlation).toFixed(3)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">P-VALUE</div>
                    <div className="font-mono text-lg font-bold text-terminal-text">
                      {correlation.pValue.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Strength Indicator */}
                <div>
                  <div className="text-terminal-muted font-mono text-xs mb-2">RELATIONSHIP STRENGTH</div>
                  <div className="w-full bg-terminal-bg rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${correlation.correlation >= 0 ? 'bg-terminal-green' : 'bg-terminal-red'}`}
                      style={{ width: `${Math.abs(correlation.correlation) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-terminal-muted mt-1">
                    <span>WEAK</span>
                    <span>STRONG</span>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-terminal-bg p-3 rounded border border-terminal-border">
                  <div className="text-terminal-muted font-mono text-xs mb-1">INTERPRETATION</div>
                  <div className="text-terminal-text font-mono text-xs">
                    {Math.abs(correlation.correlation) >= 0.7 && (
                      <span>Strong {correlation.relationship} correlation indicates these factors move closely together.</span>
                    )}
                    {Math.abs(correlation.correlation) >= 0.5 && Math.abs(correlation.correlation) < 0.7 && (
                      <span>Moderate {correlation.relationship} correlation suggests these factors are related but not tightly coupled.</span>
                    )}
                    {Math.abs(correlation.correlation) < 0.5 && (
                      <span>Weak correlation indicates limited relationship between these factors.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          CORRELATION SUMMARY
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              {correlations.filter(c => c.significance === 'high').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              HIGH SIGNIFICANCE
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-orange mb-1">
              {correlations.filter(c => c.significance === 'medium').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              MEDIUM SIGNIFICANCE
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-red mb-1">
              {correlations.filter(c => c.significance === 'low').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              LOW SIGNIFICANCE
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-text mb-1">
              {correlations.filter(c => Math.abs(c.correlation) >= 0.7).length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              STRONG CORRELATIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}