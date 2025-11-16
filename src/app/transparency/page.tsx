'use client';

import { useMemo } from 'react';
import MissionHighlight from '../../components/mission-highlight';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';

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

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Transparency Portal">
        <div>
          <p className="hero-eyebrow">RRIO Transparency Portal</p>
          <h1 className="hero-title">Semantic provenance & cache visibility</h1>
          <p className="hero-subtitle">
            Track data freshness, TTL states, provenance logs, and Resilience Activation Score calculations with Bloomberg-grade semantics.
          </p>
          <ul className="hero-bullets">
            <li>Semantic color cues for Minimal → Critical risk bands</li>
            <li>TTL monitoring across Redis/Postgres per spec</li>
            <li>Public attribution + mission highlights for auditors</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">RAS Composite</p>
          <p className="hero-metric-value">{(ras as any)?.composite ?? '--'}</p>
          <p className="hero-metric-footnote">Updated {(ras as any)?.calculated_at ?? 'pending'}</p>
        </div>
      </header>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label">Data Freshness</h2>
          <p className="text-sm text-terminal-muted mb-3">
            Semantic TTL mapping: Fresh (Minimal), Warning (Amber), Stale (Critical).
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-terminal-muted">
                <th className="text-left">Component</th>
                <th className="text-left">Status</th>
                <th className="text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {freshnessEntries.map((entry: any, idx: number) => (
                <tr key={`${entry.component}-${idx}`} className="border-b border-[#e2e8f0]">
                  <td className="py-2 font-semibold">{entry.component}</td>
                  <td className="py-2 capitalize">{entry.status}</td>
                  <td className="py-2 text-terminal-muted">{entry.last_updated ?? entry.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="section-label">Transparency Log</h2>
          <ul className="space-y-3 text-sm text-terminal-muted">
            {updateEntries.map((entry: any, idx: number) => (
              <li key={`${entry.date}-${idx}`} className="flex justify-between gap-4">
                <span>{entry.description}</span>
                <span className="text-xs text-[#94a3b8]">{entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label">Resilience Activation Score</h2>
          <p className="hero-score-value text-risk-moderate">{(ras as any)?.composite ?? '--'}</p>
          <ul className="mt-2 text-sm text-terminal-muted">
            {(ras as any)?.components &&
              Object.entries((ras as any).components).map(([component, value]) => (
                <li key={component} className="flex justify-between">
                  <span>{component}</span>
                  <span>{String(value)}</span>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-xs text-[#94a3b8]">Last calculated: {(ras as any)?.calculated_at ?? 'pending'}</p>
        </div>

        <div className="panel">
          <h2 className="section-label">Data Attribution</h2>
          <ul className="space-y-2 text-sm text-terminal-muted">
            {attributionSources.map((source) => (
              <li key={source.provider} className="flex flex-col">
                <span className="font-semibold">{source.provider}</span>
                <a href={source.link} target="_blank" rel="noreferrer" className="text-xs text-[#1e3a8a] underline">
                  {source.license}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <MissionHighlight
          title="Insight Fellowship Cohort"
          description="Ethical AI & Predictive Resilience cohort. Fellows publish briefs and judge Sector Mission deliverables with semantic provenance logs."
        />
      </section>
    </main>
  );
}
