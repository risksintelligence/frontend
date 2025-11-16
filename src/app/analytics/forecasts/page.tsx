'use client';

import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';

export default function ForecastsPage() {
  const { data: forecast } = useMemoizedApi('forecast', () => api.getForecast());

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Forecasting Overview">
        <div>
          <p className="hero-eyebrow">RRIO Forecast Models</p>
          <h1 className="hero-title">24-hour predictive analytics</h1>
          <p className="hero-subtitle">
            Linear regression forecasts, ML diagnostics, and scenario prompts with semantic provenance.
          </p>
          <ul className="hero-bullets">
            <li>Delta estimates with confidence envelopes</li>
            <li>Model metadata stored in `/model_metadata` (regime/forecast/anomaly)</li>
            <li>Transparency linked to `/transparency` portal</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Forecast ΔGRII</p>
          <p className="hero-metric-value">{forecast?.delta ?? '--'}</p>
          <p className="hero-metric-footnote">From /api/v1/ai/forecast/next-24h</p>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label">Model Forecast</h2>
        <p className="text-sm text-terminal-muted">Model output will render here once backend endpoint provides time series.</p>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label">Model Diagnostics</h2>
        <ul className="text-sm text-terminal-muted space-y-2">
          <li>Model trained via `/scripts/train_models.py`</li>
          <li>MSE logged each training cycle</li>
          <li>Version + training window stored in `model_metadata`</li>
        </ul>
      </section>
    </main>
  );
}
