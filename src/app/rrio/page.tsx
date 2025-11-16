'use client';

import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';
import MissionHighlight from '../../components/mission-highlight';
import LazyChart from '../../components/lazy-chart';

export default function RrioPage() {
  const { data: ras } = useMemoizedApi('rrio-ras', () => api.getRas());
  const { data: newsletterStatus } = useMemoizedApi('rrio-newsletter', () => api.getNewsletterStatus());
  const { data: scenarioPrompts } = useMemoizedApi('rrio-scenarios', () => api.getScenarioPrompts());
  const { data: partnerLabs } = useMemoizedApi('rrio-partner-labs', () => api.getPartnerLabs());
  const { data: submissionsSummary } = useMemoizedApi('rrio-submissions', () => api.getSubmissionsSummary());

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="RRIO Public Intelligence">
        <div>
          <p className="hero-eyebrow">RRIO Public Intelligence Layer</p>
          <h1 className="hero-title">Resilience Activation & Mission Hub</h1>
          <p className="hero-subtitle">
            Sector Missions, Insight Fellows, Partner Labs, and communication automation layered on top of GRII intelligence.
          </p>
          <ul className="hero-bullets">
            <li>Semantic color palette for mission dashboards and briefs</li>
            <li>RRIO automation scripts feed the communication portal</li>
            <li>Transparency-first community pipeline referencing `/community` APIs</li>
          </ul>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric-card">
            <p className="hero-metric-label">RAS Composite</p>
            <p className="hero-metric-value">{(ras as any)?.composite ?? '--'}</p>
            <p className="hero-metric-footnote">Updated {(ras as any)?.calculated_at ?? 'pending'}</p>
          </div>
          <div className="hero-metric-card">
            <p className="hero-metric-label">Submissions</p>
            <p className="hero-metric-value">{(submissionsSummary as any)?.total_submissions ?? '--'}</p>
            <p className="hero-metric-footnote">Approved: {(submissionsSummary as any)?.status_breakdown?.approved ?? 0}</p>
          </div>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label">Resilience Activation Score</h2>
        <ul className="text-sm text-terminal-muted space-y-1">
          {(ras as any)?.components &&
            Object.entries((ras as any).components).map(([name, value]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{(value as number)?.toFixed(2)}</span>
              </li>
            ))}
          {!(ras as any)?.components && <li>No RAS component data yet.</li>}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label mb-3">Newsletter Automation</h2>
          <p className="text-sm text-terminal-muted">Daily Flash next send: {(newsletterStatus as any)?.daily_flash?.next_scheduled ?? 'pending'}</p>
          <p className="text-sm text-terminal-muted mt-1">Weekly Wrap next send: {(newsletterStatus as any)?.weekly_wrap?.next_scheduled ?? 'pending'}</p>
          <p className="text-xs text-terminal-muted mt-2">Automation status: {(newsletterStatus as any)?.daily_flash?.automation?.enabled ? 'Enabled' : 'Manual'}</p>
        </div>
        <div className="panel">
          <h2 className="section-label mb-3">Scenario Studio</h2>
          <ul className="space-y-2 text-sm text-terminal-muted">
            {(scenarioPrompts as any)?.current_prompts?.slice(0, 3).map((prompt: any) => (
              <li key={prompt.id} className="flex justify-between flex-wrap">
                <span>{prompt.title}</span>
                <span className="text-xs">{prompt.deadline}</span>
              </li>
            )) || <li>No active prompts.</li>}
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label mb-3">Partner Labs</h2>
          <ul className="space-y-2 text-sm text-terminal-muted">
            {(partnerLabs as any)?.partner_labs?.slice(0, 5).map((lab: any) => (
              <li key={lab.id} className="flex justify-between">
                <span>{lab.name} ({lab.sector})</span>
                <span className="text-xs">{lab.status}</span>
              </li>
            )) || <li>No partner lab data.</li>}
          </ul>
        </div>
        <div className="panel">
          <h2 className="section-label mb-3">Featured Mission</h2>
          <MissionHighlight
            title="Insight Fellowship Cohort"
            description="Ethical AI & predictive resilience projects, publishing Bloomberg-grade briefs with semantic color narratives."
          />
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label">Community Metrics</h2>
        <ul className="text-sm text-terminal-muted space-y-1">
          <li>Recent submissions (30d): {(submissionsSummary as any)?.recent_submissions_30d ?? 0}</li>
          <li>Pending review: {(submissionsSummary as any)?.pending_review ?? 0}</li>
          <li>Approval rate: {((submissionsSummary as any)?.approval_rate ?? 0) * 100}%</li>
        </ul>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label mb-3">RAS Momentum (placeholder)</h2>
        <LazyChart
          type="zscore"
          data={[
            { timestamp: '2024-10-01', z_score: 0.6, component: 'RAS' },
            { timestamp: '2024-10-15', z_score: 0.7, component: 'RAS' },
            { timestamp: '2024-11-01', z_score: 0.68, component: 'RAS' },
            { timestamp: '2024-11-15', z_score: 0.72, component: 'RAS' },
          ]}
          component="RAS"
        />
        <p className="mt-3 text-xs text-terminal-muted">
          Will connect to `/impact/ras` history once the backend exposes time series.
        </p>
      </section>
    </main>
  );
}
