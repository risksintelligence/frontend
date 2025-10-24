'use client';

import { useState, useEffect, useCallback } from 'react';
import { Grid, Info, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskHeatmapData {
  category: string;
  subcategory: string;
  riskScore: number;
  change: number;
  volatility: number;
  confidence: number;
  lastUpdated: string;
}

interface RiskHeatmapProps {
  timeRange?: '1d' | '7d' | '30d';
  showLegend?: boolean;
}

export default function RiskHeatmap({ timeRange = '1d', showLegend = true }: RiskHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<RiskHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<RiskHeatmapData | null>(null);

  const fetchHeatmapData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch from real API
      const response = await fetch(`/api/v1/risk/heatmap?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setHeatmapData(data.heatmap || []);
        return;
      }
      
      // No fallback data - require API connection
      setHeatmapData([]);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'bg-terminal-red';
    if (riskScore >= 70) return 'bg-red-500';
    if (riskScore >= 60) return 'bg-terminal-orange';
    if (riskScore >= 50) return 'bg-orange-400';
    if (riskScore >= 40) return 'bg-yellow-500';
    if (riskScore >= 30) return 'bg-terminal-yellow';
    if (riskScore >= 20) return 'bg-green-400';
    return 'bg-terminal-green';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 80) return 'CRITICAL';
    if (riskScore >= 60) return 'HIGH';
    if (riskScore >= 40) return 'MODERATE';
    if (riskScore >= 20) return 'LOW';
    return 'MINIMAL';
  };

  const getTextColor = (riskScore: number) => {
    return riskScore >= 40 ? 'text-white' : 'text-terminal-bg';
  };

  const groupedData = heatmapData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RiskHeatmapData[]>);

  if (loading) {
    return (
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="animate-pulse">
          <div className="h-4 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
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
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Grid className="w-6 h-6 text-terminal-green" />
            <h2 className="text-xl font-mono font-semibold text-terminal-text">
              RISK HEATMAP
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {['1d', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => fetchHeatmapData()}
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
      </div>

      {/* Heatmap Grid */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="space-y-6">
          {Object.entries(groupedData).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-mono font-semibold text-terminal-text text-sm">
                {category.toUpperCase()}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`relative p-3 rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 ${getRiskColor(item.riskScore)} ${getTextColor(item.riskScore)}`}
                    onClick={() => setSelectedCell(item)}
                    title={`${item.subcategory}: ${item.riskScore.toFixed(1)}`}
                  >
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-semibold">
                        {item.subcategory.toUpperCase()}
                      </div>
                      
                      <div className="font-mono text-lg font-bold">
                        {item.riskScore.toFixed(0)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">
                          {getRiskLevel(item.riskScore)}
                        </span>
                        
                        <div className="flex items-center">
                          {item.change > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : item.change < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3"></div>
                          )}
                          <span className="font-mono text-xs ml-1">
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <h3 className="font-mono font-semibold text-terminal-text mb-4">
            SELECTED: {selectedCell.category.toUpperCase()} - {selectedCell.subcategory.toUpperCase()}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-terminal-muted font-mono text-xs mb-1">RISK SCORE</div>
              <div className="text-2xl font-mono font-bold text-terminal-text">
                {selectedCell.riskScore.toFixed(1)}
              </div>
              <div className={`font-mono text-xs ${
                selectedCell.riskScore >= 60 ? 'text-terminal-red' : 
                selectedCell.riskScore >= 40 ? 'text-terminal-orange' : 
                'text-terminal-green'
              }`}>
                {getRiskLevel(selectedCell.riskScore)}
              </div>
            </div>
            
            <div>
              <div className="text-terminal-muted font-mono text-xs mb-1">CHANGE</div>
              <div className={`text-2xl font-mono font-bold ${
                selectedCell.change > 0 ? 'text-terminal-red' : 
                selectedCell.change < 0 ? 'text-terminal-green' : 
                'text-terminal-muted'
              }`}>
                {selectedCell.change > 0 ? '+' : ''}{selectedCell.change.toFixed(1)}
              </div>
              <div className="text-terminal-muted font-mono text-xs">
                vs Previous Period
              </div>
            </div>
            
            <div>
              <div className="text-terminal-muted font-mono text-xs mb-1">VOLATILITY</div>
              <div className="text-2xl font-mono font-bold text-terminal-text">
                {selectedCell.volatility.toFixed(1)}%
              </div>
              <div className="text-terminal-muted font-mono text-xs">
                Standard Deviation
              </div>
            </div>
            
            <div>
              <div className="text-terminal-muted font-mono text-xs mb-1">CONFIDENCE</div>
              <div className="text-2xl font-mono font-bold text-terminal-text">
                {(selectedCell.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-terminal-muted font-mono text-xs">
                Model Confidence
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedCell(null)}
            className="mt-4 px-4 py-2 bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-sm rounded hover:bg-terminal-border/10 transition-colors"
          >
            CLOSE DETAILS
          </button>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-terminal-muted" />
            <h3 className="font-mono font-semibold text-terminal-text text-sm">
              RISK LEVEL LEGEND
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { level: 'MINIMAL', range: '0-20', color: 'bg-terminal-green' },
              { level: 'LOW', range: '20-40', color: 'bg-green-400' },
              { level: 'MODERATE', range: '40-60', color: 'bg-terminal-orange' },
              { level: 'HIGH', range: '60-80', color: 'bg-red-500' },
              { level: 'CRITICAL', range: '80-100', color: 'bg-terminal-red' }
            ].map((item) => (
              <div key={item.level} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <div>
                  <div className="font-mono text-xs font-semibold text-terminal-text">
                    {item.level}
                  </div>
                  <div className="font-mono text-xs text-terminal-muted">
                    {item.range}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}