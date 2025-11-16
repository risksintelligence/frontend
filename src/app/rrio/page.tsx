'use client';

import { useMemo } from 'react';
import { BookOpen, Users, Target, Activity, Award, FileText, Building2, TrendingUp } from 'lucide-react';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';
import { getRiskStyling } from '../../lib/theme';
import MissionHighlight from '../../components/mission-highlight';
import LazyChart from '../../components/lazy-chart';

export default function RrioPage() {
  const { data: ras } = useMemoizedApi('rrio-ras', () => api.getRas());
  const { data: rasHistory } = useMemoizedApi('rrio-ras-history', () => api.getRasHistory(30));
  const { data: newsletterStatus } = useMemoizedApi('rrio-newsletter', () => api.getNewsletterStatus());
  const { data: scenarioPrompts } = useMemoizedApi('rrio-scenarios', () => api.getScenarioPrompts());
  const { data: partnerLabs } = useMemoizedApi('rrio-partner-labs', () => api.getPartnerLabs());
  const { data: submissionsSummary } = useMemoizedApi('rrio-submissions', () => api.getSubmissionsSummary());

  const rasComposite = parseFloat((ras as any)?.composite ?? '0');
  const rasCompositeDisplay = Number.isFinite(rasComposite) ? rasComposite.toFixed(1) : '--';
  const rasLeadComponent = useMemo(() => {
    const entries = Object.entries((ras as any)?.components ?? {});
    if (!entries.length) return null;
    return entries.sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  }, [ras]);

  const partnerLabCount = ((partnerLabs as any)?.partner_labs ?? []).length;

  const rasNarrative = useMemo(() => {
    if (!ras) {
      return 'Awaiting RAS telemetry. Mission automation is syncing with GRII feed.';
    }
    const [leadName, leadValue] = rasLeadComponent ?? ['Activation Vector', 0];
    return `RRIO signals ${rasCompositeDisplay} RAS with ${leadName} driving the current posture (${(leadValue as number).toFixed(2)}). Partner labs are feeding ${partnerLabCount || 'new'} mission tracks while newsletter automation maintains cadence.`;
  }, [ras, rasCompositeDisplay, rasLeadComponent, partnerLabCount]);

  const automationLine = useMemo(() => {
    const bits = [
      (ras as any)?.calculated_at ? `RAS calc ${new Date((ras as any).calculated_at).toLocaleString('en-US', { hour12: false })}` : null,
      (newsletterStatus as any)?.generated_at ? `Comms ${new Date((newsletterStatus as any).generated_at).toLocaleTimeString('en-US', { hour12: false })}` : null,
      (scenarioPrompts as any)?.generated_at ? `Scenarios refreshed ${new Date((scenarioPrompts as any).generated_at).toLocaleDateString('en-US')}` : null
    ].filter(Boolean);
    return bits.join(' • ');
  }, [ras, newsletterStatus, scenarioPrompts]);

  const partnerSummary = (partnerLabs as any)?.summary;
  const scenarioStats = (scenarioPrompts as any)?.summary;
  const participationRate =
    typeof scenarioStats?.participation_rate === 'number'
      ? `${(scenarioStats.participation_rate * 100).toFixed(1)}%`
      : '0%';
  const statusBreakdown = (submissionsSummary as any)?.status_breakdown || {};
  const scenarioFeatured = (scenarioPrompts as any)?.current_prompts?.[0];

  const rasStyling = getRiskStyling(rasComposite);

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              RRIO INTELLIGENCE HUB
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              Community-driven resilience intelligence and mission coordination
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {automationLine || 'Automation telemetry warming up • Source: RRIO automation layer'}
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          Status: <span className="text-emerald-600">OPERATIONAL</span>
        </div>
      </div>

      {/* Bloomberg-style editorial narrative */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold text-slate-900 uppercase tracking-wide">
                OPERATIONAL INTELLIGENCE BRIEF
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Real-time mission coordination and resilience activation status
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-mono leading-relaxed text-slate-900 mb-4">
            {rasNarrative}
          </p>
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-center">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
                RAS Composite
              </div>
              <div className={`text-lg font-mono font-bold ${rasStyling.textColor}`}>
                {rasCompositeDisplay}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
                Mission Status
              </div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {rasStyling.level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            RAS Composite
          </div>
          <div className={`text-2xl font-mono font-bold mb-1 ${rasStyling.textColor}`}>
            {rasCompositeDisplay}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            {rasStyling.level}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Submissions
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {(submissionsSummary as any)?.total_submissions ?? '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Total
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Partner Labs
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {partnerLabCount || '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Active
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Participation
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {participationRate}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Rate
          </div>
        </div>
      </div>

      {/* RAS Components */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-mono font-semibold text-slate-900 mb-1">
            RESILIENCE ACTIVATION COMPONENTS
          </h3>
          <p className="text-sm font-mono text-slate-500">
            Component breakdown and activation scoring
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {(ras as any)?.components &&
              Object.entries((ras as any).components).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                  <span className="font-mono font-semibold text-slate-900">{name}</span>
                  <span className="font-mono text-slate-600">{(value as number)?.toFixed(2)}</span>
                </div>
              ))}
            {!(ras as any)?.components && (
              <div className="text-center text-slate-500 font-mono text-sm py-4">
                No RAS component data available
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono text-slate-500">
            Updated {(ras as any)?.calculated_at ?? 'pending'} • Composite {rasCompositeDisplay}
          </div>
        </div>
      </div>

      {/* Mission sections */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Newsletter Automation */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                NEWSLETTER AUTOMATION
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Automated intelligence briefing distribution
            </p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-600">Daily Flash</span>
              <span className="font-mono text-xs text-slate-500">
                {(newsletterStatus as any)?.daily_flash?.next_scheduled ?? 'pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-600">Weekly Wrap</span>
              <span className="font-mono text-xs text-slate-500">
                {(newsletterStatus as any)?.weekly_wrap?.next_scheduled ?? 'pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-600">Subscribers</span>
              <span className="font-mono text-sm font-semibold text-slate-900">
                {(newsletterStatus as any)?.subscription_metrics?.active_subscribers ?? '--'}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono text-slate-500">
              Automation: {(newsletterStatus as any)?.daily_flash?.automation?.enabled ? 'ENABLED' : 'MANUAL'}
            </div>
          </div>
        </div>

        {/* Scenario Studio */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                SCENARIO STUDIO
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Active research prompts and community scenarios
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3 mb-4">
              {(scenarioPrompts as any)?.current_prompts?.slice(0, 3).map((prompt: any) => (
                <div key={prompt.id} className="flex justify-between items-start gap-2">
                  <span className="font-mono text-sm text-slate-600 flex-1">{prompt.title}</span>
                  <span className="font-mono text-xs text-slate-500 whitespace-nowrap">
                    {prompt.deadline}
                  </span>
                </div>
              )) || (
                <div className="text-center text-slate-500 font-mono text-sm py-2">
                  No active prompts
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-500">
                Participation: {participationRate}
              </div>
              <button
                type="button"
                className="px-3 py-2 bg-pink-600 text-white text-xs font-mono rounded hover:bg-pink-700 transition-colors"
              >
                Launch Studio
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                PARTNER LABS
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Active research partnerships and collaborations
            </p>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm font-mono text-slate-600">
              {(partnerLabs as any)?.partner_labs?.slice(0, 5).map((lab: any) => (
                <li key={lab.id} className="flex justify-between items-center">
                  <span>{lab.name} ({lab.sector})</span>
                  <span className="text-xs text-slate-500 uppercase">{lab.status}</span>
                </li>
              )) || <li>No partner lab data.</li>}
            </ul>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                FEATURED MISSION
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Spotlight on current mission initiatives
            </p>
          </div>
          <div className="p-4">
            <MissionHighlight
              title="Insight Fellowship Cohort"
              description="Ethical AI & predictive resilience projects, publishing Bloomberg-grade briefs with semantic color narratives."
            />
          </div>
        </div>
      </section>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              PARTNER NETWORK COVERAGE
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Global research network statistics
          </p>
        </div>
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-3 text-sm font-mono">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Active Labs</p>
              <p className="text-lg font-semibold text-slate-900">{partnerSummary?.active_labs ?? '--'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Sectors Covered</p>
              <p className="text-lg font-semibold text-slate-900">{partnerSummary?.sectors_covered ?? '--'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Total Projects</p>
              <p className="text-lg font-semibold text-slate-900">{partnerSummary?.total_projects ?? '--'}</p>
            </div>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-3">
            Generated {(partnerLabs as any)?.generated_at ?? 'pending'} • Source `/community/partner-labs`.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              COMMUNITY METRICS
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Submission pipeline and engagement statistics
          </p>
        </div>
        <div className="p-4">
          <ul className="text-sm font-mono text-slate-600 space-y-2">
            <li className="flex justify-between items-center">
              <span>Recent submissions (30d)</span>
              <span className="font-semibold">{(submissionsSummary as any)?.recent_submissions_30d ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Pending review</span>
              <span className="font-semibold">{(submissionsSummary as any)?.pending_review ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Approval rate</span>
              <span className="font-semibold">{((submissionsSummary as any)?.approval_rate ?? 0) * 100}%</span>
            </li>
          </ul>
          <div className="mt-6">
            <h3 className="text-xs uppercase text-slate-500 font-mono mb-2">Pipeline Ledger</h3>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-sm font-mono">
              {Object.entries(statusBreakdown).length > 0 ? (
                Object.entries(statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between px-4 py-2">
                    <span className="capitalize text-slate-600">{status}</span>
                    <span className="text-slate-900 font-semibold">{count as number}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500">No ledger entries yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <h3 className="font-mono font-semibold text-slate-900">
              RAS MOMENTUM
            </h3>
          </div>
          <p className="text-sm font-mono text-slate-500">
            Real-time Adaptive Systems performance tracking
          </p>
        </div>
        <div className="p-4">
          <LazyChart
            type="zscore"
            data={(rasHistory as any)?.history?.map((entry: any) => ({
              timestamp: entry.calculated_at.split('T')[0],
              z_score: (entry.composite - 0.5) / 0.2, // Convert RAS composite to z-score scale
              component: 'RAS'
            })) || [
              { timestamp: '2024-10-01', z_score: 0.6, component: 'RAS' },
              { timestamp: '2024-10-15', z_score: 0.7, component: 'RAS' },
              { timestamp: '2024-11-01', z_score: 0.68, component: 'RAS' },
              { timestamp: '2024-11-15', z_score: 0.72, component: 'RAS' },
            ]}
            component="RAS"
          />
          <p className="mt-3 text-xs font-mono text-slate-500">
            {rasHistory ? `Live RAS momentum from ${(rasHistory as any)?.history?.length || 0} data points` : 'Loading RAS history data...'}
          </p>
        </div>
      </div>

      <p className="text-xs font-mono text-slate-500 mt-6">
        RRIO authenticity tape: {automationLine || 'Mission signals pending data load.'}
      </p>
    </div>
  );
}
