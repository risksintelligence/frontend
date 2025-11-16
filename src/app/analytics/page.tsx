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
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytics Suite</h1>
        <p className="text-gray-600 font-mono text-sm">
          Deep dive into GERII methodology, historical patterns, and predictive intelligence
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {analyticsModules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{module.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {module.description}
                </p>
                <ul className="space-y-1">
                  {module.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">API Access</h2>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex items-center gap-2">
            <span className="text-green-600">GET</span>
            <code className="bg-gray-100 px-2 py-1 rounded">/api/v1/analytics/geri</code>
            <span className="text-gray-600">Current GERII score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">GET</span>
            <code className="bg-gray-100 px-2 py-1 rounded">/api/v1/analytics/geri/history</code>
            <span className="text-gray-600">Historical data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">GET</span>
            <code className="bg-gray-100 px-2 py-1 rounded">/api/v1/analytics/components</code>
            <span className="text-gray-600">Component breakdown</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Full API documentation: <Link href="/transparency" className="text-blue-600 hover:underline">Transparency Portal</Link>
        </p>
      </div>
    </div>
  );
}