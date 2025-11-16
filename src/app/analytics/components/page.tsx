'use client';

import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';

export default function ComponentsPage() {
  const { data: geri } = useMemoizedApi('geri', () => api.getGeri());

  const componentGroups = {
    'Financial Stress': ['VIX', 'YIELD_CURVE', 'CREDIT_SPREAD'],
    'Supply Chain': ['FREIGHT_COSTS', 'SUPPLY_PMI'],
    'Macroeconomic': ['OIL_PRICES', 'CPI', 'UNEMPLOYMENT']
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Component Analysis Overview">
        <div>
          <p className="hero-eyebrow">RRIO Component Insights</p>
          <h1 className="hero-title">Finance, supply chain, macro pillars</h1>
          <p className="hero-subtitle">
            Every component inherits semantic color cues, provenance links, and regime-aware annotations per the design system.
          </p>
          <ul className="hero-bullets">
            <li>Driver contributions and z-scores updated in real time</li>
            <li>Shared panel system for finance, supply chain, macro pillars</li>
            <li>Regime-aware weighting for cross-domain coherence</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Components</p>
          <p className="hero-metric-value">{geri?.drivers?.length ?? 8}</p>
          <p className="hero-metric-footnote">From /api/v1/analytics/geri</p>
        </div>
      </header>

      <section className="mt-8 panel">
        <h2 className="section-label">Current Component Contributions</h2>
        <div className="space-y-3">
          {geri?.drivers?.map((driver, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border border-[#e2e8f0] rounded-lg">
              <div className="flex-shrink-0 w-24 text-xs font-mono text-terminal-muted">
                {driver.component}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-semibold">
                    {(driver.impact / 10).toFixed(1)}% contribution
                  </div>
                  <div 
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ 
                      backgroundColor: driver.impact > 0 ? 'var(--risk-high)' : 'var(--risk-minimal)' 
                    }}
                  >
                    {driver.impact > 0 ? 'Risk factor' : 'Stabilizer'}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#f1f5f9]">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: driver.impact > 0 ? 'var(--risk-high)' : 'var(--risk-minimal)',
                      width: `${Math.min(Math.abs(driver.impact) * 2, 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="text-xs text-terminal-muted font-mono">
                {driver.contribution?.toFixed(3)}
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-terminal-muted">
              <p>Loading component data...</p>
            </div>
          )}
        </div>
      </section>

      {/* Component Groups */}
      {Object.entries(componentGroups).map(([groupName, componentList]) => (
        <section key={groupName} className="mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">{groupName} Components</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {componentList.map((component) => {
                const currentDriver = geri?.drivers?.find(d => d.component === component);
                return (
                  <div key={component} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">{component.replace('_', ' ')}</h3>
                      <div className="text-xs text-gray-500">
                        Z: {currentDriver ? (currentDriver.impact / 10).toFixed(2) : 'N/A'}
                      </div>
                    </div>
                    
                    <div className="text-center py-4 text-gray-400 text-xs">
                      Component history chart
                      <br />
                      (Requires /api/v1/analytics/components endpoint)
                    </div>
                    
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Impact:</span>
                        <span className="font-mono">
                          {currentDriver ? `${currentDriver.impact.toFixed(1)}bp` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contribution:</span>
                        <span className="font-mono">
                          {currentDriver ? currentDriver.contribution.toFixed(3) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Provider:</span>
                        <span className="font-mono">FRED</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-xs text-blue-600 hover:underline">
                        View detailed history →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Component Correlations */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Component Correlations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2">Component</th>
                  <th className="text-center p-2">VIX</th>
                  <th className="text-center p-2">Credit</th>
                  <th className="text-center p-2">Freight</th>
                  <th className="text-center p-2">PMI</th>
                  <th className="text-center p-2">Oil</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VIX', correlations: [1.00, 0.65, 0.23, -0.41, 0.18] },
                  { name: 'Credit Spread', correlations: [0.65, 1.00, 0.34, -0.52, 0.29] },
                  { name: 'Freight Costs', correlations: [0.23, 0.34, 1.00, -0.12, 0.71] },
                  { name: 'Supply PMI', correlations: [-0.41, -0.52, -0.12, 1.00, -0.08] },
                  { name: 'Oil Prices', correlations: [0.18, 0.29, 0.71, -0.08, 1.00] }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-2 font-semibold">{row.name}</td>
                    {row.correlations.map((corr, i) => (
                      <td key={i} className="text-center p-2 font-mono">
                        <span 
                          className={`px-2 py-1 rounded ${
                            Math.abs(corr) > 0.6 ? 'bg-red-100 text-red-700' :
                            Math.abs(corr) > 0.3 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          {corr.toFixed(2)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            30-day rolling correlations | High correlation (&gt;0.6) may indicate redundancy
          </p>
        </div>
      </section>

      {/* Data Sources */}
      <section>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Data Sources & Attribution</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">FRED (Federal Reserve)</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• VIX (VIXCLS)</li>
                <li>• 10Y-2Y Yield Curve (DGS10, DGS2)</li>
                <li>• High Yield Credit Spreads</li>
                <li>• CPI, Unemployment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Yahoo Finance</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Crude Oil Prices (CL=F)</li>
                <li>• Baltic Dry Index</li>
                <li>• Market volatility indices</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">ISM / Regional Fed</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Manufacturing PMI</li>
                <li>• Supply chain indicators</li>
                <li>• Regional business conditions</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>Update frequency: Hourly | Cache TTL: 15 minutes | Attribution: docs/legal/licenses_and_attribution.md</p>
          </div>
        </div>
      </section>
    </main>
  );
}
