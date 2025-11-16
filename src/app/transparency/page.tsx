'use client';

import useSWR from 'swr';
import DataFreshness from '../../components/transparency/data-freshness';
import UpdateLog from '../../components/transparency/update-log';
import AttributionTable from '../../components/transparency/attribution';
import RASHistory from '../../components/transparency/ras-history';
import MissionHighlight from '../../components/mission-highlight';
import { api } from '../../lib/api';

const dummyFreshness = [
  { component: 'VIX', status: 'fresh', lastUpdated: '2024-11-15' },
  { component: 'PMI', status: 'warning', lastUpdated: '2024-10-01' },
];

const dummyUpdates = [
  { date: '2024-11-12', description: 'Added RRIO automation scripts' },
  { date: '2024-11-10', description: 'Updated GRII weights' },
];

const dummyAttribution = [
  { provider: 'FRED', license: 'Federal Reserve Economic Data (public domain)' },
  { provider: 'EIA', license: 'EIA API terms' },
];

const dummyHistory = [
  { date: 'Nov 1', value: 0.62 },
  { date: 'Nov 8', value: 0.65 },
  { date: 'Nov 15', value: 0.68 },
];

export default function TransparencyPage() {
  const { data: ras } = useSWR('ras-transparency', () => api.getRas()) as { data?: { composite?: number; components?: Record<string, number>; calculated_at?: string } };
  return (
    <main className="min-h-screen bg-[#f1f5f9] p-6 font-mono text-[#0f172a]">
      <h1 className="text-2xl font-bold">Transparency Portal</h1>
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <DataFreshness freshness={dummyFreshness} />
        <UpdateLog entries={dummyUpdates} />
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <AttributionTable entries={dummyAttribution} />
        <RASHistory history={dummyHistory} />
      </section>
      <section className="mt-4 rounded-xl border border-[#e2e8f0] bg-white p-4">
        <h2 className="text-sm uppercase text-[#64748b]">Resilience Activation Score</h2>
        <p className="text-3xl font-bold">{ras?.composite ?? '--'}</p>
        <ul className="mt-2 text-sm">
          {ras?.components &&
            Object.entries(ras.components).map(([component, value]) => (
              <li key={component} className="flex justify-between">
                <span>{component}</span>
                <span>{value}</span>
              </li>
            ))}
        </ul>
        <p className="mt-2 text-xs text-[#94a3b8]">Last calculated: {ras?.calculated_at}</p>
      </section>
      <section className="mt-4">
        <MissionHighlight
          title="Insight Fellowship Cohort"
          description="Ethical AI & Predictive Resilience cohort. Fellows publish briefs and judge Sector Mission deliverables."
        />
      </section>
    </main>
  );
}
