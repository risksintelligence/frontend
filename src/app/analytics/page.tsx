'use client';

import { useState } from 'react';
import { TrendingUp, Brain, DollarSign, BarChart3, Target, Network } from 'lucide-react';
import EconomicIntelDashboard from '@/components/analytics/EconomicIntelDashboard';
import PredictionDashboard from '@/components/analytics/PredictionDashboard';
import AnalyticsMetrics from '@/components/analytics/AnalyticsMetrics';

export default function AnalyticsOverview() {
  const [activeTab, setActiveTab] = useState<'economic' | 'predictions' | 'metrics'>('economic');

  const tabs = [
    {
      id: 'economic' as const,
      label: 'Economic Intelligence',
      icon: DollarSign,
      description: 'Real-time economic indicators and market data'
    },
    {
      id: 'predictions' as const,
      label: 'ML Predictions',
      icon: Brain,
      description: 'Machine learning forecasts and predictions'
    },
    {
      id: 'metrics' as const,
      label: 'Analytics Metrics',
      icon: BarChart3,
      description: 'System performance and accuracy metrics'
    }
  ];

  const quickStats = [
    {
      title: 'Economic Indicators',
      value: '8',
      subtitle: 'Active Monitors',
      icon: DollarSign,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'ML Models',
      value: '5',
      subtitle: 'Active Models',
      icon: Brain,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Forecast Accuracy',
      value: '94.2%',
      subtitle: 'Overall Accuracy',
      icon: Target,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Data Sources',
      value: '12',
      subtitle: 'Connected APIs',
      icon: Network,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-700" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              ANALYTICS & INTELLIGENCE
            </h1>
            <p className="text-slate-700 font-mono text-sm">
              Real-time analytics, forecasting, and economic intelligence
            </p>
          </div>
        </div>
        
        <div className="text-slate-500 font-mono text-sm">
          System Status: <span className="text-emerald-700">OPERATIONAL</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-500 font-mono text-xs mb-1">
                    {stat.title.toUpperCase()}
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 font-mono text-xs">
                    {stat.subtitle}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${stat.bgColor} ${stat.color.replace('text-', 'border-').replace('-700', '-200')}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 font-mono text-sm border-r border-slate-200 last:border-r-0 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'economic' && (
            <div>
              <EconomicIntelDashboard />
            </div>
          )}
          
          {activeTab === 'predictions' && (
            <div>
              <PredictionDashboard />
            </div>
          )}
          
          {activeTab === 'metrics' && (
            <div>
              <AnalyticsMetrics />
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <h3 className="font-mono font-semibold text-slate-900 mb-4">
          QUICK NAVIGATION
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/analytics/economic"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                Economic Intelligence
              </div>
              <div className="text-slate-500 font-mono text-xs">
                Real-time economic indicators
              </div>
            </div>
          </a>
          
          <a
            href="/analytics/predictions"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <Brain className="w-5 h-5 text-blue-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                Predictions & Forecasts
              </div>
              <div className="text-slate-500 font-mono text-xs">
                ML-powered forecasting
              </div>
            </div>
          </a>
          
          <a
            href="/analytics/scenarios"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <Target className="w-5 h-5 text-purple-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                Scenario Analysis
              </div>
              <div className="text-slate-500 font-mono text-xs">
                What-if modeling tools
              </div>
            </div>
          </a>
          
          <a
            href="/analytics/trends"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-amber-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                Trend Analysis
              </div>
              <div className="text-slate-500 font-mono text-xs">
                Statistical trend analysis
              </div>
            </div>
          </a>
          
          <a
            href="/analytics/correlations"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <Network className="w-5 h-5 text-cyan-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                Correlations
              </div>
              <div className="text-slate-500 font-mono text-xs">
                Factor correlation analysis
              </div>
            </div>
          </a>
          
          <a
            href="/analytics/metrics"
            className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-pink-700" />
            <div>
              <div className="font-mono font-semibold text-slate-900 text-sm">
                System Metrics
              </div>
              <div className="text-slate-500 font-mono text-xs">
                Performance monitoring
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}