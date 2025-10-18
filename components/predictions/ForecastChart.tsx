import React, { useState, useRef, useMemo } from 'react';
import { PredictionResponse, ForecastPoint } from '../../types/predictions';

interface ForecastChartProps {
  forecast: PredictionResponse;
  height?: number;
  showConfidenceIntervals?: boolean;
  showGrid?: boolean;
  className?: string;
}

export default function ForecastChart({ 
  forecast, 
  height = 400, 
  showConfidenceIntervals = true,
  showGrid = true,
  className = '' 
}: ForecastChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ForecastPoint;
    x: number;
    y: number;
  } | null>(null);

  const margin = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartWidth = 800 - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate domains for scaling
  const { xDomain, yDomain } = useMemo(() => {
    if (!forecast?.predictions?.length) {
      return { xDomain: [0, 1], yDomain: [0, 1] };
    }

    const timestamps = forecast.predictions.map(p => new Date(p.date).getTime());
    const values = forecast.predictions.flatMap(p => [
      p.predicted_value,
      p.confidence_lower,
      p.confidence_upper
    ]);

    return {
      xDomain: [Math.min(...timestamps), Math.max(...timestamps)],
      yDomain: [Math.min(...values) * 0.95, Math.max(...values) * 1.05]
    };
  }, [forecast]);

  // Scale functions
  const xScale = (date: string) => {
    const time = new Date(date).getTime();
    return ((time - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;
  };

  const yScale = (value: number) => {
    return chartHeight - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * chartHeight;
  };

  // Generate paths
  const mainLinePath = useMemo(() => {
    if (!forecast?.predictions?.length) return '';
    
    return forecast.predictions
      .map((point, index) => {
        const x = xScale(point.date);
        const y = yScale(point.predicted_value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [forecast, xScale, yScale]);

  const confidenceAreaPath = useMemo(() => {
    if (!forecast?.predictions?.length || !showConfidenceIntervals) return '';
    
    const upperPath = forecast.predictions
      .map((point, index) => {
        const x = xScale(point.date);
        const y = yScale(point.confidence_upper);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    
    const lowerPath = forecast.predictions
      .slice()
      .reverse()
      .map(point => {
        const x = xScale(point.date);
        const y = yScale(point.confidence_lower);
        return `L ${x} ${y}`;
      })
      .join(' ');
    
    return `${upperPath} ${lowerPath} Z`;
  }, [forecast, showConfidenceIntervals, xScale, yScale]);

  const formatValue = (value: number) => {
    return value.toFixed(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getRiskColor = (value: number) => {
    if (value < 30) return '#059669'; // green
    if (value < 60) return '#d97706'; // amber
    return '#dc2626'; // red
  };

  if (!forecast?.predictions?.length) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-12 text-gray-500">
          No forecast data available
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-900">
            Risk Forecast Visualization
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {forecast.horizon_days} day forecast • {(forecast.confidence_level * 100).toFixed(0)}% confidence level
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
            <span className="text-gray-600">Predicted Value</span>
          </div>
          {showConfidenceIntervals && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-200 rounded mr-2"></div>
              <span className="text-gray-600">Confidence Interval</span>
            </div>
          )}
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
                        strokeDasharray="2,2"
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
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
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
                        strokeDasharray="2,2"
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

            {/* Confidence Interval Area */}
            {showConfidenceIntervals && confidenceAreaPath && (
              <path
                d={confidenceAreaPath}
                fill="#1e3a8a"
                fillOpacity={0.1}
                stroke="none"
              />
            )}

            {/* Confidence Interval Borders */}
            {showConfidenceIntervals && (
              <>
                <path
                  d={forecast.predictions
                    .map((point, index) => {
                      const x = xScale(point.date);
                      const y = yScale(point.confidence_upper);
                      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  strokeOpacity={0.6}
                />
                <path
                  d={forecast.predictions
                    .map((point, index) => {
                      const x = xScale(point.date);
                      const y = yScale(point.confidence_lower);
                      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  strokeOpacity={0.6}
                />
              </>
            )}

            {/* Main Prediction Line */}
            <path
              d={mainLinePath}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {forecast.predictions.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={xScale(point.date)}
                cy={yScale(point.predicted_value)}
                r={4}
                fill={getRiskColor(point.predicted_value)}
                stroke="white"
                strokeWidth={2}
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={() => {
                  const rect = svgRef.current?.getBoundingClientRect();
                  setHoveredPoint({
                    point,
                    x: (rect?.left || 0) + xScale(point.date) + margin.left,
                    y: (rect?.top || 0) + yScale(point.predicted_value) + margin.top
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Current Time Indicator */}
            <line
              x1={xScale(new Date().toISOString())}
              y1={0}
              x2={xScale(new Date().toISOString())}
              y2={chartHeight}
              stroke="#374151"
              strokeWidth={2}
              strokeDasharray="5,5"
              opacity={0.7}
            />
            <text
              x={xScale(new Date().toISOString())}
              y={-5}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              Now
            </text>
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
            style={{
              left: hoveredPoint.x,
              top: hoveredPoint.y - 60,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-medium mb-1">
              {formatDate(hoveredPoint.point.date)}
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-gray-300">Predicted:</span> {formatValue(hoveredPoint.point.predicted_value)}
              </div>
              <div>
                <span className="text-gray-300">Range:</span> {formatValue(hoveredPoint.point.confidence_lower)} - {formatValue(hoveredPoint.point.confidence_upper)}
              </div>
              <div>
                <span className="text-gray-300">Volatility:</span> {formatValue(hoveredPoint.point.volatility)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Starting Value</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatValue(forecast.predictions[0]?.predicted_value || 0)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Ending Value</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatValue(forecast.predictions[forecast.predictions.length - 1]?.predicted_value || 0)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Max Value</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatValue(Math.max(...forecast.predictions.map(p => p.predicted_value)))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Avg Volatility</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatValue(forecast.predictions.reduce((sum, p) => sum + p.volatility, 0) / forecast.predictions.length)}
          </div>
        </div>
      </div>

      {/* Risk Level Indicators */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-gray-600">Low Risk (&lt;30)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span className="text-gray-600">Moderate Risk (30-60)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span className="text-gray-600">High Risk (&gt;60)</span>
        </div>
      </div>
    </div>
  );
}