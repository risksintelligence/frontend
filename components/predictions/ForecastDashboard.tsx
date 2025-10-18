import React, { useState, useEffect } from 'react';
import { Calendar, Target, AlertCircle, Download, RefreshCw, Activity, BarChart3 } from 'lucide-react';
import { useForecasting } from '../../hooks/useForecasting';
import { ForecastControls } from '../../types/predictions';

interface ForecastDashboardProps {
  apiUrl?: string;
}

export default function ForecastDashboard({ apiUrl = 'https://backend-1-il1e.onrender.com' }: ForecastDashboardProps) {
  const {
    forecast,
    scenarios,
    modelStatus,
    loading,
    error,
    fetchForecast,
    analyzeScenario,
    refreshModelStatus,
    clearError,
    exportForecast
  } = useForecasting(apiUrl);

  const [controls, setControls] = useState<ForecastControls>({
    horizon_days: 30,
    confidence_level: 0.95,
    include_factors: true,
    refresh_interval: 300000 // 5 minutes
  });

  const [selectedScenario] = useState<string>('baseline');

  useEffect(() => {
    // Load initial forecast
    fetchForecast(controls);
    refreshModelStatus();

    // Set up auto-refresh
    const interval = setInterval(() => {
      if (!loading) {
        fetchForecast(controls);
      }
    }, controls.refresh_interval);

    return () => clearInterval(interval);
  }, []);

  const handleForecastUpdate = () => {
    fetchForecast(controls);
  };

  const handleScenarioAnalysis = async (scenarioName: string) => {
    await analyzeScenario({
      scenario_name: scenarioName,
      parameters: {
        severity: 'moderate',
        duration: controls.horizon_days
      },
      duration_days: controls.horizon_days
    });
  };


  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatPredictionValue = (value: number): string => {
    return value.toFixed(1);
  };

  if (loading && !forecast) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading forecast data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <div className="text-red-800 font-medium">{error.message}</div>
                {error.details && (
                  <div className="text-red-600 text-sm mt-1">{error.details}</div>
                )}
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Forecast Controls */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-primary-900">Risk Forecasting Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Horizon (Days)
            </label>
            <select
              value={controls.horizon_days}
              onChange={(e) => setControls({...controls, horizon_days: parseInt(e.target.value)})}
              className="input w-full"
            >
              <option value={7}>1 Week</option>
              <option value={30}>1 Month</option>
              <option value={90}>3 Months</option>
              <option value={180}>6 Months</option>
              <option value={365}>1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Level
            </label>
            <select
              value={controls.confidence_level}
              onChange={(e) => setControls({...controls, confidence_level: parseFloat(e.target.value)})}
              className="input w-full"
            >
              <option value={0.50}>50%</option>
              <option value={0.68}>68%</option>
              <option value={0.80}>80%</option>
              <option value={0.90}>90%</option>
              <option value={0.95}>95%</option>
              <option value={0.99}>99%</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Factors
            </label>
            <div className="flex items-center h-12">
              <input
                type="checkbox"
                checked={controls.include_factors}
                onChange={(e) => setControls({...controls, include_factors: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Risk factor explanations</span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleForecastUpdate}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Update Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Model Status */}
      {modelStatus && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-primary-900">Model Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{modelStatus.model_name}</div>
              <div className="text-sm text-gray-600">Model Name</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{modelStatus.version}</div>
              <div className="text-sm text-gray-600">Version</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold capitalize ${
                modelStatus.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {modelStatus.status}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {modelStatus.accuracy_metrics.r_squared.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">R²</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Forecast Display */}
      {forecast && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-900">
                Risk Forecast - {controls.horizon_days} Days
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Generated: {new Date(forecast.timestamp).toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportForecast('csv')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </button>
                  <button
                    onClick={() => exportForecast('json')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Current Risk
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {forecast.predictions.length > 0 ? formatPredictionValue(forecast.predictions[0].predicted_value) : 'N/A'}
                  </div>
                </div>
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Forecast Range
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {forecast.predictions.length > 0 ? 
                      `${formatPredictionValue(forecast.predictions[forecast.predictions.length - 1].predicted_value)}` 
                      : 'N/A'}
                  </div>
                </div>
                <Target className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Confidence
                  </div>
                  <div className={`text-2xl font-bold mt-1 ${getConfidenceColor(forecast.confidence_level)}`}>
                    {(forecast.confidence_level * 100).toFixed(0)}%
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Data Points
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {forecast.predictions.length}
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Forecast Data Table (First 10 rows) */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volatility
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecast.predictions.slice(0, 10).map((prediction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(prediction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPredictionValue(prediction.predicted_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPredictionValue(prediction.confidence_lower)} - {formatPredictionValue(prediction.confidence_upper)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPredictionValue(prediction.volatility)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {forecast.predictions.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing first 10 of {forecast.predictions.length} predictions. Export for complete data.
            </div>
          )}
        </div>
      )}

      {/* Scenario Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-primary-900">Scenario Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {['interest_rate_shock', 'supply_chain_disruption', 'cyber_incident'].map((scenario) => (
            <button
              key={scenario}
              onClick={() => handleScenarioAnalysis(scenario)}
              disabled={loading}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedScenario === scenario
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 capitalize">
                {scenario.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Analyze impact of {scenario.replace('_', ' ')} scenario
              </div>
            </button>
          ))}
        </div>

        {/* Scenario Results */}
        {scenarios.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recent Scenario Results:</h4>
            {scenarios.slice(0, 3).map((scenario) => (
              <div key={scenario.scenario_id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{scenario.scenario_name}</h5>
                  <span className="text-sm text-gray-500">
                    {new Date(scenario.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Max Deviation:</span>
                    <div className="font-medium">{scenario.impact_metrics.max_deviation.toFixed(1)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Impact:</span>
                    <div className="font-medium">{scenario.impact_metrics.avg_impact.toFixed(1)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Change:</span>
                    <div className={`font-medium ${
                      scenario.impact_metrics.risk_change > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {scenario.impact_metrics.risk_change > 0 ? '+' : ''}{scenario.impact_metrics.risk_change.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Volatility Change:</span>
                    <div className="font-medium">{scenario.impact_metrics.volatility_change.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}