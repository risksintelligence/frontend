'use client';

import { useMemo } from 'react';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';
import LazyChart from '../../components/lazy-chart';

export default function GriiPage() {
  const { data: geri } = useMemoizedApi('grii-geri', () => api.getGeri());
  const { data: regime } = useMemoizedApi('grii-regime', () => api.getRegime());
  const { data: forecast } = useMemoizedApi('grii-forecast', () => api.getForecast());
  const { data: anomaly } = useMemoizedApi('grii-anomaly', () => api.getAnomalies());
  const { data: freshness } = useMemoizedApi('grii-freshness', () => api.getDataFreshness());
  const { data: updates } = useMemoizedApi('grii-updates', () => api.getUpdateLog());
  const { data: history } = useMemoizedApi('grii-history', () => api.getGeriHistory(60));

  const regimeProbs = regime?.probabilities ?? {};
  const anomalies = anomaly?.anomalies ?? [];

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="GRII Intelligence Core">
        <div>
          <p className="hero-eyebrow">GRII Intelligence Core</p>
          <h1 className="hero-title">Machine Intelligence & Risk Engine</h1>
          <p className="hero-subtitle">
            GERI/GRII computations, regime classifiers, forecast models, and anomaly detection aligned with SEMANTIC_COLOR_SYSTEM.md.
          </p>
          <ul className="hero-bullets">
            <li>Five-year rolling normalization and regime-aware weighting</li>
            <li>Semantic color palette for Minimal → Critical risk bands</li>
            <li>Transparent logging via `/transparency` portal</li>
          </ul>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric-card">
            <p className="hero-metric-label">Current GRII</p>
            <p className="hero-metric-value">{geri?.score ?? '--'}</p>
            <p className="hero-metric-footnote">Band: {geri?.band ?? '—'} | Updated {geri?.updated_at ?? 'pending'}</p>
          </div>
          <div className="hero-metric-card">
            <p className="hero-metric-label">Active Regime</p>
            <p className="hero-metric-value">{regime?.regime ?? 'Calm'}</p>
            <p className="hero-metric-footnote">Δ forecast: {forecast?.delta ?? '--'}</p>
          </div>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Regime Probabilities</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm text-terminal-muted">
          {Object.entries(regimeProbs).map(([name, value]) => (
            <div key={name} className="border border-[#e2e8f0] rounded-lg p-3">
              <p className="text-xs uppercase text-terminal-muted">{name}</p>
              <p className="text-lg font-semibold text-terminal-text">{(value * 100).toFixed(1)}%</p>
            </div>
          ))}
          {Object.keys(regimeProbs).length === 0 && (
            <p className="text-sm text-terminal-muted">Awaiting classifier output…</p>
          )}
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Data Freshness & Anomalies</h2>
        <p className="text-sm text-terminal-muted">
          Freshness entries map TTL semantics: Fresh (Minimal), Warning (Amber), Stale (Critical). Anomaly ledger uses purple palette (#6200EA).
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div>
            <h3 className="text-xs uppercase text-terminal-muted mb-2">Freshness</h3>
            <ul className="space-y-2 text-sm text-terminal-muted">
              {(freshness as any)?.map((entry: any, idx: number) => (
                <li key={`${entry.component}-${idx}`} className="flex justify-between">
                  <span>{entry.component}</span>
                  <span className="capitalize">{entry.status}</span>
                </li>
              )) || <li>No freshness data yet.</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-terminal-muted mb-2">Latest Anomalies</h3>
            <ul className="space-y-2 text-sm text-terminal-muted">
              {anomalies.slice(0, 5).map((entry: any, idx: number) => (
                <li key={idx} className="flex justify-between">
                  <span>{entry.classification ?? 'Anomaly'}</span>
                  <span>{entry.score?.toFixed(2) ?? '--'}</span>
                </li>
              ))}
              {anomalies.length === 0 && <li>No anomalies detected.</li>}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label mb-3">GERII Trend</h2>
          <LazyChart
            type="zscore"
            data={history?.geri_history?.map(entry => ({
              timestamp: entry.date,
              z_score: (entry.score - 50) / 10,
              component: 'GERII'
            })) ?? []}
            component="GERII"
          />
        </div>
        <div className="panel">
          <h2 className="section-label mb-3">Component Z-score Grid</h2>
          <p className="text-sm text-terminal-muted">
            Heatmap placeholder; once `/api/v1/analytics/components` is live we can visualize each component across time slices.
          </p>
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Transparency Log</h2>
        <ul className="space-y-2 text-sm text-terminal-muted">
          {(updates as any)?.slice(0, 6).map((entry: any, idx: number) => (
            <li key={`${entry.date}-${idx}`} className="flex justify-between gap-4">
              <span>{entry.description}</span>
              <span className="text-xs text-[#94a3b8]">{entry.date}</span>
            </li>
          )) || <li>No transparency entries loaded.</li>}
        </ul>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">Forecast & Scenario Notes</h2>
        <p className="text-sm text-terminal-muted">
          ΔGRII: {forecast?.delta ?? '--'} | p(Δ&gt;5): {forecast?.p_gt_5 ?? '--'} | Confidence interval: {forecast?.confidence_interval?.join(' → ') ?? '--'}
        </p>
        <p className="text-xs text-terminal-muted mt-2">
          Forecasts generated by `/scripts/train_models.py` using 5-year window; metadata recorded in `model_metadata` table.
        </p>
      </section>
    </main>
  );
}
