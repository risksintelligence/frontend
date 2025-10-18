import React, { useState } from 'react';
import { GitCompare, TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationHistory, SimulationComparison as SimulationComparisonType } from '../../types/simulation';

interface SimulationComparisonProps {
  apiUrl: string;
  availableSimulations: SimulationHistory[];
}

export const SimulationComparison: React.FC<SimulationComparisonProps> = ({
  apiUrl,
  availableSimulations
}) => {
  const { compareSimulations, loading, error, clearError } = useSimulation(apiUrl);
  
  const [baselineId, setBaselineId] = useState<string>('');
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<SimulationComparisonType | null>(null);

  const handleComparisonChange = (simulationId: string, checked: boolean) => {
    if (checked) {
      setComparisonIds(prev => [...prev, simulationId]);
    } else {
      setComparisonIds(prev => prev.filter(id => id !== simulationId));
    }
  };

  const runComparison = async () => {
    if (!baselineId || comparisonIds.length === 0) return;
    
    try {
      const results = await compareSimulations([baselineId, ...comparisonIds]);
      setComparisonResults(results);
    } catch (err) {
      console.error('Comparison failed:', err);
    }
  };

  const exportComparison = async () => {
    if (!comparisonResults) return;
    
    const data = {
      comparison: comparisonResults,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation_comparison_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4" />;
  };

  const getChangeColor = (change: number) => {
    if (Math.abs(change) < 0.01) return 'text-gray-600';
    return change > 0 ? 'text-red-600' : 'text-green-600';
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getSimulationName = (id: string) => {
    const simulation = availableSimulations.find(sim => sim.id === id);
    return simulation ? simulation.name : `Simulation ${id.slice(0, 8)}`;
  };

  const completedSimulations = availableSimulations.filter(sim => sim.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Comparison Setup */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <GitCompare className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Simulation Comparison</h3>
              <p className="text-sm text-gray-600">
                Compare simulation results across different scenarios
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {completedSimulations.length < 2 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Insufficient Data</h3>
              <p className="text-gray-600">
                You need at least 2 completed simulations to run comparisons
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Baseline Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baseline Simulation
                </label>
                <select
                  value={baselineId}
                  onChange={(e) => setBaselineId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select baseline simulation</option>
                  {completedSimulations.map((simulation) => (
                    <option key={simulation.id} value={simulation.id}>
                      {simulation.name} ({new Date(simulation.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Comparison Simulations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comparison Simulations
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {completedSimulations
                    .filter(sim => sim.id !== baselineId)
                    .map((simulation) => (
                      <label key={simulation.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={comparisonIds.includes(simulation.id)}
                          onChange={(e) => handleComparisonChange(simulation.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{simulation.name}</div>
                          <div className="text-sm text-gray-600">
                            {simulation.type.replace('_', ' ')} • {new Date(simulation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

              {/* Run Comparison */}
              <div className="flex justify-end">
                <button
                  onClick={runComparison}
                  disabled={!baselineId || comparisonIds.length === 0 || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Comparing...' : 'Run Comparison'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-red-800">{error}</span>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResults && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Comparison Results</h3>
                <button
                  onClick={exportComparison}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best/Worst Performing */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best Performing:</span>
                      <span className="text-sm font-medium text-green-600">
                        {getSimulationName(comparisonResults.summary.bestPerforming)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst Performing:</span>
                      <span className="text-sm font-medium text-red-600">
                        {getSimulationName(comparisonResults.summary.worstPerforming)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                  <ul className="space-y-1">
                    {comparisonResults.summary.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics Comparison */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detailed Metrics</h3>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Baseline
                      </th>
                      {comparisonResults.metrics[0]?.comparisons.map((comparison, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {getSimulationName(comparison.id)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonResults.metrics.map((metric, metricIndex) => (
                      <tr key={metricIndex} className={metricIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {metric.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {metric.baseline.toFixed(3)}
                        </td>
                        {metric.comparisons.map((comparison, compIndex) => (
                          <td key={compIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-900">
                                {comparison.value.toFixed(3)}
                              </span>
                              {getChangeIcon(comparison.difference)}
                              <span className={`text-sm font-medium ${getChangeColor(comparison.difference)}`}>
                                {comparison.difference > 0 ? '+' : ''}{comparison.difference.toFixed(3)}
                              </span>
                              <span className={`text-xs ${getChangeColor(comparison.percentageChange)}`}>
                                ({comparison.percentageChange > 0 ? '+' : ''}{formatPercentage(comparison.percentageChange)})
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Visual Comparison</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">Comparison chart would render here</div>
                  <div className="text-sm text-gray-500">
                    Comparing {comparisonResults.metrics.length} metrics across {1 + comparisonResults.metrics[0]?.comparisons.length || 0} simulations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};