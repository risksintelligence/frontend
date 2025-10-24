'use client'

import React, { useState } from 'react'

export default function StressTestingPage() {
  const [selectedTest, setSelectedTest] = useState('credit')
  const [scenario, setScenario] = useState('severe')
  const [parameters, setParameters] = useState({
    capitalRatio: 12.5,
    liquidity: 85.0,
    creditLoss: 3.2,
    marketShock: 15.0
  })

  const stressTests = [
    {
      id: 'credit',
      name: 'Credit Risk Stress Test',
      description: 'Assess portfolio resilience to credit deterioration',
      metrics: ['Default Rate', 'Loss Given Default', 'Credit VaR']
    },
    {
      id: 'market',
      name: 'Market Risk Stress Test',
      description: 'Evaluate impact of adverse market movements',
      metrics: ['Price Volatility', 'Correlation Breakdown', 'Liquidity Risk']
    },
    {
      id: 'liquidity',
      name: 'Liquidity Stress Test',
      description: 'Test funding and market liquidity under stress',
      metrics: ['Funding Gap', 'Liquidity Coverage', 'Cash Flow Analysis']
    },
    {
      id: 'operational',
      name: 'Operational Risk Stress Test',
      description: 'Assess operational resilience and continuity',
      metrics: ['System Downtime', 'Process Failures', 'Recovery Time']
    }
  ]

  const scenarios = [
    { id: 'mild', name: 'Mild Stress', multiplier: 1.2, color: 'text-yellow-600' },
    { id: 'moderate', name: 'Moderate Stress', multiplier: 1.8, color: 'text-orange-600' },
    { id: 'severe', name: 'Severe Stress', multiplier: 2.5, color: 'text-red-600' },
    { id: 'extreme', name: 'Extreme Stress', multiplier: 3.2, color: 'text-red-800' }
  ]

  const results = {
    credit: {
      baseCase: { ratio: 12.5, losses: 850, coverage: 94.2 },
      stressed: { ratio: 8.3, losses: 2750, coverage: 78.5 },
      breach: false
    },
    market: {
      baseCase: { var: 125, returns: 8.4, volatility: 16.2 },
      stressed: { var: 485, returns: -12.8, volatility: 45.7 },
      breach: true
    },
    liquidity: {
      baseCase: { ratio: 140, gap: 0, buffer: 2.8 },
      stressed: { ratio: 95, gap: 1.2, buffer: 0.9 },
      breach: false
    },
    operational: {
      baseCase: { uptime: 99.9, incidents: 2, recovery: 15 },
      stressed: { uptime: 97.2, incidents: 12, recovery: 180 },
      breach: true
    }
  }

  const historicalTests = [
    {
      date: '2024-10-20',
      type: 'Comprehensive CCAR',
      scenario: 'Severe Recession',
      result: 'Pass',
      breaches: 0,
      minRatio: 9.2
    },
    {
      date: '2024-09-15',
      type: 'Market Shock Test',
      scenario: 'Credit Spread Widening',
      result: 'Conditional Pass',
      breaches: 1,
      minRatio: 7.8
    },
    {
      date: '2024-08-30',
      type: 'Liquidity Test',
      scenario: 'Funding Stress',
      result: 'Pass',
      breaches: 0,
      minRatio: 11.4
    },
    {
      date: '2024-07-25',
      type: 'Operational Resilience',
      scenario: 'Cyber Attack',
      result: 'Pass',
      breaches: 0,
      minRatio: 10.1
    }
  ]

  const currentTest = stressTests.find(test => test.id === selectedTest)
  const currentScenario = scenarios.find(s => s.id === scenario)
  const currentResults = results[selectedTest as keyof typeof results]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Financial System Stress Testing
          </h1>
          <p className="text-lg text-[#374151]">
            Evaluate financial resilience under adverse scenarios and regulatory requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Tests</h3>
            <p className="text-3xl font-bold text-[#374151]">247</p>
            <p className="text-sm text-gray-500">This quarter</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Pass Rate</h3>
            <p className="text-3xl font-bold text-green-600">89.5%</p>
            <p className="text-sm text-gray-500">Regulatory compliance</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Min Capital Ratio</h3>
            <p className="text-3xl font-bold text-[#374151]">7.2%</p>
            <p className="text-sm text-gray-500">Worst case scenario</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Recovery Time</h3>
            <p className="text-3xl font-bold text-[#374151]">18 months</p>
            <p className="text-sm text-gray-500">Average recovery period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Stress Test Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Test Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stressTests.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTest === test.id
                            ? 'border-[#1e3a8a] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <h3 className="font-medium text-[#1e3a8a] mb-1">{test.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {test.metrics.map((metric) => (
                            <span
                              key={metric}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Stress Scenario</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {scenarios.map((s) => (
                      <button
                        key={s.id}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          scenario === s.id
                            ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setScenario(s.id)}
                      >
                        <div className={`font-medium ${s.color}`}>{s.name}</div>
                        <div className="text-sm text-gray-600">{s.multiplier}x</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Test Parameters</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Capital Ratio (%)</label>
                      <input
                        type="number"
                        value={parameters.capitalRatio}
                        onChange={(e) => setParameters({...parameters, capitalRatio: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Liquidity Ratio (%)</label>
                      <input
                        type="number"
                        value={parameters.liquidity}
                        onChange={(e) => setParameters({...parameters, liquidity: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Credit Loss Rate (%)</label>
                      <input
                        type="number"
                        value={parameters.creditLoss}
                        onChange={(e) => setParameters({...parameters, creditLoss: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Market Shock (%)</label>
                      <input
                        type="number"
                        value={parameters.marketShock}
                        onChange={(e) => setParameters({...parameters, marketShock: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Run Stress Test
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">
                {currentTest?.name} Results - {currentScenario?.name}
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-[#374151] mb-3">Base Case</h3>
                  <div className="space-y-2">
                    {selectedTest === 'credit' && currentResults.baseCase && 'ratio' in currentResults.baseCase && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Capital Ratio:</span>
                          <span className="text-sm font-medium">{currentResults.baseCase.ratio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Credit Losses:</span>
                          <span className="text-sm font-medium">${(currentResults.baseCase as any).losses}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Coverage:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).coverage}%</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'market' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">VaR (95%):</span>
                          <span className="text-sm font-medium">${(currentResults.baseCase as any).var}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Returns:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).returns}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Volatility:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).volatility}%</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'liquidity' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">LCR:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).ratio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Funding Gap:</span>
                          <span className="text-sm font-medium">${(currentResults.baseCase as any).gap}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Buffer:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).buffer}B</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'operational' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Uptime:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).uptime}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Incidents:</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).incidents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Recovery (min):</span>
                          <span className="text-sm font-medium">{(currentResults.baseCase as any).recovery}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#374151] mb-3">Stressed Case</h3>
                  <div className="space-y-2">
                    {selectedTest === 'credit' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Capital Ratio:</span>
                          <span className="text-sm font-medium text-orange-600">{(currentResults.stressed as any).ratio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Credit Losses:</span>
                          <span className="text-sm font-medium text-red-600">${(currentResults.stressed as any).losses}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Coverage:</span>
                          <span className="text-sm font-medium text-orange-600">{(currentResults.stressed as any).coverage}%</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'market' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">VaR (95%):</span>
                          <span className="text-sm font-medium text-red-600">${(currentResults.stressed as any).var}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Returns:</span>
                          <span className="text-sm font-medium text-red-600">{(currentResults.stressed as any).returns}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Volatility:</span>
                          <span className="text-sm font-medium text-red-600">{(currentResults.stressed as any).volatility}%</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'liquidity' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">LCR:</span>
                          <span className="text-sm font-medium text-orange-600">{(currentResults.stressed as any).ratio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Funding Gap:</span>
                          <span className="text-sm font-medium text-red-600">${(currentResults.stressed as any).gap}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Buffer:</span>
                          <span className="text-sm font-medium text-orange-600">{(currentResults.stressed as any).buffer}B</span>
                        </div>
                      </>
                    )}
                    {selectedTest === 'operational' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Uptime:</span>
                          <span className="text-sm font-medium text-red-600">{(currentResults.stressed as any).uptime}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Incidents:</span>
                          <span className="text-sm font-medium text-red-600">{(currentResults.stressed as any).incidents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Recovery (min):</span>
                          <span className="text-sm font-medium text-red-600">{(currentResults.stressed as any).recovery}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#374151] mb-3">Assessment</h3>
                  <div className="space-y-3">
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentResults.breach 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {currentResults.breach ? 'Regulatory Breach' : 'Within Limits'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-2">Risk Level:</div>
                      <div className={`px-2 py-1 rounded text-xs ${currentScenario?.color} bg-gray-100`}>
                        {currentScenario?.name}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">Recovery Estimate:</div>
                      <div className="font-medium text-[#374151]">
                        {selectedTest === 'market' ? '24 months' : '18 months'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Test History</h2>
              <div className="space-y-4">
                {historicalTests.map((test, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#374151]">{test.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        test.result === 'Pass' 
                          ? 'bg-green-100 text-green-800'
                          : test.result === 'Conditional Pass'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.result}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{test.scenario}</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{test.date}</span>
                      <span className="text-[#374151]">Min: {test.minRatio}%</span>
                    </div>
                    {test.breaches > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        {test.breaches} breach{test.breaches > 1 ? 'es' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Regulatory Framework</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#374151] mb-2">CCAR Requirements</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tier 1 Capital Ratio: ≥ 4.5%</li>
                    <li>• Common Equity Tier 1: ≥ 4.5%</li>
                    <li>• Tier 1 Leverage Ratio: ≥ 4.0%</li>
                    <li>• Total Capital Ratio: ≥ 8.0%</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-[#374151] mb-2">Basel III Standards</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Liquidity Coverage Ratio: ≥ 100%</li>
                    <li>• Net Stable Funding Ratio: ≥ 100%</li>
                    <li>• Leverage Ratio: ≥ 3%</li>
                    <li>• Capital Conservation Buffer: 2.5%</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-[#374151] mb-2">Stress Scenarios</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Severely Adverse Economic Scenario</li>
                    <li>• Adverse Economic Scenario</li>
                    <li>• Global Market Shock</li>
                    <li>• Counterparty Default</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}