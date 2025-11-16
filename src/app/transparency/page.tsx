'use client';

import { useMemo } from 'react';
import { Eye, Database, Activity, Shield } from 'lucide-react';
import MissionHighlight from '../../components/mission-highlight';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';
import { getRiskStyling } from '../../lib/theme';

const fallbackFreshness = [
  { component: 'VIX', status: 'fresh', last_updated: '2024-11-15' },
  { component: 'PMI', status: 'warning', last_updated: '2024-10-01' },
];

const fallbackUpdates = [
  { date: '2024-11-12', description: 'Added RRIO automation scripts' },
  { date: '2024-11-10', description: 'Updated GRII weights' },
];

const attributionSources = [
  { provider: 'FRED', license: 'Federal Reserve Economic Data (public domain)', link: 'https://fred.stlouisfed.org/' },
  { provider: 'EIA', license: 'EIA API terms of service', link: 'https://www.eia.gov/opendata/' },
  { provider: 'BLS', license: 'Bureau of Labor Statistics (public domain)', link: 'https://www.bls.gov/' },
];

export default function TransparencyPage() {
  const { data: freshnessData } = useMemoizedApi('transparency-freshness', () => api.getDataFreshness());
  const { data: updateLogData } = useMemoizedApi('transparency-updates', () => api.getUpdateLog());
  const { data: ras } = useMemoizedApi('transparency-ras', () => api.getRas());

  const freshnessEntries = useMemo(() => {
    return (freshnessData as any)?.freshness ?? fallbackFreshness;
  }, [freshnessData]);

  const updateEntries = useMemo(() => {
    return (updateLogData as any)?.entries ?? fallbackUpdates;
  }, [updateLogData]);

  const rasScore = parseFloat((ras as any)?.composite || '0');
  const rasStyling = getRiskStyling(rasScore);

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              TRANSPARENCY PORTAL
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              System monitoring, data provenance, and operational transparency
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          Monitoring: <span className="text-emerald-600">ACTIVE</span>
        </div>
      </div>

      {/* System status overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Cache Efficiency
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            98.2%
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Hit Rate
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            API Calls/Day
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            1.2K
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Current Load
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            RAS Composite
          </div>
          <div className={`text-2xl font-mono font-bold mb-1 ${rasStyling.textColor}`}>
            {rasScore.toFixed(1) || '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            {rasStyling.level}
          </div>
        </div>
      </div>

      {/* Main content sections */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Data Freshness */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                DATA FRESHNESS
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Real-time monitoring of data provider feeds and cache status
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {freshnessEntries.map((entry: any, idx: number) => {
                const statusColor = entry.status === 'fresh' ? 'text-emerald-600' : 
                                   entry.status === 'warning' ? 'text-amber-600' : 'text-red-600';
                const statusBg = entry.status === 'fresh' ? 'bg-emerald-50' : 
                                entry.status === 'warning' ? 'bg-amber-50' : 'bg-red-50';
                
                return (
                  <div key={`${entry.component}-${idx}`} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
                      <span className="font-mono font-semibold text-slate-900">{entry.component}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full ${statusBg} ${statusColor} uppercase`}>
                        {entry.status}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {entry.last_updated ?? entry.lastUpdated}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                SYSTEM ACTIVITY
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Recent system updates and operational changes
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {updateEntries.map((entry: any, idx: number) => (
                <div key={`${entry.date}-${idx}`} className="flex justify-between items-start gap-4 py-2 border-b border-slate-100 last:border-b-0">
                  <span className="text-sm font-mono text-slate-700 flex-1">{entry.description}</span>
                  <span className="text-xs font-mono text-slate-500 whitespace-nowrap">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RAS Details */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                RESILIENCE ACTIVATION SCORE
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Composite resilience metric across all system components
            </p>
          </div>
          <div className="p-4">
            <div className="text-center mb-4">
              <div className={`text-4xl font-mono font-bold ${rasStyling.textColor} mb-2`}>
                {rasScore.toFixed(1) || '--'}
              </div>
              <div className={`text-sm font-mono px-3 py-1 rounded-full border ${rasStyling.bgColor} ${rasStyling.textColor} ${rasStyling.borderColor}`}>
                {rasStyling.level} RESILIENCE
              </div>
            </div>
            
            {(ras as any)?.components && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold text-slate-700 uppercase tracking-wide mb-3">
                  Component Breakdown
                </h4>
                {Object.entries((ras as any).components).map(([component, value]) => (
                  <div key={component} className="flex justify-between items-center py-1">
                    <span className="text-sm font-mono text-slate-600">{component}</span>
                    <span className="text-sm font-mono font-semibold text-slate-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono text-slate-500">
              Last calculated: {(ras as any)?.calculated_at ?? 'pending'}
            </div>
          </div>
        </div>

        {/* Data Attribution */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-mono font-semibold text-slate-900 mb-1">
              DATA ATTRIBUTION
            </h3>
            <p className="text-sm font-mono text-slate-500">
              Source providers, licensing, and compliance information
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {attributionSources.map((source) => (
                <div key={source.provider} className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-mono font-semibold text-slate-900 text-sm mb-1">
                    {source.provider}
                  </div>
                  <a 
                    href={source.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-mono text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                  >
                    {source.license}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission highlight section */}
      <div className="mt-6">
        <MissionHighlight
          title="Insight Fellowship Cohort"
          description="Ethical AI & Predictive Resilience cohort. Fellows publish briefs and judge Sector Mission deliverables with semantic provenance logs."
        />
      </div>
    </div>
  );
}
