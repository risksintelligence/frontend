'use client';

import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';

export default function RegimesPage() {
  const { data: regime } = useMemoizedApi('regime', () => api.getRegime());

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Regime Detection Overview">
        <div>
          <p className="hero-eyebrow">RRIO Regime Classifier</p>
          <h1 className="hero-title">Macro regime probabilities</h1>
          <p className="hero-subtitle">
            Random forest classifier trained on 5-year rolling features with semantic thresholds for transitions.
          </p>
          <ul className="hero-bullets">
            <li>Outputs Calm / Inflationary Stress / Supply Shock / Financial Stress probabilities</li>
            <li>Model metadata logged via `/model_metadata` per training cycle</li>
            <li>Transparency portal logs retraining events</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Active Regime</p>
          <p className="hero-metric-value">{regime?.regime ?? '--'}</p>
          <p className="hero-metric-footnote">Source: /api/v1/ai/regime/current</p>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label">Probability Distribution</h2>
        <p className="text-sm text-terminal-muted">Probability breakdown per active fetch.</p>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label">Transition Watchlist</h2>
        <p className="text-sm text-terminal-muted">Will display transition matrices and probability deltas once data is populated.</p>
      </section>
    </main>
  );
}
