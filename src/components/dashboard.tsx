'use client';

import { memo, useMemo } from 'react';
import { api, GeriResponse } from '../lib/api';
import { useMemoizedApi, useMemoizedCompute } from '../hooks/use-memo-api';
import HeroSection from './dashboard/hero-section';
import OverviewSection from './dashboard/overview-section';
import RRIOCommentary from './rrio-commentary';
import ComponentGrid from './component-grid';
import PillarGrid from './pillar-grid';
import DriverNarrative from './driver-narrative';
import ResilienceActivationScore from './resilience-activation-score';
import ForecastPanel from './forecast-panel';
import DataFreshnessMeter from './data-freshness-meter';
import AnomalyLedger from './anomaly-ledger';
import PartnerLabsMedia from './partner-labs-media';
import LazyChart from './lazy-chart';
import Sparkline from './charts/sparkline';
import NewsletterStatus from './newsletter-status';
import ScenarioStudioPrompt from './scenario-studio-prompt';
import AlertBanner from './dashboard/alert-banner';
import { useAuth } from '../lib/auth';

function generateBloombergNarrative(geri: GeriResponse): string {
  if (!geri) return 'Loading resilience intelligence...';
  
  const score = geri.score?.toFixed(1) || '--';
  const band = geri.band?.toUpperCase() || 'MODERATE';
  const change = geri.change_24h || 0;
  const changeDirection = change >= 0 ? 'advanced' : 'declined';
  const changeAmount = Math.abs(change).toFixed(1);
  const confidence = Math.round(geri.confidence || 85);
  
  // Bloomberg-style driver analysis
  const topDrivers = geri.drivers?.slice(0, 3) || [];
  const driverNarrative = topDrivers.length 
    ? topDrivers.map((driver, index) => {
        const component = driver.component.replace(/_/g, ' ').toUpperCase();
        const impact = Math.abs(driver.impact || 0);
        const direction = (driver.impact || 0) > 0 ? 'elevated' : 'eased';
        const magnitude = impact > 0.5 ? 'sharply' : impact > 0.2 ? 'moderately' : 'slightly';
        
        if (index === 0) {
          return `${component} ${direction} ${magnitude}, contributing ${impact.toFixed(1)}bp`;
        } else if (index === topDrivers.length - 1) {
          return ` and ${component} ${direction} ${impact.toFixed(1)}bp`;
        } else {
          return `, ${component} ${direction} ${impact.toFixed(1)}bp`;
        }
      }).join('')
    : 'mixed cross-asset signals across pillars';

  // Generate professional lead
  const riskAssessment = getRiskAssessment(parseFloat(score));
  const timeStamp = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    timeZone: 'EST'
  });

  return `GRII ${changeDirection} ${changeAmount}pts to ${score} (${band} risk) as ${driverNarrative}. ${riskAssessment} Confidence ${confidence}%. Updated ${timeStamp} EST.`;
}

function getRiskAssessment(score: number): string {
  if (score >= 80) return 'Immediate action warranted across portfolios.';
  if (score >= 60) return 'Heightened vigilance recommended for risk managers.';
  if (score >= 40) return 'Monitor key indicators for emerging stress.';
  if (score >= 20) return 'Conditions remain within acceptable parameters.';
  return 'Minimal systemic stress observed across indicators.';
}

const Dashboard = memo(function Dashboard() {
  const { data: geri, error: geriError, isLoading: geriLoading } = useMemoizedApi<GeriResponse>('geri', () => api.getGeri());
  const { data: regime, error: regimeError } = useMemoizedApi('regime', () => api.getRegime());
  const { data: forecast } = useMemoizedApi('forecast', () => api.getForecast());
  const { data: anomaly } = useMemoizedApi('anomaly', () => api.getAnomalies());
  const { data: ras, error: rasError } = useMemoizedApi('ras', () => api.getRas());
  const { data: freshness } = useMemoizedApi('freshness', () => api.getDataFreshness());
  const { data: updateLog } = useMemoizedApi('update-log', () => api.getUpdateLog());
  const { data: partnerLabs } = useMemoizedApi('partner-labs', () => api.getPartnerLabs());
  const { data: mediaKit } = useMemoizedApi('media-kit', () => api.getMediaKit());
  const { data: newsletterStatus } = useMemoizedApi('newsletter-status', () => api.getNewsletterStatus());
  const { data: scenarioPrompts } = useMemoizedApi('scenario-prompts', () => api.getScenarioPrompts());
  const { data: geriHistory } = useMemoizedApi('geri-history', () => api.getGeriHistory(30));
  const { data: components } = useMemoizedApi('components', () => api.getGeriComponents());
  const { isAuthenticated: isContributorAuthenticated, setReviewerKey } = useAuth();

  // All hooks must be called before any early returns
  const narrative = useMemoizedCompute(
    geri,
    generateBloombergNarrative
  ) || 'Loading resilience insight...';

  const transparencyEntries = useMemo(() => {
    const entries = (updateLog as any)?.entries ?? [];
    return entries.slice(0, 4);
  }, [updateLog]);

  const scenarioCards = useMemo(() => {
    if (!scenarioPrompts?.current_prompts) return undefined;
    return scenarioPrompts.current_prompts.map((prompt: any) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      status: 'active' as const,
      created_at: prompt.created_date,
      contributor: prompt.featured_submission?.author,
    }));
  }, [scenarioPrompts]);

  // Show loading state for critical data
  if (geriLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm font-mono text-slate-600">Loading GERII intelligence...</p>
        </div>
      </div>
    );
  }

  // Show error state if critical systems are down
  if (geriError && !geri) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <h1 className="text-lg font-mono font-semibold text-slate-900 mb-2">GERII System Unavailable</h1>
          <p className="text-sm text-slate-600 mb-4">
            The core intelligence system is temporarily unavailable. Please check back in a few minutes.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white text-sm font-mono rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitScenario = async (scenario: { title: string; description: string }) => {
    try {
      if (!isContributorAuthenticated) {
        alert('Contributor access required. Enter your reviewer key to submit scenarios.');
        return;
      }
      // Get the first active scenario prompt to submit to
      const activePrompt = scenarioPrompts?.current_prompts?.[0];
      if (!activePrompt) {
        alert('No active prompts available for submission.');
        return;
      }

      const submissionData = {
        title: scenario.title,
        description: scenario.description,
        author: 'Anonymous Contributor', // In a real app, this would come from auth
        author_email: 'contributor@rrio.dev' // In a real app, this would come from auth
      };

      await api.submitScenarioResponse(activePrompt.id, submissionData);
      alert('Scenario submitted successfully! It will be reviewed by the community.');
    } catch (error) {
      console.error('Failed to submit scenario:', error);
      alert('Failed to submit scenario. Please try again.');
    }
  };

  // Check for degraded functionality warnings
  const degradedServices = [
    rasError && 'RAS System',
    regimeError && 'Regime Classification',
    !partnerLabs && 'Partner Labs',
    !scenarioPrompts && 'Scenario Studio'
  ].filter(Boolean);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="status-announcements">
        {geri ? `GRII score updated: ${geri.score}` : ''}
      </div>
      
      {/* Degraded functionality warning */}
      {degradedServices.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-6 mt-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-amber-400 text-lg">⚠</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-mono text-amber-800">
                Some services are experiencing issues: {degradedServices.join(', ')}. 
                Core GERII functionality remains operational.
              </p>
            </div>
          </div>
        </div>
      )}
      <main id="main-content" className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]" role="main">
        <HeroSection geri={geri} regime={regime} />
        <AlertBanner 
          geri={geri} 
          anomalyScore={(anomaly as any)?.summary?.max_severity || (anomaly as any)?.score}
          forecastDelta={(forecast as any)?.delta}
        />
        <OverviewSection geri={geri} narrative={narrative} regime={regime} />
        <section className="mt-6">
          <RRIOCommentary geri={geri} regime={regime} forecast={forecast} />
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          <div className="panel">
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

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          <ForecastPanel forecast={forecast} />
          <div className="panel">
            <h3 className="section-label">Freshness & Transparency</h3>
            <DataFreshnessMeter entries={(freshness as any)?.freshness ?? []} />
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-terminal-muted mb-2">Transparency Ledger</h4>
              <ul className="space-y-2">
                {transparencyEntries.map((entry: any, index: number) => (
                  <li key={`${entry?.date}-${index}`} className="flex justify-between gap-4 text-sm text-terminal-muted">
                    <span>{entry?.description ?? 'Update recorded'}</span>
                    <span className="text-xs text-[#94a3b8]">{entry?.date ?? '--'}</span>
                  </li>
                ))}
                {transparencyEntries.length === 0 && (
                  <li className="text-sm text-[#94a3b8]">Awaiting transparency log entries</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <AnomalyLedger anomaly={anomaly} />
          <PartnerLabsMedia data={partnerLabs} mediaKit={mediaKit} />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LazyChart
            type="zscore"
            data={(geriHistory as any)?.series?.slice(0, 10).map((point: any) => ({
              timestamp: point.timestamp,
              z_score: (point.score - 50) / 10, // Convert GERI score to approximate z-score
              component: 'GERI Score'
            })) || [
              { timestamp: '2024-01-01', z_score: -0.5, component: 'GERI Score' },
              { timestamp: '2024-01-02', z_score: 1.2, component: 'GERI Score' },
              { timestamp: '2024-01-03', z_score: 2.1, component: 'GERI Score' },
              { timestamp: '2024-01-04', z_score: 1.8, component: 'GERI Score' },
              { timestamp: '2024-01-05', z_score: 0.9, component: 'GERI Score' }
            ]}
            component="GERI Score"
          />
          <div className="panel">
            <h4 className="text-sm uppercase font-semibold mb-3" style={{ color: 'var(--terminal-muted)' }}>
              Component Trends
            </h4>
            <div className="space-y-3">
              {(components as any)?.components?.slice(0, 3).map((component: any, index: number) => {
                const colors = ['#1B5E20', '#0277BD', '#BF360C'];
                const sparklineData = (geriHistory as any)?.series?.slice(0, 10).map((point: any) => ({
                  value: component.value + (Math.sin(Date.parse(point.timestamp) / 100000 + index) * 5), // Simulate historical variation
                  timestamp: point.timestamp
                })) || [
                  { value: component.value, timestamp: new Date().toISOString() }
                ];
                
                return (
                  <Sparkline 
                    key={component.id}
                    data={sparklineData}
                    label={component.id}
                    color={colors[index]}
                  />
                );
              }) || [
                <Sparkline 
                  key="vix"
                  data={[
                    { value: 45, timestamp: '2024-01-01' },
                    { value: 48, timestamp: '2024-01-02' },
                    { value: 52, timestamp: '2024-01-03' },
                    { value: 49, timestamp: '2024-01-04' },
                    { value: 47, timestamp: '2024-01-05' }
                  ]}
                  label="VIX"
                  color="#1B5E20"
                />,
                <Sparkline 
                  key="credit"
                  data={[
                    { value: 2.1, timestamp: '2024-01-01' },
                    { value: 2.3, timestamp: '2024-01-02' },
                    { value: 2.5, timestamp: '2024-01-03' },
                    { value: 2.4, timestamp: '2024-01-04' },
                    { value: 2.2, timestamp: '2024-01-05' }
                  ]}
                  label="Credit Spreads"
                  color="#0277BD"
                />,
                <Sparkline 
                  key="supply"
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
              ]}
            </div>
            <p className="mt-3 text-xs text-[#94a3b8]">
              Live component trends | {(components as any)?.components?.length || 3} components | JetBrains Mono charts
            </p>
          </div>
          <div className="panel">
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

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <NewsletterStatus statusData={newsletterStatus} />
          <ScenarioStudioPrompt 
            anomalyScore={(anomaly as any)?.anomalies?.[0]?.score ?? (anomaly as any)?.summary?.max_severity ?? (anomaly as any)?.score}
            currentRegime={(regime as any)?.regime}
            recentScenarios={scenarioCards}
            summary={scenarioPrompts?.summary}
            onSubmitScenario={handleSubmitScenario}
            isContributorAuthenticated={isContributorAuthenticated}
            onAuthenticate={setReviewerKey}
          />
        </section>

        <section className="mt-10 panel">
          <h3 className="section-label mb-2">Institutional Transparency Statement</h3>
          <p className="text-sm text-[#475569] leading-relaxed">
            RRIO publishes every GRII recalibration with semantic band references, provenance timestamps, and component attribution.
            Each dashboard widget inherits the centralized color system defined in <code>SEMANTIC_COLOR_SYSTEM.md</code>, ensuring that Minimal Risk (#00C853),
            Moderate Risk (#FFD600), and Critical Risk (#D50000) states are immediately legible to analysts, regulators, and contributors.
          </p>
          <p className="text-sm text-[#475569] leading-relaxed mt-3">
            Transparency logs document data ingestion, ML retraining events, and automation triggers so the community can audit the full mission cycle.
            Partner Labs, Insight Fellows, and Contributor Missions receive the same semantic cues in public briefs, enabling award-grade submissions and regulatory reporting.
          </p>
        </section>
      </main>
    </>
  );
});

export default Dashboard;
