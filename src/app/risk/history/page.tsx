'use client';

import RiskTrends from '@/components/risk/RiskTrends';
import RiskScoreDisplay from '@/components/risk/RiskScoreDisplay';
import ShapExplanation from '@/components/risk/ShapExplanation';
import { Calendar, Download, Filter, Brain, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useRiskOverview } from '@/hooks/useRiskOverview';

export default function RiskHistoryPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'economic' | 'market' | 'geopolitical' | 'technical'>('overall');
  const { riskData, loading, error } = useRiskOverview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-text">
          RISK HISTORY & TRENDS
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors">
            <Download className="w-4 h-4" />
            EXPORT DATA
          </button>
          
          <div className="text-terminal-muted font-mono text-sm">
            Historical risk analysis
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center gap-4">
          <Calendar className="w-4 h-4 text-terminal-muted" />
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-terminal-muted">TIME RANGE:</span>
            <div className="flex gap-1">
              {[
                { key: '7d', label: '7 Days' },
                { key: '30d', label: '30 Days' },
                { key: '90d', label: '90 Days' },
                { key: '1y', label: '1 Year' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setSelectedTimeRange(range.key as any)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    selectedTimeRange === range.key
                      ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg'
                  }`}
                >
                  {range.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-terminal-muted">METRIC:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs px-3 py-1 rounded"
            >
              <option value="overall">Overall Risk</option>
              <option value="economic">Economic Risk</option>
              <option value="market">Market Risk</option>
              <option value="geopolitical">Geopolitical Risk</option>
              <option value="technical">Technical Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <RiskScoreDisplay
            score={riskData?.overall_score || 0}
            trend={riskData?.trend || "stable"}
            confidence={riskData?.confidence || 0}
            size="lg"
            showDetails={true}
          />
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
            <h3 className="font-mono font-semibold text-terminal-text mb-3">
              RISK SCORE SUMMARY
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-terminal-muted font-mono text-xs mb-1">30-DAY HIGH</div>
                <div className="text-xl font-mono font-bold text-terminal-red">82.3</div>
              </div>
              
              <div>
                <div className="text-terminal-muted font-mono text-xs mb-1">30-DAY LOW</div>
                <div className="text-xl font-mono font-bold text-terminal-green">68.1</div>
              </div>
              
              <div>
                <div className="text-terminal-muted font-mono text-xs mb-1">AVERAGE</div>
                <div className="text-xl font-mono font-bold text-terminal-text">74.8</div>
              </div>
              
              <div>
                <div className="text-terminal-muted font-mono text-xs mb-1">VOLATILITY</div>
                <div className="text-xl font-mono font-bold text-terminal-text">4.2%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
            <h3 className="font-mono font-semibold text-terminal-text mb-3">
              KEY RISK EVENTS
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-terminal-red rounded-full mt-2"></div>
                <div>
                  <div className="font-mono text-sm text-terminal-text">Inflation Spike (Day -5)</div>
                  <div className="font-mono text-xs text-terminal-muted">Risk score increased to 82.3</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-terminal-orange rounded-full mt-2"></div>
                <div>
                  <div className="font-mono text-sm text-terminal-text">Market Volatility (Day -12)</div>
                  <div className="font-mono text-xs text-terminal-muted">VIX surge led to risk elevation</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-terminal-green rounded-full mt-2"></div>
                <div>
                  <div className="font-mono text-sm text-terminal-text">Policy Clarity (Day -18)</div>
                  <div className="font-mono text-xs text-terminal-muted">Risk score decreased to 68.1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trends Chart */}
      <RiskTrends 
        timeRange={selectedTimeRange} 
        showComponents={true} 
      />

      {/* SHAP Feature Importance Over Time */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 text-terminal-green" />
          <h3 className="font-mono font-semibold text-terminal-text">
            FEATURE IMPORTANCE TRENDS (SHAP)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-4">
              CURRENT RISK EXPLANATION
            </h4>
            <ShapExplanation 
              riskScore={riskData?.overall_score || 0}
              predictionId="current-risk"
              showDetails={true}
              className="w-full"
            />
          </div>
          
          <div>
            <h4 className="font-mono font-semibold text-terminal-text text-sm mb-4">
              FEATURE IMPORTANCE CHANGES
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-terminal-bg rounded border border-terminal-border">
                <span className="font-mono text-sm text-terminal-text">Unemployment Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-terminal-red">+15%</span>
                  <BarChart3 className="w-3 h-3 text-terminal-red" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-terminal-bg rounded border border-terminal-border">
                <span className="font-mono text-sm text-terminal-text">Inflation Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-terminal-red">+8%</span>
                  <BarChart3 className="w-3 h-3 text-terminal-red" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-terminal-bg rounded border border-terminal-border">
                <span className="font-mono text-sm text-terminal-text">Market Volatility</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-terminal-green">-5%</span>
                  <BarChart3 className="w-3 h-3 text-terminal-green" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-terminal-bg rounded border border-terminal-border">
                <span className="font-mono text-sm text-terminal-text">Interest Rates</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-terminal-green">-12%</span>
                  <BarChart3 className="w-3 h-3 text-terminal-green" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-terminal-bg border border-terminal-border rounded">
              <p className="text-xs font-mono text-terminal-muted">
                Feature importance changes compared to {selectedTimeRange === '7d' ? '7 days' : selectedTimeRange === '30d' ? '30 days' : selectedTimeRange === '90d' ? '90 days' : '1 year'} ago.
                Red indicates increased importance, green indicates decreased importance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <h3 className="font-mono font-semibold text-terminal-text mb-4">
            RISK DISTRIBUTION (30 DAYS)
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Critical (80-100)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-terminal-bg rounded-full h-2">
                  <div className="bg-terminal-red h-2 rounded-full w-1/6"></div>
                </div>
                <span className="font-mono text-xs text-terminal-muted">3 days</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">High (60-80)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-terminal-bg rounded-full h-2">
                  <div className="bg-terminal-orange h-2 rounded-full w-3/4"></div>
                </div>
                <span className="font-mono text-xs text-terminal-muted">22 days</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Moderate (40-60)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-terminal-bg rounded-full h-2">
                  <div className="bg-terminal-yellow h-2 rounded-full w-1/6"></div>
                </div>
                <span className="font-mono text-xs text-terminal-muted">5 days</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Low (20-40)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-terminal-bg rounded-full h-2">
                  <div className="bg-terminal-green h-2 rounded-full w-0"></div>
                </div>
                <span className="font-mono text-xs text-terminal-muted">0 days</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <h3 className="font-mono font-semibold text-terminal-text mb-4">
            CORRELATION ANALYSIS
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Economic vs Market</span>
              <span className="font-mono text-sm text-terminal-green">+0.78</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Market vs Geopolitical</span>
              <span className="font-mono text-sm text-terminal-orange">+0.45</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Economic vs Technical</span>
              <span className="font-mono text-sm text-terminal-muted">+0.12</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-terminal-text">Geopolitical vs Technical</span>
              <span className="font-mono text-sm text-terminal-red">-0.23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}