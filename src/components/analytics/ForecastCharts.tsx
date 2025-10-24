'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter, Legend } from 'recharts';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';

interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

interface ForecastSeries {
  id: string;
  name: string;
  unit: string;
  category: 'economic' | 'market' | 'risk';
  data: ForecastPoint[];
  accuracy: number;
  lastUpdated: string;
}

interface ForecastChartsProps {
  seriesId?: string;
  timeHorizon?: '1m' | '3m' | '6m' | '1y';
  showConfidence?: boolean;
}

export default function ForecastCharts({ 
  seriesId, 
  timeHorizon = '6m', 
  showConfidence = true 
}: ForecastChartsProps) {
  const [forecastSeries, setForecastSeries] = useState<ForecastSeries[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [chartType, setChartType] = useState<'line' | 'area' | 'scatter'>('area');
  const [loading, setLoading] = useState(true);

  const fetchForecastData = useCallback(async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/forecasts?horizon=${timeHorizon}`);
      // const data = await response.json();
      
      // Generate forecast visualization data
      const generateForecastData = (baseValue: number, trend: number, volatility: number) => {
        const data: ForecastPoint[] = [];
        const now = new Date();
        
        // Historical data (last 3 months)
        for (let i = -90; i <= 0; i += 7) {
          const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
          const noise = (Math.random() - 0.5) * volatility;
          const trendValue = baseValue + (trend * i / 90);
          const actual = Math.max(0, trendValue + noise);
          
          data.push({
            date: date.toISOString().split('T')[0],
            actual,
            forecast: actual, // Historical forecast matches actual for past data
            upperBound: actual + volatility * 0.5,
            lowerBound: Math.max(0, actual - volatility * 0.5),
            confidence: 0.95
          });
        }
        
        // Future forecasts
        const horizonDays = timeHorizon === '1m' ? 30 : timeHorizon === '3m' ? 90 : timeHorizon === '6m' ? 180 : 365;
        for (let i = 1; i <= horizonDays; i += 7) {
          const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
          const trendValue = baseValue + (trend * i / 90);
          const uncertainty = volatility * (1 + i / horizonDays); // Increasing uncertainty over time
          const forecast = Math.max(0, trendValue);
          const confidence = Math.max(0.5, 0.95 - (i / horizonDays) * 0.3); // Decreasing confidence
          
          data.push({
            date: date.toISOString().split('T')[0],
            forecast,
            upperBound: forecast + uncertainty,
            lowerBound: Math.max(0, forecast - uncertainty),
            confidence
          });
        }
        
        return data;
      };

      const sampleForecastSeries: ForecastSeries[] = [
        {
          id: 'gdp-forecast',
          name: 'GDP Growth Rate',
          unit: '%',
          category: 'economic',
          data: generateForecastData(2.1, 0.3, 0.5),
          accuracy: 94.2,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'unemployment-forecast',
          name: 'Unemployment Rate',
          unit: '%',
          category: 'economic',
          data: generateForecastData(3.7, 0.4, 0.3),
          accuracy: 89.5,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'inflation-forecast',
          name: 'Inflation Rate',
          unit: '%',
          category: 'economic',
          data: generateForecastData(3.2, -0.8, 0.6),
          accuracy: 87.8,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'market-volatility-forecast',
          name: 'Market Volatility Index',
          unit: 'VIX',
          category: 'market',
          data: generateForecastData(18.5, 3.2, 4.5),
          accuracy: 82.1,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'risk-score-forecast',
          name: 'Risk Score',
          unit: 'index',
          category: 'risk',
          data: generateForecastData(65.3, 5.8, 8.2),
          accuracy: 85.7,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setForecastSeries(sampleForecastSeries);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeHorizon]);

  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  useEffect(() => {
    if (seriesId) {
      setSelectedSeries(seriesId);
    } else if (forecastSeries.length > 0) {
      setSelectedSeries(forecastSeries[0].id);
    }
  }, [seriesId, forecastSeries]);

  const getCurrentSeries = () => {
    return forecastSeries.find(s => s.id === selectedSeries) || forecastSeries[0];
  };

  const currentSeries = getCurrentSeries();

  const formatTooltipValue = (value: number, name: string) => {
    if (!currentSeries) return [value, name];
    return [`${value.toFixed(2)}${currentSeries.unit}`, name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString();
      
      return (
        <div className="bg-terminal-surface border border-terminal-border p-3 rounded shadow-lg">
          <p className="font-mono text-sm text-terminal-text mb-2">{date}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="font-mono text-xs text-terminal-text">
                {item.name}: {item.value.toFixed(2)}{currentSeries?.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-terminal-bg rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentSeries) {
    return (
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="text-terminal-muted font-mono text-center">
          No forecast data available
        </div>
      </div>
    );
  }

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-terminal-blue" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            FORECAST VISUALIZATION
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {['1m', '3m', '6m', '1y'].map((horizon) => (
            <button
              key={horizon}
              onClick={() => fetchForecastData()}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                timeHorizon === horizon
                  ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/30'
                  : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
              }`}
            >
              {horizon.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-terminal-muted" />
              <span className="font-mono text-sm text-terminal-muted">SERIES:</span>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 font-mono text-sm text-terminal-text"
              >
                {forecastSeries.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-terminal-muted">CHART TYPE:</span>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'area' | 'scatter')}
                className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 font-mono text-sm text-terminal-text"
              >
                <option value="area">Area Chart</option>
                <option value="line">Line Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-terminal-muted font-mono text-xs">MODEL ACCURACY</div>
              <div className="text-terminal-text font-mono text-sm font-semibold">
                {currentSeries.accuracy.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="mb-4">
          <h3 className="font-mono font-semibold text-terminal-text mb-2">
            {currentSeries.name.toUpperCase()} FORECAST
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono text-terminal-muted">
            <span>Historical Data & Future Projections</span>
            <span>•</span>
            <span>Confidence Intervals: {showConfidence ? 'Enabled' : 'Disabled'}</span>
            <span>•</span>
            <span>Updated: {new Date(currentSeries.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={currentSeries.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => `${value.toFixed(1)}${currentSeries.unit}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {showConfidence && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="none"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      name="Upper Bound"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="none"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      name="Lower Bound"
                    />
                  </>
                )}
                
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Historical"
                  connectNulls={false}
                />
                
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Forecast"
                />
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={currentSeries.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => `${value.toFixed(1)}${currentSeries.unit}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {showConfidence && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="upperBound"
                      stroke="#3b82f6"
                      strokeOpacity={0.3}
                      strokeDasharray="2 2"
                      name="Upper Bound"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="#3b82f6"
                      strokeOpacity={0.3}
                      strokeDasharray="2 2"
                      name="Lower Bound"
                      dot={false}
                    />
                  </>
                )}
                
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Historical"
                  connectNulls={false}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 2 }}
                />
                
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecast"
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 2 }}
                />
              </LineChart>
            ) : (
              <ScatterChart data={currentSeries.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(value) => `${value.toFixed(1)}${currentSeries.unit}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                <Scatter
                  dataKey="actual"
                  fill="#10b981"
                  name="Historical"
                />
                
                <Scatter
                  dataKey="forecast"
                  fill="#3b82f6"
                  name="Forecast"
                />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
            FORECAST HORIZON
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Period</span>
              <span className="text-terminal-text font-mono text-xs">{timeHorizon.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Data Points</span>
              <span className="text-terminal-text font-mono text-xs">{currentSeries.data.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Update Frequency</span>
              <span className="text-terminal-text font-mono text-xs">Daily</span>
            </div>
          </div>
        </div>

        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
            MODEL PERFORMANCE
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Accuracy</span>
              <span className="text-terminal-text font-mono text-xs">{currentSeries.accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">RMSE</span>
              <span className="text-terminal-text font-mono text-xs">0.34{currentSeries.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">MAE</span>
              <span className="text-terminal-text font-mono text-xs">0.28{currentSeries.unit}</span>
            </div>
          </div>
        </div>

        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
            CONFIDENCE METRICS
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Avg Confidence</span>
              <span className="text-terminal-text font-mono text-xs">
                {(currentSeries.data.reduce((sum, point) => sum + point.confidence, 0) / currentSeries.data.length * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Min Confidence</span>
              <span className="text-terminal-text font-mono text-xs">
                {(Math.min(...currentSeries.data.map(p => p.confidence)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-muted font-mono text-xs">Max Confidence</span>
              <span className="text-terminal-text font-mono text-xs">
                {(Math.max(...currentSeries.data.map(p => p.confidence)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}