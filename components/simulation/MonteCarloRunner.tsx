import React, { useState } from 'react';
import { Play, Settings, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { MonteCarloConfig, MonteCarloResult } from '../../types/simulation';

interface MonteCarloRunnerProps {
  apiUrl: string;
  onResultsReady?: (results: MonteCarloResult) => void;
}

export const MonteCarloRunner: React.FC<MonteCarloRunnerProps> = ({
  apiUrl,
  onResultsReady
}) => {
  const { runMonteCarloSimulation, loading, error, clearError } = useSimulation(apiUrl);
  
  const [config, setConfig] = useState<MonteCarloConfig>({
    iterations: 10000,
    confidenceLevel: 0.95,
    timeHorizon: 365,
    shockType: 'economic',
    shockMagnitude: 2.0
  });

  const [results, setResults] = useState<MonteCarloResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleConfigChange = (field: keyof MonteCarloConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const runSimulation = async () => {
    try {
      clearError();
      const result = await runMonteCarloSimulation(config);
      setResults(result);
      onResultsReady?.(result);
    } catch (err) {
      console.error('Monte Carlo simulation failed:', err);
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile < 5) return 'text-red-600 bg-red-50';
    if (percentile < 25) return 'text-orange-600 bg-orange-50';
    if (percentile < 75) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  const formatRiskScore = (score: number) => {
    return score.toFixed(2);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monte Carlo Simulation</h3>
                <p className="text-sm text-gray-600">
                  Risk scenario analysis using statistical modeling
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              <span>{showAdvanced ? 'Basic' : 'Advanced'}</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Basic Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Iterations
              </label>
              <input
                type="number"
                min="1000"
                max="100000"
                step="1000"
                value={config.iterations}
                onChange={(e) => handleConfigChange('iterations', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">1,000 - 100,000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Level
              </label>
              <select
                value={config.confidenceLevel}
                onChange={(e) => handleConfigChange('confidenceLevel', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.90}>90%</option>
                <option value={0.95}>95%</option>
                <option value={0.99}>99%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Horizon (days)
              </label>
              <input
                type="number"
                min="30"
                max="1095"
                value={config.timeHorizon}
                onChange={(e) => handleConfigChange('timeHorizon', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">30 - 1,095 days</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shock Type
              </label>
              <select
                value={config.shockType}
                onChange={(e) => handleConfigChange('shockType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="economic">Economic Shock</option>
                <option value="financial">Financial Crisis</option>
                <option value="supply_chain">Supply Chain Disruption</option>
                <option value="geopolitical">Geopolitical Event</option>
              </select>
            </div>

            {showAdvanced && (
              <div className="md:col-span-2 lg:col-span-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shock Magnitude (standard deviations)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={config.shockMagnitude}
                      onChange={(e) => handleConfigChange('shockMagnitude', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">0.5 - 5.0 σ</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Estimated runtime: {Math.ceil(config.iterations / 1000)} seconds
            </div>
            <button
              onClick={runSimulation}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>{loading ? 'Running Simulation...' : 'Run Monte Carlo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Simulation Results</h3>
              <div className="text-sm text-gray-600 mt-1">
                Completed {results.config.iterations.toLocaleString()} iterations in {results.executionTime}ms
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className={`p-4 rounded-lg border ${getPercentileColor(5)}`}>
                  <div className="text-sm font-medium">5th Percentile</div>
                  <div className="text-lg font-bold">{formatRiskScore(results.results.percentile_5)}</div>
                </div>
                <div className={`p-4 rounded-lg border ${getPercentileColor(25)}`}>
                  <div className="text-sm font-medium">25th Percentile</div>
                  <div className="text-lg font-bold">{formatRiskScore(results.results.percentile_25)}</div>
                </div>
                <div className={`p-4 rounded-lg border ${getPercentileColor(50)}`}>
                  <div className="text-sm font-medium">Median (50th)</div>
                  <div className="text-lg font-bold">{formatRiskScore(results.results.percentile_50)}</div>
                </div>
                <div className={`p-4 rounded-lg border ${getPercentileColor(75)}`}>
                  <div className="text-sm font-medium">75th Percentile</div>
                  <div className="text-lg font-bold">{formatRiskScore(results.results.percentile_75)}</div>
                </div>
                <div className={`p-4 rounded-lg border ${getPercentileColor(95)}`}>
                  <div className="text-sm font-medium">95th Percentile</div>
                  <div className="text-lg font-bold">{formatRiskScore(results.results.percentile_95)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Central Tendency</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mean:</span>
                      <span className="font-medium">{formatRiskScore(results.results.mean)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Standard Deviation:</span>
                      <span className="font-medium">{formatRiskScore(results.results.stdDev)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Extreme Values</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best Case:</span>
                      <span className="font-medium text-green-600">{formatRiskScore(results.results.bestCase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst Case:</span>
                      <span className="font-medium text-red-600">{formatRiskScore(results.results.worstCase)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Convergence Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Converged:</span>
                      <span className={`font-medium ${results.convergenceAnalysis.converged ? 'text-green-600' : 'text-red-600'}`}>
                        {results.convergenceAnalysis.converged ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stability Score:</span>
                      <span className="font-medium">{results.convergenceAnalysis.stabilityScore.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Visualization */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Risk Distribution</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">Distribution chart would render here</div>
                  <div className="text-sm text-gray-500">
                    Showing {results.iterations.length.toLocaleString()} data points
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Table */}
          {showAdvanced && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Iteration Results</h3>
                <p className="text-sm text-gray-600">First 100 iterations</p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Iteration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GDP Impact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inflation Impact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unemployment Impact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.iterations.slice(0, 100).map((iteration, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {iteration.iteration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatRiskScore(iteration.riskScore)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(iteration.gdpImpact)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(iteration.inflationImpact)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPercentage(iteration.unemploymentImpact)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};