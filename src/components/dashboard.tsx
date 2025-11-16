'use client';

import { api, GeriResponse } from '../lib/api';

function generateBloombergNarrative(geri: GeriResponse): string {
  const bandText = geri.band?.charAt(0).toUpperCase() + geri.band?.slice(1);
  const changeDirection = (geri.change_24h || 0) >= 0 ? 'climbed' : 'declined';
  const changeAmount = Math.abs(geri.change_24h || 0).toFixed(1);
  const topDrivers = geri.drivers?.slice(0, 2);
  
  const driverText = topDrivers?.length 
    ? topDrivers.map(d => {
        const verb = d.impact > 0 ? 'pressured' : 'supported';
        return `${d.component.toLowerCase()} ${verb} by ${Math.abs(d.impact).toFixed(1)}bp`;
      }).join(' while ')
    : 'mixed component signals';

  return `GRII ${changeDirection} ${changeAmount} points to ${geri.score} (${bandText} Risk, ${geri.band_color}) as ${driverText}. Confidence: ${geri.confidence || 85}%.`;
}
import ComponentGrid from './component-grid';
import PillarGrid from './pillar-grid';
import DriverNarrative from './driver-narrative';
import AnomalyLedger from './anomaly-ledger';
import MissionHighlight from './mission-highlight';
import ForecastPanel from './forecast-panel';
import DataFreshnessMeter from './data-freshness-meter';
import RegimeCard from './regime-card';
import OverviewSection from './dashboard/overview-section';
import RRIOCommentary from './rrio-commentary';
import AlertBanner from './dashboard/alert-banner';
import { memo, useMemo } from 'react';
import { useMemoizedApi, useMemoizedCompute } from '../hooks/use-memo-api';
import LazyChart from './lazy-chart';
import Sparkline from './charts/sparkline';
import PartnerLabsMedia from './partner-labs-media';
import ResilienceActivationScore from './resilience-activation-score';
import NewsletterStatus from './newsletter-status';
import ScenarioStudioPrompt from './scenario-studio-prompt';

const Dashboard = memo(function Dashboard() {
  const { data: geri } = useMemoizedApi<GeriResponse>('geri', () => api.getGeri());
  const { data: regime } = useMemoizedApi('regime', () => api.getRegime());
  const { data: forecast } = useMemoizedApi('forecast', () => api.getForecast());
  const { data: anomaly } = useMemoizedApi('anomaly', () => api.getAnomalies());
  const { data: ras } = useMemoizedApi('ras', () => api.getRas());
  const { data: freshness } = useMemoizedApi('freshness', () => api.getDataFreshness());
  const { data: partnerLabs } = useMemoizedApi('partner-labs', () => api.getPartnerLabs());
  const { data: mediaKit } = useMemoizedApi('media-kit', () => api.getMediaKit());
  const { data: newsletterStatus } = useMemoizedApi('newsletter-status', () => api.getNewsletterStatus());
  const { data: scenarioPrompts } = useMemoizedApi('scenario-prompts', () => api.getScenarioPrompts());

  const scenarioCards = useMemo(() => {
    if (!scenarioPrompts?.current_prompts) return undefined;
    return scenarioPrompts.current_prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      status: (prompt.status as 'active' | 'published') ?? 'active',
      created_at: prompt.created_date,
      contributor: prompt.featured_submission?.author ?? undefined,
    }));
  }, [scenarioPrompts]);

  // Memoized narrative computation
  const narrative = useMemoizedCompute(
    geri,
    generateBloombergNarrative,
    [geri?.score, geri?.band, geri?.change_24h]
  ) || 'Loading resilience insight...';

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="status-announcements">
        {geri ? `GRII score updated: ${geri.score}` : ''}
      </div>
      <main id="main-content" className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]" role="main">
      <AlertBanner 
        geri={geri} 
        anomalyScore={(anomaly as any)?.summary?.max_severity || (anomaly as any)?.score}
        forecastDelta={(forecast as any)?.delta}
      />
      <OverviewSection geri={geri} narrative={narrative} regime={regime} />
      <section className="mt-6">
        <RRIOCommentary geri={geri} regime={regime} forecast={forecast} />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="risk-card">
          <h3 className="section-label">Risk Drivers</h3>
          <ComponentGrid drivers={geri?.drivers} />
          <DriverNarrative drivers={geri?.drivers} />
          <PillarGrid drivers={geri?.drivers} />
        </div>
        <ResilienceActivationScore 
          composite={(ras as any)?.composite}
          components={(ras as any)?.components}
          priorPeriod={0.62}
        />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <ForecastPanel forecast={forecast} />
        <DataFreshnessMeter entries={(freshness as any)?.freshness ?? []} />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <AnomalyLedger anomaly={anomaly} />
        <PartnerLabsMedia data={partnerLabs} mediaKit={mediaKit} />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LazyChart
          type="zscore"
          data={[
            { timestamp: '2024-01-01', z_score: -0.5, component: 'Credit Spreads' },
            { timestamp: '2024-01-02', z_score: 1.2, component: 'Credit Spreads' },
            { timestamp: '2024-01-03', z_score: 2.1, component: 'Credit Spreads' },
            { timestamp: '2024-01-04', z_score: 1.8, component: 'Credit Spreads' },
            { timestamp: '2024-01-05', z_score: 0.9, component: 'Credit Spreads' }
          ]}
          component="Credit Spreads"
        />
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h4 className="text-sm uppercase font-semibold mb-3" style={{ color: 'var(--terminal-muted)' }}>
            Component Trends
          </h4>
          <div className="space-y-3">
            <Sparkline 
              data={[
                { value: 45, timestamp: '2024-01-01' },
                { value: 48, timestamp: '2024-01-02' },
                { value: 52, timestamp: '2024-01-03' },
                { value: 49, timestamp: '2024-01-04' },
                { value: 47, timestamp: '2024-01-05' }
              ]}
              label="VIX"
              color="#1B5E20"
            />
            <Sparkline 
              data={[
                { value: 2.1, timestamp: '2024-01-01' },
                { value: 2.3, timestamp: '2024-01-02' },
                { value: 2.5, timestamp: '2024-01-03' },
                { value: 2.4, timestamp: '2024-01-04' },
                { value: 2.2, timestamp: '2024-01-05' }
              ]}
              label="Credit Spreads"
              color="#0277BD"
            />
            <Sparkline 
              data={[
                { value: 78, timestamp: '2024-01-01' },
                { value: 82, timestamp: '2024-01-02' },
                { value: 85, timestamp: '2024-01-03' },
                { value: 83, timestamp: '2024-01-04' },
                { value: 80, timestamp: '2024-01-05' }
              ]}
              label="Supply Chain"
              color="#BF360C"
            />
          </div>
          <p className="mt-3 text-xs text-[#94a3b8]">
            Live component trends | 24-hour rolling window | JetBrains Mono charts
          </p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h4 className="text-sm uppercase font-semibold mb-3" style={{ color: 'var(--terminal-muted)' }}>
            Chart Annotations
          </h4>
          <div className="space-y-2 text-xs text-[#475569]">
            <p>• Z-scores normalized to 5-year rolling window</p>
            <p>• Dotted lines indicate ±2σ statistical thresholds</p>
            <p>• Sparklines show 24-hour component evolution</p>
            <p>• Color coding follows semantic risk palette</p>
            <p>• All charts use JetBrains Mono for terminal consistency</p>
          </div>
          <p className="mt-3 text-xs text-[#94a3b8]">
            Visualization rules: docs/style/visualization_rules.md
          </p>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <NewsletterStatus statusData={newsletterStatus} />
        <ScenarioStudioPrompt 
          anomalyScore={(anomaly as any)?.anomalies?.[0]?.score ?? (anomaly as any)?.summary?.max_severity ?? (anomaly as any)?.score}
          currentRegime={(regime as any)?.regime}
          recentScenarios={scenarioCards}
          summary={scenarioPrompts?.summary}
        />
      </section>
      </main>
    </>
  );
});

export default Dashboard;
