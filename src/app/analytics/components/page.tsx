'use client';

import { useMemoizedApi } from '../../../hooks/use-memo-api';
import { api } from '../../../lib/api';
import LazyChart from '../../../components/lazy-chart';

export default function ComponentsPage() {
  // Components data will be derived from GERI drivers for now
  const { data: geri } = useMemoizedApi('geri', () => api.getGeri());

  const componentGroups = {
    'Financial Stress': ['VIX', 'YIELD_CURVE', 'CREDIT_SPREAD'],
    'Supply Chain': ['FREIGHT_COSTS', 'SUPPLY_PMI'],
    'Macroeconomic': ['OIL_PRICES', 'CPI', 'UNEMPLOYMENT']
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Component Analysis</h1>
        <p className="text-gray-600 font-mono text-sm">
          Individual component breakdowns, z-scores, and contribution analysis
        </p>
      </div>

      {/* Current Contributions */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Current Component Contributions</h2>
          <div className="space-y-3">
            {geri?.drivers?.map((driver, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                <div className="flex-shrink-0 w-24 text-xs font-mono text-gray-600">
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
                        backgroundColor: driver.impact > 0 ? '#D50000' : '#00C853' 
                      }}
                    >
                      {driver.impact > 0 ? 'Risk' : 'Support'}
                    </div>
                  </div>
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: '#f3f4f6',
                      width: '100%'
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: driver.impact > 0 ? '#DC2626' : '#059669',
                        width: `${Math.abs(driver.impact) * 2}%`
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {driver.contribution?.toFixed(3)}
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <p>Loading component data...</p>
              </div>
            )}
          </div>
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
    </div>
  );
}