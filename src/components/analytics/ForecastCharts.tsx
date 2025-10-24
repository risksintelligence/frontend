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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/analytics/forecasts?horizon=${timeHorizon}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.forecasts) {
        setForecastSeries(data.data.forecasts);
      } else {
        throw new Error('Forecast data not available from backend');
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setForecastSeries([]);
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
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg">
          <p className="text-sm text-slate-900 mb-2">{date}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-slate-900">
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
          <div className="h-6 bg-white rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-white rounded border border-slate-200"></div>
        </div>
      </div>
    );
  }

  if (!currentSeries || forecastSeries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Forecast Data Available</h3>
          <p>Backend API must be fully functional to display forecast charts.</p>
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
          <BarChart3 className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-semibold text-slate-900">
            Forecast Visualization
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {['1m', '3m', '6m', '1y'].map((horizon) => (
            <button
              key={horizon}
              onClick={() => fetchForecastData()}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                timeHorizon === horizon
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-500">Series:</span>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="bg-white border border-slate-300 rounded px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {forecastSeries.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Chart Type:</span>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'area' | 'scatter')}
                className="bg-white border border-slate-300 rounded px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="area">Area Chart</option>
                <option value="line">Line Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-slate-500 text-xs">Model Accuracy</div>
              <div className="text-slate-900 text-sm font-semibold">
                {currentSeries.accuracy?.toFixed(1) || 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900 mb-2">
            {currentSeries.name} Forecast
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
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
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Forecast Horizon
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Period</span>
              <span className="text-slate-900 text-xs">{timeHorizon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Data Points</span>
              <span className="text-slate-900 text-xs">{currentSeries.data?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Update Frequency</span>
              <span className="text-slate-900 text-xs">Daily</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Model Performance
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Accuracy</span>
              <span className="text-slate-900 text-xs">{currentSeries.accuracy?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">RMSE</span>
              <span className="text-slate-900 text-xs">-{currentSeries.unit || ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">MAE</span>
              <span className="text-slate-900 text-xs">-{currentSeries.unit || ''}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Confidence Metrics
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Avg Confidence</span>
              <span className="text-slate-900 text-xs">
                {currentSeries.data?.length ? (currentSeries.data.reduce((sum, point) => sum + point.confidence, 0) / currentSeries.data.length * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Min Confidence</span>
              <span className="text-slate-900 text-xs">
                {currentSeries.data?.length ? (Math.min(...currentSeries.data.map(p => p.confidence)) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Max Confidence</span>
              <span className="text-slate-900 text-xs">
                {currentSeries.data?.length ? (Math.max(...currentSeries.data.map(p => p.confidence)) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}