import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { useRiskUpdates } from '../../hooks/useWebSocket';
import LiveStatusIndicator from '../common/LiveStatusIndicator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RiskFactor {
  name: string;
  category: string;
  value: number;
  weight: number;
  normalized_value: number;
  description: string;
  confidence: number;
}

interface RiskScore {
  overall_score: number;
  risk_level: string;
  confidence: number;
  factors: RiskFactor[];
  timestamp: string;
}

interface RiskScoreChartProps {
  apiUrl?: string;
}

export default function RiskScoreChart({ apiUrl = 'http://localhost:8000' }: RiskScoreChartProps) {
  const [riskData, setRiskData] = useState<RiskScore | null>(null);
  const [historicalData, setHistoricalData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection for real-time updates
  const { 
    riskData: liveRiskData, 
    lastUpdate, 
    isConnected, 
    connectionState 
  } = useRiskUpdates(apiUrl);

  // Initial data fetch and fallback polling
  useEffect(() => {
    fetchRiskData();
    // Only use polling as fallback when WebSocket is not connected
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchRiskData();
      }
    }, 30000); // Poll every 30 seconds only when WebSocket is disconnected
    return () => clearInterval(interval);
  }, [apiUrl, isConnected]);

  // Update risk data when live data is received
  useEffect(() => {
    if (liveRiskData) {
      // Convert live data to RiskScore format
      const liveRiskScore: RiskScore = {
        overall_score: liveRiskData.overall_score,
        risk_level: liveRiskData.risk_level,
        confidence: liveRiskData.confidence,
        factors: liveRiskData.top_factors?.map((factor: any) => ({
          name: factor.name,
          category: 'live',
          value: factor.value,
          weight: factor.contribution / factor.normalized_value || 0.1,
          normalized_value: factor.normalized_value,
          description: `${factor.name}: ${factor.value}`,
          confidence: liveRiskData.confidence
        })) || [],
        timestamp: lastUpdate || new Date().toISOString()
      };
      
      setRiskData(liveRiskScore);
      setError(null);
      setLoading(false);
      
      // Update historical data with live updates
      setHistoricalData(prev => {
        const newData = [...prev, liveRiskData.overall_score];
        return newData.slice(-20); // Keep last 20 data points
      });
    }
  }, [liveRiskData, lastUpdate]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/risk/score`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRiskData(data);
      
      // Build historical trend from current data points
      setHistoricalData(prev => {
        const newData = [...prev, data.overall_score];
        return newData.slice(-20); // Keep last 20 data points for trend visualization
      });
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch risk data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number): string => {
    if (score < 25) return '#10b981'; // green
    if (score < 50) return '#f59e0b'; // yellow
    if (score < 75) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  if (loading && !riskData) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading risk score...</span>
        </div>
      </div>
    );
  }

  if (error && !riskData) {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center justify-center py-12">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <div className="text-red-800 font-medium">Failed to load risk score</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!riskData) return null;

  // Risk Score Gauge Data
  const gaugeData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [
      {
        data: [25, 25, 25, 25],
        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    rotation: -90,
    circumference: 180,
  };

  // Historical Trend Data
  const trendData = {
    labels: historicalData.map((_, index) => `T-${historicalData.length - index - 1}`),
    datasets: [
      {
        label: 'Risk Score',
        data: historicalData,
        borderColor: getRiskColor(riskData.overall_score),
        backgroundColor: getRiskColor(riskData.overall_score) + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: getRiskColor(riskData.overall_score),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          stepSize: 25,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // Risk Factors Bar Chart
  const factorsData = {
    labels: riskData.factors.map(factor => factor.name.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Risk Contribution',
        data: riskData.factors.map(factor => {
          const contribution = factor.normalized_value * factor.weight * 100;
          // Ensure minimum visibility for zero-contribution factors
          return contribution === 0 ? 0.1 : contribution;
        }),
        backgroundColor: riskData.factors.map(factor => {
          const contribution = factor.normalized_value * factor.weight * 100;
          // Use gray color for zero-contribution factors
          return contribution === 0 ? '#d1d5db' : getRiskColor(contribution * 4);
        }),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const factorsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            // Get the actual contribution value from the original data
            const factorIndex = context.dataIndex;
            const factor = riskData.factors[factorIndex];
            const actualContribution = factor.normalized_value * factor.weight * 100;
            return `${actualContribution.toFixed(1)}% contribution`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-900">Risk Score Analysis</h2>
          <div className="flex items-center space-x-4">
            <LiveStatusIndicator 
              connectionState={connectionState}
              lastUpdate={lastUpdate}
              label="Risk Data"
            />
            <div className="text-sm text-gray-500">
              Updated: {new Date(riskData.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Score Gauge */}
          <div className="relative">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Risk Score</h3>
            </div>
            <div className="relative h-48">
              <Doughnut data={gaugeData} options={gaugeOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: getRiskColor(riskData.overall_score) }}>
                    {riskData.overall_score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{riskData.risk_level} Risk</div>
                  <div className="text-xs text-gray-400">
                    {(riskData.confidence * 100).toFixed(1)}% confidence
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                    <div className="font-semibold capitalize">{riskData.risk_level}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className="font-semibold">{(riskData.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Top Risk Factors</div>
              <div className="space-y-2">
                {riskData.factors
                  .sort((a, b) => (b.normalized_value * b.weight) - (a.normalized_value * a.weight))
                  .slice(0, 3)
                  .map((factor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{factor.name.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-medium">
                        {((factor.normalized_value * factor.weight) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend */}
      {historicalData.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Trend</h3>
          <div className="h-64">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      )}

      {/* Risk Factors Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors Contribution</h3>
        <div className="h-64">
          <Bar data={factorsData} options={factorsOptions} />
        </div>
      </div>
    </div>
  );
}