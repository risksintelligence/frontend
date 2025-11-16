'use client';

import { useMemo } from 'react';
import { Shield, FileText, BarChart3, Target, Activity, TrendingUp, Grid3X3 } from 'lucide-react';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';
import { getRiskStyling } from '../../lib/theme';
import LazyChart from '../../components/lazy-chart';
import ComponentHeatmap from '../../components/charts/heatmap';

export default function GriiPage() {
  const { data: geri } = useMemoizedApi('grii-geri', () => api.getGeri());
  const { data: regime } = useMemoizedApi('grii-regime', () => api.getRegime());
  const { data: forecast } = useMemoizedApi('grii-forecast', () => api.getForecast());
  const { data: anomaly } = useMemoizedApi('grii-anomaly', () => api.getAnomalies());
  const { data: freshness } = useMemoizedApi('grii-freshness', () => api.getDataFreshness());
  const { data: updates } = useMemoizedApi('grii-updates', () => api.getUpdateLog());
  const { data: history } = useMemoizedApi('grii-history', () => api.getGeriHistory(60));
  const { data: components } = useMemoizedApi('grii-components', () => api.getGeriComponents());

  const regimeProbs = useMemo(() => regime?.probabilities ?? {}, [regime]);
  const anomalies = anomaly?.anomalies ?? [];
  const geriScore = parseFloat(geri?.score?.toString() || '0');
  const geriStyling = getRiskStyling(geriScore);
  const updatedAt = useMemo(
    () => (geri?.updated_at ? new Date(geri.updated_at) : null),
    [geri?.updated_at]
  );
  const confidencePct = geri?.confidence ? (geri.confidence * 100).toFixed(1) : null;

  const topDrivers = useMemo(
    () =>
      (geri?.drivers || [])
        .slice()
        .sort((a, b) => Math.abs(b.impact ?? b.contribution ?? 0) - Math.abs(a.impact ?? a.contribution ?? 0))
        .slice(0, 4),
    [geri?.drivers]
  );

  const driverNarrative = useMemo(() => {
    if (!geri || !topDrivers.length) {
      return 'Awaiting GERI telemetry. Pipeline is warming up historical components.';
    }
    const primary = topDrivers[0];
    const direction = (geri.change_24h ?? 0) >= 0 ? 'widened by' : 'tightened by';
    const delta = Math.abs(geri.change_24h ?? 0).toFixed(1);
    const supporting = topDrivers
      .slice(1, 3)
      .map((driver) => driver.component)
      .join(', ');
    const riskDirection = (geri.change_24h ?? 0) >= 0 ? 'elevated' : 'contained';
    return `GRII prints ${geri.score.toFixed(1)} (${geriStyling.level}) after it ${direction} ${delta} pts in the last 24h, led by ${primary.component} (${(primary.z_score ?? 0).toFixed(2)}σ) while ${supporting || 'secondary drivers'} kept risk ${riskDirection}.`;
  }, [geri, topDrivers, geriStyling]);

  const provenanceLine = useMemo(() => {
    const bits = [
      updatedAt ? `Calc ${updatedAt.toLocaleString('en-US', { timeZone: 'UTC', hour12: false })} UTC` : null,
      confidencePct ? `Confidence ${confidencePct}%` : null,
      geri?.metadata?.total_observations ? `${geri.metadata.total_observations} obs` : null,
      geri?.metadata?.series_count ? `${geri.metadata.series_count} series` : null,
      'Source: GERII pipeline (L2 cache)'
    ].filter(Boolean);
    return bits.join(' • ');
  }, [updatedAt, confidencePct, geri?.metadata]);

  const watchlist = useMemo(
    () => Object.entries(regimeProbs).sort((a, b) => b[1] - a[1]).slice(0, 4),
    [regimeProbs]
  );

  const componentHeatmapIds =
    components?.components?.slice(0, 2).map((component) => component.id) ?? [];

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              GERI INTELLIGENCE CORE
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              Real-time economic risk analysis and regime detection
            </p>
            <p className="text-xs text-terminal-muted font-mono mt-1">
              {provenanceLine || 'Telemetry warming up • Source: GERII pipeline'}
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          Engine: <span className="text-emerald-600">OPERATIONAL</span>
        </div>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm" aria-label="GERI editorial narrative">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              BLOOMBERG NARRATIVE
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            GERI intelligence summary and market context
          </p>
        </div>
        <div className="p-4">
          <p className="text-slate-900 text-base font-mono leading-relaxed">
            {driverNarrative}
          </p>
          <p className="text-xs font-mono text-slate-500 mt-3">
            Attribution weights reference `/analytics/geri` driver payload. Confidence tape: {confidencePct ?? '--'}%.
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Current GERI
          </div>
          <div className={`text-2xl font-mono font-bold mb-1 ${geriStyling.textColor}`}>
            {geriScore.toFixed(1) || '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            {geriStyling.level}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Active Regime
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {regime?.regime?.replace('_', ' ') || 'CALM'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            {Math.round((regime?.confidence || 0) * 100)}% confidence
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Forecast Delta
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {forecast?.delta?.toFixed(1) || '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            24h prediction
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Anomalies
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {anomalies.length}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Detected
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm" aria-label="Driver attribution grid">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              DRIVER ATTRIBUTION
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Component contributions to current GERI score
          </p>
        </div>
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {topDrivers.map((driver) => (
              <article
                key={driver.component}
                className="border border-slate-200 rounded-lg p-3 bg-slate-50"
              >
                <p className="text-xs uppercase text-slate-500 font-mono">{driver.component}</p>
                <p className="text-lg font-semibold text-slate-900 font-mono">
                  {(driver.impact ?? driver.contribution ?? 0).toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  z-score {(driver.z_score ?? 0).toFixed(2)} • confidence {(driver.confidence ?? 0).toFixed(2)}
                </p>
              </article>
            ))}
            {!topDrivers.length && (
              <p className="text-sm text-slate-500 font-mono">Awaiting driver telemetry…</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              REGIME PROBABILITIES
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Market regime classification and transition analysis
          </p>
        </div>
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm font-mono">
            {Object.entries(regimeProbs).map(([name, value]) => (
              <div key={name} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <p className="text-xs uppercase text-slate-500 font-mono">{name}</p>
                <p className="text-lg font-semibold text-slate-900 font-mono">{(value * 100).toFixed(1)}%</p>
              </div>
            ))}
            {Object.keys(regimeProbs).length === 0 && (
              <p className="text-sm text-slate-500 font-mono">Awaiting classifier output…</p>
            )}
          </div>
          {watchlist.length > 0 && (
            <p className="text-xs text-slate-500 font-mono mt-3">
              Transition watchlist: {watchlist.map(([name, prob]) => `${name} ${Math.round(prob * 100)}%`).join(' • ')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              DATA FRESHNESS & ANOMALIES
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Real-time data quality and anomaly detection status
          </p>
        </div>
        <div className="p-4">
          <p className="text-sm font-mono text-slate-500 mb-4">
            Freshness entries map TTL semantics: Fresh (Minimal), Warning (Amber), Stale (Critical). Anomaly ledger uses purple palette (#6200EA).
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs uppercase text-slate-500 font-mono mb-2">Freshness</h3>
              <ul className="space-y-2 text-sm font-mono text-slate-600">
                {(freshness as any)?.map((entry: any, idx: number) => (
                  <li key={`${entry.component}-${idx}`} className="flex justify-between">
                    <span>{entry.component}</span>
                    <span className="capitalize">{entry.status}</span>
                  </li>
                )) || <li>No freshness data yet.</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase text-slate-500 font-mono mb-2">Latest Anomalies</h3>
              <ul className="space-y-2 text-sm font-mono text-slate-600">
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
        </div>
      </div>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                GERII TREND
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Historical GERI index performance and trends
            </p>
          </div>
          <div className="p-4">
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
        </div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Grid3X3 className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                COMPONENT Z-SCORE GRID
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Component risk distribution and correlation analysis
            </p>
          </div>
          <div className="p-4">
            <p className="text-sm font-mono text-slate-500">
              Heatmap placeholder; once `/api/v1/analytics/components` is live we can visualize each component across time slices.
            </p>
          </div>
        </div>
      </section>

      {componentHeatmapIds.length > 0 && (
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {componentHeatmapIds.map((componentId) => (
            <ComponentHeatmap key={componentId} componentId={componentId} days={45} />
          ))}
        </section>
      )}

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              TRANSPARENCY LOG
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            System updates and methodology changes audit trail
          </p>
        </div>
        <div className="p-4">
          <ul className="space-y-2 text-sm font-mono text-slate-600">
            {(updates as any)?.slice(0, 6).map((entry: any, idx: number) => (
              <li key={`${entry.date}-${idx}`} className="flex justify-between gap-4">
                <span>{entry.description}</span>
                <span className="text-xs text-slate-500">{entry.date}</span>
              </li>
            )) || <li>No transparency entries loaded.</li>}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              FORECAST & SCENARIO NOTES
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Predictive model outputs and scenario analysis
          </p>
        </div>
        <div className="p-4">
          <p className="text-sm font-mono text-slate-600">
            ΔGRII: {forecast?.delta ?? '--'} | p(Δ&gt;5): {forecast?.p_gt_5 ?? '--'} | Confidence interval: {forecast?.confidence_interval?.join(' → ') ?? '--'}
          </p>
          <p className="text-xs font-mono text-slate-500 mt-2">
            Forecasts generated by `/scripts/train_models.py` using 5-year window; metadata recorded in `model_metadata` table.
          </p>
        </div>
      </div>
    </div>
  );
}
