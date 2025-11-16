'use client';

import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';
import LazyChart from '../../../components/lazy-chart';

export default function HistoryPage() {
  const { data: geri } = useMemoizedApi('geri', () => api.getGeri());
  // Component data will be available from the history endpoint

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">GERII Historical Analysis</h1>
        <p className="text-gray-600 font-mono text-sm">
          Historical trends, crisis events, and long-term resilience patterns
        </p>
      </div>

      {/* GERII Time Series */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">GERII Score Over Time</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Historical data endpoint not yet implemented.</p>
            <p className="text-xs mt-2">Backend endpoint: <code>/api/v1/analytics/geri/history</code></p>
            <p className="text-xs">Current GERII: <strong>{geri?.score || 'Loading...'}</strong></p>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 uppercase">Period</div>
              <div className="text-sm font-mono">30 days</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Data Points</div>
              <div className="text-sm font-mono">150</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Last Updated</div>
              <div className="text-sm font-mono">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Coverage</div>
              <div className="text-sm font-mono">8 components</div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Contributions */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Component Evolution</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Component history data not yet available.</p>
            <p className="text-xs mt-2">Will be available when <code>/api/v1/analytics/geri/history</code> returns component data.</p>
            <p className="text-xs">Current drivers available from: <code>/api/v1/analytics/geri</code></p>
          </div>
        </div>
      </section>

      {/* Notable Events */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Notable Events</h2>
          <div className="space-y-4">
            {[
              {
                date: '2024-01-15',
                event: 'GERII spike to 78 (High Risk)',
                description: 'Credit spread widening amid banking sector stress',
                impact: '+12 points',
                color: '#FFAB00'
              },
              {
                date: '2024-01-08',
                event: 'Supply chain disruption',
                description: 'Freight costs surge due to Red Sea shipping delays',
                impact: '+8 points',
                color: '#0277BD'
              },
              {
                date: '2023-12-20',
                event: 'Market stabilization',
                description: 'VIX decline following Fed policy clarity',
                impact: '-15 points',
                color: '#00C853'
              }
            ].map((event, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{event.event}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{event.impact}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Reference */}
      <section>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Methodology</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">Normalization</h3>
              <p className="text-xs text-gray-600">5-year rolling z-scores with directional adjustments</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Weighting</h3>
              <p className="text-xs text-gray-600">Regime-adaptive weights with confidence thresholds</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Aggregation</h3>
              <p className="text-xs text-gray-600">Weighted sum scaled to 0-100 with saturation controls</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>Full methodology: docs/methodology/geri_v1_methodology.md</p>
          </div>
        </div>
      </section>
    </div>
  );
}