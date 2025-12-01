"use client";

import { getGaugeColor, getAccessibilityPattern } from "@/lib/risk-colors";
import StatusBadge from "@/components/ui/StatusBadge";

interface HeatmapCell {
  id: string;
  label: string;
  value: number;
  category: string;
  x: number;
  y: number;
}

interface RiskHeatmapProps {
  data: HeatmapCell[];
  title?: string;
  cellSize?: number;
  updatedAt?: string;
}

export default function RiskHeatmap({
  data,
  title = "Risk Correlation Matrix",
  cellSize = 40,
  updatedAt,
}: RiskHeatmapProps) {
  // Get unique categories for axes
  const xCategories = [...new Set(data.map(cell => cell.x))].sort();
  const yCategories = [...new Set(data.map(cell => cell.y))].sort();
  
  // Calculate matrix dimensions
  const matrixWidth = xCategories.length * cellSize;
  const matrixHeight = yCategories.length * cellSize;
  
  // Find min/max values for normalization
  const values = data.map(cell => cell.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  const getCellData = (x: number, y: number) => {
    return data.find(cell => cell.x === x && cell.y === y);
  };

  const normalizeValue = (value: number) => {
    if (range === 0) return 0.5;
    return (value - minValue) / range;
  };

  const getCellColor = (value: number) => {
    const normalized = normalizeValue(value);
    // Map to risk scale (0-100) for semantic colors
    const riskScore = normalized * 100;
    return getGaugeColor(riskScore);
  };

  const getCellOpacity = (value: number) => {
    const normalized = normalizeValue(value);
    return Math.max(0.3, normalized);
  };

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Risk Analytics
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title}
          </h3>
        </div>
        <StatusBadge variant="info">
          {data.length} CORRELATIONS
        </StatusBadge>
      </div>

      {/* Legend */}
      <div className="bg-terminal-surface rounded border border-terminal-border p-3">
        <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
          Risk Scale Legend
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-terminal-green"></div>
            <span className="text-xs font-mono text-terminal-text">0-19 Minimal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-xs font-mono text-terminal-text">40-59 Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-terminal-red"></div>
            <span className="text-xs font-mono text-terminal-text">80-100 Critical</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="overflow-auto">
        <div className="relative inline-block">
          <svg 
            width={matrixWidth + 120} 
            height={matrixHeight + 120}
            className="border border-terminal-border rounded"
          >
            {/* Y-axis labels */}
            {yCategories.map((category, index) => (
              <text
                key={`y-${category}`}
                x="100"
                y={index * cellSize + cellSize / 2 + 110}
                textAnchor="end"
                className="text-xs font-mono fill-terminal-text"
                dominantBaseline="central"
              >
                {category}
              </text>
            ))}

            {/* X-axis labels */}
            {xCategories.map((category, index) => (
              <text
                key={`x-${category}`}
                x={index * cellSize + cellSize / 2 + 110}
                y="95"
                textAnchor="middle"
                className="text-xs font-mono fill-terminal-text"
                transform={`rotate(-45, ${index * cellSize + cellSize / 2 + 110}, 95)`}
              >
                {category}
              </text>
            ))}

            {/* Heatmap cells */}
            {yCategories.map((yCategory, yIndex) =>
              xCategories.map((xCategory, xIndex) => {
                const cellData = getCellData(xCategory, yCategory);
                if (!cellData) return null;

                const cellColor = getCellColor(cellData.value);
                const cellOpacity = getCellOpacity(cellData.value);
                const accessibilityPattern = getAccessibilityPattern(cellData.value * 100);

                return (
                  <g key={`cell-${xIndex}-${yIndex}`}>
                    <rect
                      x={xIndex * cellSize + 110}
                      y={yIndex * cellSize + 110}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      fill={cellColor}
                      opacity={cellOpacity}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      className="hover:stroke-terminal-text hover:stroke-2 transition-all cursor-pointer"
                    />
                    
                    {/* Cell value text */}
                    <text
                      x={xIndex * cellSize + cellSize / 2 + 110}
                      y={yIndex * cellSize + cellSize / 2 + 105}
                      textAnchor="middle"
                      className="text-xs font-mono fill-white font-bold pointer-events-none"
                      dominantBaseline="central"
                    >
                      {cellData.value.toFixed(2)}
                    </text>
                    
                    {/* Accessibility pattern */}
                    <text
                      x={xIndex * cellSize + cellSize / 2 + 110}
                      y={yIndex * cellSize + cellSize / 2 + 120}
                      textAnchor="middle"
                      className="text-xs font-mono fill-white pointer-events-none"
                      dominantBaseline="central"
                    >
                      {accessibilityPattern}
                    </text>
                  </g>
                );
              })
            )}

            {/* Grid lines */}
            {yCategories.map((_, index) => (
              <line
                key={`hline-${index}`}
                x1="110"
                y1={index * cellSize + 110}
                x2={matrixWidth + 110}
                y2={index * cellSize + 110}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}
            {xCategories.map((_, index) => (
              <line
                key={`vline-${index}`}
                x1={index * cellSize + 110}
                y1="110"
                x2={index * cellSize + 110}
                y2={matrixHeight + 110}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-terminal-surface rounded border border-terminal-border p-3">
        <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
          Matrix Statistics
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm font-bold font-mono text-terminal-text">
              {values.length}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Total Pairs
            </p>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-terminal-red">
              {maxValue.toFixed(3)}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Max Correlation
            </p>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-terminal-green">
              {minValue.toFixed(3)}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Min Correlation
            </p>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-terminal-text">
              {(values.reduce((sum, v) => sum + Math.abs(v), 0) / values.length).toFixed(3)}
            </p>
            <p className="text-xs text-terminal-muted font-mono">
              Avg |Correlation|
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono">
          Live Data · Updated {updatedAt ? new Date(updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors">
          Explain Correlation Drivers →
        </button>
      </div>
    </section>
  );
}
