import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, AlertTriangle } from 'lucide-react';
import { useRiskFactors } from '../../hooks/useRiskFactors';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FactorDetailsProps {
  apiUrl: string;
  factorId: string;
  onClose?: () => void;
}

export const FactorDetails: React.FC<FactorDetailsProps> = ({
  apiUrl,
  factorId,
  onClose
}) => {
  const { selectedFactor, loading, error, fetchRiskFactorDetails, clearError } = useRiskFactors(apiUrl);
  const [activeTab, setActiveTab] = useState<'overview' | 'historical' | 'correlations' | 'forecast'>('overview');

  useEffect(() => {
    if (factorId) {
      fetchRiskFactorDetails(factorId);
    }
  }, [factorId, fetchRiskFactorDetails]);

  const exportData = (format: 'json' | 'csv') => {
    if (!selectedFactor) return;

    let data: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      data = JSON.stringify(selectedFactor, null, 2);
      filename = `risk_factor_${selectedFactor.factor.id}.json`;
      mimeType = 'application/json';
    } else {
      // CSV format
      const headers = ['Date', 'Value', 'Percentile'];
      const rows = selectedFactor.historical_data.map(point => [
        point.date,
        point.value.toString(),
        point.percentile.toString()
      ]);
      data = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = `risk_factor_${selectedFactor.factor.id}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatValue = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'text-red-600';
    if (abs >= 0.5) return 'text-orange-600';
    if (abs >= 0.3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading factor details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading factor details</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedFactor) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Factor Selected</h3>
            <p className="text-gray-600">Select a risk factor to view detailed analysis.</p>
          </div>
        </div>
      </div>
    );
  }

  const { factor, historical_data, correlations, statistical_analysis, forecast } = selectedFactor;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{factor.name}</h3>
            <p className="text-sm text-gray-600">{factor.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportData('json')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export JSON
            </button>
            <button
              onClick={() => exportData('csv')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export CSV
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'historical', label: 'Historical Data', icon: TrendingUp },
            { id: 'correlations', label: 'Correlations', icon: BarChart3 },
            { id: 'forecast', label: 'Forecast', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Current Value</div>
                <div className="text-2xl font-bold text-gray-900">{formatValue(factor.current_value)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Historical Average</div>
                <div className="text-2xl font-bold text-gray-900">{formatValue(factor.historical_average)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Volatility</div>
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(factor.volatility)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Risk Contribution</div>
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(factor.contribution_to_risk)}</div>
              </div>
            </div>

            {/* Statistical Analysis */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Statistical Analysis</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mean:</span>
                    <div className="font-medium">{formatValue(statistical_analysis.mean)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Std Dev:</span>
                    <div className="font-medium">{formatValue(statistical_analysis.std_dev)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Skewness:</span>
                    <div className="font-medium">{formatValue(statistical_analysis.skewness)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Kurtosis:</span>
                    <div className="font-medium">{formatValue(statistical_analysis.kurtosis)}</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Percentile Distribution</div>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {Object.entries(statistical_analysis.percentiles).map(([percentile, value]) => (
                      <div key={percentile} className="text-center">
                        <div className="text-gray-500">{percentile.toUpperCase()}</div>
                        <div className="font-medium">{formatValue(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Factor Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Factor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{factor.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trend:</span>
                    <span className="font-medium capitalize">{factor.trend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alert Level:</span>
                    <span className={`font-medium capitalize ${
                      factor.alert_level === 'critical' ? 'text-red-600' :
                      factor.alert_level === 'high' ? 'text-orange-600' :
                      factor.alert_level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {factor.alert_level}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Source:</span>
                    <span className="font-medium">{factor.data_source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{new Date(factor.last_updated).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historical' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Historical Data</h4>
              <div className="text-sm text-gray-600">
                {historical_data.length} data points
              </div>
            </div>
            
            {/* Real Historical Chart */}
            <div className="h-64">
              {historical_data.length > 0 ? (
                <Line
                  data={{
                    labels: historical_data.map(point => 
                      new Date(point.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: '2-digit' 
                      })
                    ),
                    datasets: [
                      {
                        label: factor.name || 'Factor Value',
                        data: historical_data.map(point => point.value),
                        borderColor: '#1e3a8a',
                        backgroundColor: 'rgba(30, 58, 138, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#1e3a8a',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1e3a8a',
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: {
                        display: true,
                        grid: {
                          display: false
                        },
                        border: {
                          display: false
                        }
                      },
                      y: {
                        display: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        },
                        border: {
                          display: false
                        }
                      }
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    }
                  }}
                />
              ) : (
                <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-600">No historical data available</div>
                    <div className="text-sm text-gray-500">
                      Real historical data will appear here when available
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Data Table */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Values</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentile
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historical_data.slice(-10).map((point, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(point.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatValue(point.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatValue(point.percentile, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'correlations' && (
          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-900">Factor Correlations</h4>
            
            <div className="space-y-3">
              {correlations.map((correlation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{correlation.factor_name}</div>
                    <div className="text-sm text-gray-600">
                      {getCorrelationStrength(correlation.correlation)} correlation
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getCorrelationColor(correlation.correlation)}`}>
                      {correlation.correlation > 0 ? '+' : ''}{formatValue(correlation.correlation, 3)}
                    </div>
                    <div className="text-xs text-gray-500">
                      p-value: {formatValue(correlation.significance, 4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Forecast</h4>
              <div className="text-sm text-gray-600">
                Next {forecast.length} periods
              </div>
            </div>
            
            {/* Real Forecast Chart - Only show if forecast data exists */}
            {forecast && forecast.length > 0 ? (
              <div className="h-64">
                <Line
                  data={{
                    labels: forecast.map(point => 
                      new Date(point.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: '2-digit' 
                      })
                    ),
                    datasets: [
                      {
                        label: 'Forecast',
                        data: forecast.map(point => point.predicted_value),
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#dc2626',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#dc2626',
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: {
                        display: true,
                        grid: {
                          display: false
                        },
                        border: {
                          display: false
                        }
                      },
                      y: {
                        display: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        },
                        border: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">No forecast data available</div>
                  <div className="text-sm text-gray-500">
                    Only real historical data is displayed - no predictions
                  </div>
                </div>
              </div>
            )}

            {/* Forecast Table */}
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
                      Lower CI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upper CI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forecast.map((prediction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prediction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatValue(prediction.predicted_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatValue(prediction.confidence_interval_lower)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatValue(prediction.confidence_interval_upper)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};