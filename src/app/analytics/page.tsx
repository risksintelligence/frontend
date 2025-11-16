'use client';

import Link from 'next/link';
import { TrendingUp, BarChart3, Target, Activity } from 'lucide-react';

const analyticsModules = [
  {
    title: 'GERI HISTORY',
    href: '/analytics/history',
    description: 'Historical GERI scores, trends, and notable crisis events',
    icon: TrendingUp,
    features: ['Time series analysis', 'Crisis event markers', 'Regime transitions']
  },
  {
    title: 'COMPONENT ANALYSIS',
    href: '/analytics/components',
    description: 'Individual component breakdowns and risk contributions',
    icon: BarChart3,
    features: ['Z-score analysis', 'Component correlations', 'Provider attribution']
  },
  {
    title: 'REGIME DETECTION',
    href: '/analytics/regimes',
    description: 'Economic regime classification and transition analysis',
    icon: Target,
    features: ['Regime probabilities', 'Transition matrices', 'Historical patterns']
  },
  {
    title: 'FORECASTING',
    href: '/analytics/forecasts',
    description: 'Prediction models, accuracy metrics, and scenario analysis',
    icon: Activity,
    features: ['24-hour forecasts', 'Model performance', 'SHAP explanations']
  }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              ANALYTICS & INTELLIGENCE
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              Real-time analytics, forecasting, and economic intelligence
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          System Status: <span className="text-emerald-600">OPERATIONAL</span>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Analysis Modules
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {analyticsModules.length}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Available
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Data Sources
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            8
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Active
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Update Frequency
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            1H
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Real-time
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            API Endpoints
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            12
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Available
          </div>
        </div>
      </div>

      {/* Main analytics modules */}
      <section className="grid gap-6 md:grid-cols-2">
        {analyticsModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href} className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-mono font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm font-mono text-slate-600 mb-3">{module.description}</p>
                  <ul className="space-y-1">
                    {module.features.map((feature, index) => (
                      <li key={index} className="text-xs font-mono text-slate-500 flex items-center">
                        <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* API Documentation */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-mono font-semibold text-slate-900 mb-1">
            API ENDPOINTS
          </h3>
          <p className="text-sm font-mono text-slate-500">
            Direct access to analytics data and model outputs
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-3 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-sm">/api/v1/analytics/geri</code>
              <span className="text-slate-500">Current GERI score and components</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-3 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-sm">/api/v1/analytics/geri/history</code>
              <span className="text-slate-500">Historical GERI data series</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-3 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-sm">/api/v1/analytics/components</code>
              <span className="text-slate-500">Component breakdown and analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-3 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-sm">/api/v1/ai/regime/current</code>
              <span className="text-slate-500">Market regime classification</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs font-mono text-slate-500">
              Complete API documentation: <Link href="/transparency" className="text-blue-600 hover:text-blue-800 underline">Transparency Portal</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
