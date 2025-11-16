'use client';

import useSWR from 'swr';
import { api, GeriResponse } from '../lib/api';
import ComponentGrid from './component-grid';
import AnomalyLedger from './anomaly-ledger';
import MissionHighlight from './mission-highlight';

export default function Dashboard() {
  const { data: geri } = useSWR<GeriResponse>('geri', () => api.getGeri());
  const { data: regime } = useSWR('regime', () => api.getRegime());
  const { data: forecast } = useSWR('forecast', () => api.getForecast());
  const { data: anomaly } = useSWR('anomaly', () => api.getAnomalies());
  const { data: ras } = useSWR('ras', () => api.getRas());

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="text-sm uppercase tracking-wide text-[#64748b]">GRII Score</h2>
          <p className="text-4xl font-bold" style={{ color: geri?.color }}>{geri?.score ?? '--'}</p>
          <p className="text-sm">{geri?.band ?? 'loading...'}</p>
          <p className="mt-2 text-xs text-[#94a3b8]">Updated: {geri?.updated_at}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="text-sm uppercase tracking-wide text-[#64748b]">Regime</h2>
          <p className="text-2xl font-bold">{regime?.regime ?? '--'}</p>
          <ul className="mt-2 text-xs text-[#475569]">
            {regime?.probabilities &&
              Object.entries(regime.probabilities).map(([name, prob]) => (
                <li key={name}>{name}: {(prob * 100).toFixed(1)}%</li>
              ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="text-sm uppercase tracking-wide text-[#64748b]">Forecast</h2>
          <p className="text-2xl font-bold">Δ {forecast?.delta ?? '--'}</p>
          <p className="text-xs text-[#475569]">p(Δ>5): {forecast?.p_gt_5 ?? '--'}</p>
          <p className="text-xs text-[#94a3b8]">CI: {forecast?.confidence_interval?.join(' to ')}</p>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h3 className="text-sm uppercase text-[#64748b]">Drivers</h3>
          <ComponentGrid drivers={geri?.drivers} />
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h3 className="text-sm uppercase text-[#64748b]">Resilience Activation Score</h3>
          <p className="text-3xl font-bold">{ras?.composite ?? '--'}</p>
          <ul className="mt-2 text-xs text-[#475569]">
            {ras?.components &&
              Object.entries(ras.components).map(([component, value]) => (
                <li key={component} className="flex justify-between">
                  <span>{component}</span>
                  <span>{value}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <AnomalyLedger anomaly={anomaly} />
        <MissionHighlight
          title="Ethical AI Stress Testing"
          description="Helping U.S. financial institutions deploy explainable AI for systemic risk detection."
        />
      </section>
    </main>
  );
}
