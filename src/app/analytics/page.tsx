'use client';

import Link from 'next/link';

const analyticsModules = [
  {
    title: 'GERII History',
    href: '/analytics/history',
    description: 'Historical GERII scores, trends, and notable events',
    icon: '📈',
    features: ['Time series analysis', 'Crisis event markers', 'Regime transitions']
  },
  {
    title: 'Component Analysis',
    href: '/analytics/components',
    description: 'Individual component breakdowns and contributions',
    icon: '🔍',
    features: ['Z-score analysis', 'Component correlations', 'Provider attribution']
  },
  {
    title: 'Regime Detection',
    href: '/analytics/regimes',
    description: 'Economic regime classification and transition analysis',
    icon: '🎯',
    features: ['Regime probabilities', 'Transition matrices', 'Historical patterns']
  },
  {
    title: 'Forecasting',
    href: '/analytics/forecasts',
    description: 'Prediction models, accuracy metrics, and scenario analysis',
    icon: '🔮',
    features: ['24-hour forecasts', 'Model performance', 'SHAP explanations']
  }
];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Analytics Suite Overview">
        <div>
          <p className="hero-eyebrow">RRIO Analytics</p>
          <h1 className="hero-title">GERII Intelligence Modules</h1>
          <p className="hero-subtitle">
            Deep dive into historical trajectories, regime classifications, and predictive engines with semantic provenance.
          </p>
          <ul className="hero-bullets">
            <li>Semantic color codes for risk bands, anomalies, and mission artifacts</li>
            <li>Integrated with Transparency Portal for provenance logs</li>
            <li>Supports award-grade briefs referencing API payloads</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Modules Available</p>
          <p className="hero-metric-value">{analyticsModules.length}</p>
          <p className="hero-metric-footnote">History, Components, Regimes, Forecasts</p>
        </div>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {analyticsModules.map((module) => (
          <Link key={module.href} href={module.href} className="panel group transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-2xl">{module.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#1e3a8a] transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-terminal-muted mb-3">{module.description}</p>
                <ul className="space-y-1">
                  {module.features.map((feature, index) => (
                    <li key={index} className="text-xs text-terminal-muted flex items-center">
                      <span className="w-1 h-1 bg-[#94a3b8] rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-[#94a3b8] group-hover:text-[#1e3a8a] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12 panel">
        <h2 className="section-label">API Access</h2>
        <div className="space-y-3 text-sm font-mono mt-3">
          <div className="flex items-center gap-2">
            <span className="text-risk-minimal">GET</span>
            <code className="px-2 py-1 rounded bg-[#f1f5f9]">/api/v1/analytics/geri</code>
            <span className="text-terminal-muted">Current GRII score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-risk-moderate">GET</span>
            <code className="px-2 py-1 rounded bg-[#f1f5f9]">/api/v1/analytics/geri/history</code>
            <span className="text-terminal-muted">Historical data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-risk-minimal">GET</span>
            <code className="px-2 py-1 rounded bg-[#f1f5f9]">/api/v1/analytics/components</code>
            <span className="text-terminal-muted">Component breakdown</span>
          </div>
        </div>
        <p className="text-xs text-terminal-muted mt-4">
          Full API documentation: <Link href="/transparency" className="text-[#1e3a8a] underline">Transparency Portal</Link>
        </p>
      </section>
    </main>
  );
}
