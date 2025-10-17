/**
 * Time Series Chart component for RiskX application
 * Professional financial time series visualization with multiple metrics
 */
import React, { useState, useEffect, useRef } from 'react';
import { ComponentErrorBoundary } from '../common/ErrorBoundary';
import { Loading } from '../common/Loading';

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

interface TimeSeriesSeries {
  id: string;
  name: string;
  data: TimeSeriesDataPoint[];
  color: string;
  type: 'line' | 'area' | 'bar';
  yAxis?: 'left' | 'right';
  visible: boolean;
}

interface TimeSeriesChartProps {
  className?: string;
  title?: string;
  height?: number;
  series: TimeSeriesSeries[];
  timeRange?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  onDataPointClick?: (seriesId: string, dataPoint: TimeSeriesDataPoint) => void;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  className = '',
  title = 'Time Series Analysis',
  height = 400,
  series = [],
  timeRange = '1M',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  onDataPointClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesId: string;
    dataPoint: TimeSeriesDataPoint;
    x: number;
    y: number;
  } | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [visibleSeries, setVisibleSeries] = useState(series);

  useEffect(() => {
    setVisibleSeries(series);
    if (series.length > 0) {
      setLoading(false);
    }
  }, [series]);

  // Filter data based on selected time range
  const getFilteredData = (data: TimeSeriesDataPoint[]) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedTimeRange) {
      case '1D':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(point => new Date(point.timestamp) >= cutoffDate);
  };

  // Calculate chart dimensions and scales
  const margin = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartWidth = 800 - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Get all filtered data points for scaling
  const allFilteredData = visibleSeries
    .filter(s => s.visible)
    .flatMap(s => getFilteredData(s.data));
  
  const xDomain = allFilteredData.length > 0 ? [
    Math.min(...allFilteredData.map(d => new Date(d.timestamp).getTime())),
    Math.max(...allFilteredData.map(d => new Date(d.timestamp).getTime()))
  ] : [0, 1];
  
  const yDomain = allFilteredData.length > 0 ? [
    Math.min(...allFilteredData.map(d => d.value)) * 0.95,
    Math.max(...allFilteredData.map(d => d.value)) * 1.05
  ] : [0, 1];

  // Scale functions
  const xScale = (timestamp: string) => {
    const time = new Date(timestamp).getTime();
    return ((time - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;
  };

  const yScale = (value: number) => {
    return chartHeight - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * chartHeight;
  };

  // Generate path for line series
  const generateLinePath = (data: TimeSeriesDataPoint[]) => {
    const filteredData = getFilteredData(data);
    if (filteredData.length === 0) return '';
    
    return filteredData
      .map((point, index) => {
        const x = xScale(point.timestamp);
        const y = yScale(point.value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: TimeSeriesDataPoint[]) => {
    const filteredData = getFilteredData(data);
    if (filteredData.length === 0) return '';
    
    const linePath = generateLinePath(data);
    const firstPoint = filteredData[0];
    const lastPoint = filteredData[filteredData.length - 1];
    
    return `${linePath} L ${xScale(lastPoint.timestamp)} ${chartHeight} L ${xScale(firstPoint.timestamp)} ${chartHeight} Z`;
  };

  const toggleSeries = (seriesId: string) => {
    setVisibleSeries(prev =>
      prev.map(s => s.id === seriesId ? { ...s, visible: !s.visible } : s)
    );
  };

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (selectedTimeRange) {
      case '1D':
        return date.toLocaleTimeString();
      case '1W':
      case '1M':
        return date.toLocaleDateString();
      default:
        return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <Loading message="Loading time series data..." />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-charcoal-gray">{title}</h3>
          
          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range as any)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-navy-blue text-white'
                    : 'text-gray-600 hover:text-charcoal-gray'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          <svg
            ref={svgRef}
            width={800}
            height={height}
            className="w-full"
            viewBox={`0 0 800 ${height}`}
          >
            {/* Background */}
            <rect width="100%" height="100%" fill="white" />
            
            {/* Chart Area */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid Lines */}
              {showGrid && (
                <>
                  {/* Horizontal Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = chartHeight * ratio;
                    const value = yDomain[0] + (yDomain[1] - yDomain[0]) * (1 - ratio);
                    return (
                      <g key={`h-grid-${ratio}`}>
                        <line
                          x1={0}
                          y1={y}
                          x2={chartWidth}
                          y2={y}
                          stroke="#f3f4f6"
                          strokeWidth={1}
                        />
                        <text
                          x={-10}
                          y={y + 4}
                          textAnchor="end"
                          className="text-xs fill-gray-500"
                        >
                          {formatValue(value)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Vertical Grid Lines */}
                  {allFilteredData.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const x = chartWidth * ratio;
                    const timestamp = new Date(xDomain[0] + (xDomain[1] - xDomain[0]) * ratio).toISOString();
                    return (
                      <g key={`v-grid-${ratio}`}>
                        <line
                          x1={x}
                          y1={0}
                          x2={x}
                          y2={chartHeight}
                          stroke="#f3f4f6"
                          strokeWidth={1}
                        />
                        <text
                          x={x}
                          y={chartHeight + 20}
                          textAnchor="middle"
                          className="text-xs fill-gray-500"
                        >
                          {formatDate(timestamp)}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}

              {/* Data Series */}
              {visibleSeries
                .filter(s => s.visible)
                .map((series) => {
                  const filteredData = getFilteredData(series.data);
                  
                  return (
                    <g key={series.id}>
                      {/* Area Fill */}
                      {series.type === 'area' && (
                        <path
                          d={generateAreaPath(series.data)}
                          fill={series.color}
                          fillOpacity={0.2}
                        />
                      )}
                      
                      {/* Line */}
                      {(series.type === 'line' || series.type === 'area') && (
                        <path
                          d={generateLinePath(series.data)}
                          fill="none"
                          stroke={series.color}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      
                      {/* Data Points */}
                      {filteredData.map((point, index) => (
                        <circle
                          key={`${series.id}-${index}`}
                          cx={xScale(point.timestamp)}
                          cy={yScale(point.value)}
                          r={3}
                          fill={series.color}
                          className="cursor-pointer hover:r-5 transition-all"
                          onMouseEnter={() => {
                            if (showTooltip) {
                              const rect = svgRef.current?.getBoundingClientRect();
                              setHoveredPoint({
                                seriesId: series.id,
                                dataPoint: point,
                                x: (rect?.left || 0) + xScale(point.timestamp) + margin.left,
                                y: (rect?.top || 0) + yScale(point.value) + margin.top
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                          onClick={() => onDataPointClick?.(series.id, point)}
                        />
                      ))}
                    </g>
                  );
                })}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredPoint && showTooltip && (
            <div
              className="absolute z-10 bg-charcoal-gray text-white text-xs rounded px-2 py-1 pointer-events-none"
              style={{
                left: hoveredPoint.x,
                top: hoveredPoint.y - 40,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-medium">
                {visibleSeries.find(s => s.id === hoveredPoint.seriesId)?.name}
              </div>
              <div>Value: {formatValue(hoveredPoint.dataPoint.value)}</div>
              <div>Time: {formatDate(hoveredPoint.dataPoint.timestamp)}</div>
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 flex flex-wrap gap-4">
            {visibleSeries.map((series) => (
              <button
                key={series.id}
                onClick={() => toggleSeries(series.id)}
                className={`flex items-center space-x-2 text-sm transition-opacity ${
                  series.visible ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: series.color }}
                ></div>
                <span className="text-charcoal-gray">{series.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {visibleSeries
            .filter(s => s.visible)
            .map((series) => {
              const filteredData = getFilteredData(series.data);
              const values = filteredData.map(d => d.value);
              const latest = values[values.length - 1];
              const previous = values[values.length - 2];
              const change = previous ? ((latest - previous) / previous) * 100 : 0;
              
              return (
                <div key={`stats-${series.id}`} className="bg-gray-50 rounded p-3">
                  <div className="font-medium text-charcoal-gray">{series.name}</div>
                  <div className="text-lg font-semibold">{formatValue(latest || 0)}</div>
                  <div className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default TimeSeriesChart;