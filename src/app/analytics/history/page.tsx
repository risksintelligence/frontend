'use client';

import { useMemo } from 'react';
import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';
import LazyChart from '../../../components/lazy-chart';

const notableEvents = [
  {
    date: '2024-01-15',
    event: 'GERII spike to 78 (High Risk)',
    description: 'Credit spread widening amid banking sector stress',
    impact: '+12 points',
    color: 'var(--risk-high)'
  },
  {
    date: '2024-01-08',
    event: 'Supply chain disruption',
    description: 'Freight costs surge due to Red Sea shipping delays',
    impact: '+8 points',
    color: 'var(--supply-chain-stress)'
  },
  {
    date: '2023-12-20',
    event: 'Market stabilization',
    description: 'VIX decline following Fed policy clarity',
    impact: '-15 points',
    color: 'var(--risk-minimal)'
  }
];

export default function HistoryPage() {
  const { data: geri } = useMemoizedApi('history-geri', () => api.getGeri());
  const { data: history } = useMemoizedApi('history-geri-series', () => api.getGeriHistory(60));

  const currentScore = geri?.score ?? '--';
  const chartData = useMemo(() => {
    return history?.geri_history?.map((entry) => ({
      timestamp: entry.date,
      z_score: (entry.score - 50) / 10,
      component: 'GERII'
    })) ?? [];
  }, [history]);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="GERII History Overview">
        <div>
          <p className="hero-eyebrow">GERII Historical Analysis</p>
          <h1 className="hero-title">Cross-cycle resilience patterns</h1>
          <p className="hero-subtitle">
            Semantic color cues across regimes, crisis periods, and stabilization phases referencing docs/style instructions.
          </p>
          <ul className="hero-bullets">
            <li>0–100 scores mapped to Minimal → Critical risk colors</li>
            <li>Regime-aware attribution and component correlations</li>
            <li>Full provenance available via Transparency Portal</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Current GRII</p>
          <p className="hero-metric-value">{currentScore}</p>
          <p className="hero-metric-footnote">Latest from /api/v1/analytics/geri</p>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">GERII Score Over Time</h2>
        <LazyChart
          type="zscore"
          data={chartData}
          component="GERII"
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-terminal-muted uppercase">Period</div>
            <div className="text-sm font-mono">{history?.period?.days ?? 60} days</div>
          </div>
          <div>
            <div className="text-xs text-terminal-muted uppercase">Data Points</div>
            <div className="text-sm font-mono">{history?.geri_history?.length ?? '--'}</div>
          </div>
          <div>
            <div className="text-xs text-terminal-muted uppercase">Last Updated</div>
            <div className="text-sm font-mono">{new Date().toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-xs text-terminal-muted uppercase">Coverage</div>
            <div className="text-sm font-mono">8 components</div>
          </div>
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Component Evolution</h2>
        <p className="text-sm text-terminal-muted">
          Component history will render once `/api/v1/analytics/geri/history` provides per-component arrays. Current drivers remain accessible from `/api/v1/analytics/geri`.
        </p>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Notable Events</h2>
        <div className="space-y-4">
          {notableEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-[#e2e8f0] rounded-lg bg-white">
              <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: event.color }}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{event.event}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#f1f5f9]">{event.impact}</span>
                </div>
                <p className="text-sm text-terminal-muted mb-1">{event.description}</p>
                <p className="text-xs text-[#94a3b8]">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Methodology Reference</h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-terminal-muted">
          <div>
            <h3 className="font-semibold text-terminal-text text-sm mb-2">Normalization</h3>
            <p>5-year rolling z-scores with direction adjustments per docs/methodology/geri_v1_methodology.md.</p>
          </div>
          <div>
            <h3 className="font-semibold text-terminal-text text-sm mb-2">Weighting</h3>
            <p>Regime-adaptive weights with 0.6 confidence threshold for overrides.</p>
          </div>
          <div>
            <h3 className="font-semibold text-terminal-text text-sm mb-2">Aggregation</h3>
            <p>Weighted sum scaled to 0-100, applying semantic color thresholds (green, amber, red).</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-terminal-muted">Full methodology: docs/methodology/geri_v1_methodology.md</p>
      </section>
    </main>
  );
}
