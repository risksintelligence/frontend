"use client";

import { useMemo, useState } from "react";
import { useComponentsData } from "@/hooks/useComponentsData";
import { createCorrelationAnalysis } from "@/services/realTimeDataService";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface CorrelationCellProps {
  value: number;
  significant: boolean;
  factor1: string;
  factor2: string;
}

function CorrelationCell({ value, significant, factor1, factor2 }: CorrelationCellProps) {
  const getCorrelationColor = (corr: number) => {
    const abs = Math.abs(corr);
    if (abs > 0.7) return "bg-terminal-red text-white";
    if (abs > 0.4) return "bg-terminal-orange text-white";
    if (abs > 0.2) return "bg-terminal-green/20 text-terminal-green";
    return "bg-terminal-surface text-terminal-muted";
  };

  return (
    <div
      className={`
        p-2 text-center font-mono text-xs border border-terminal-border 
        ${getCorrelationColor(value)}
        ${significant ? "" : "opacity-50"}
        hover:scale-105 transition-all cursor-pointer
      `}
      title={`${factor1} vs ${factor2}: ${value.toFixed(3)}${significant ? "" : " (not significant)"}`}
    >
      {factor1 === factor2 ? "1.00" : value.toFixed(2)}
    </div>
  );
}

export default function CorrelationMatrix() {
  const { data: componentsData, isLoading } = useComponentsData();
  const [selectedTimeWindow, setSelectedTimeWindow] = useState("30D");

  const correlationData = useMemo(() => {
    if (!componentsData) return null;
    return createCorrelationAnalysis(componentsData);
  }, [componentsData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
            Analytics • Correlation Analysis
          </p>
          <h2 className="text-xl font-bold uppercase text-terminal-text font-mono">
            CORRELATION MATRIX
          </h2>
          <p className="text-sm text-terminal-muted font-mono">
            Loading correlation analysis...
          </p>
        </div>
        <SkeletonLoader variant="table" className="w-full" />
      </div>
    );
  }

  if (!correlationData || !correlationData.factors.length) {
    return (
      <div className="terminal-card">
        <p className="text-sm text-terminal-muted font-mono">
          Insufficient data for correlation analysis. Check component data availability.
        </p>
      </div>
    );
  }

  const { factors, matrix, significance } = correlationData;

  // Find strongest correlations
  const strongCorrelations = [];
  for (let i = 0; i < factors.length; i++) {
    for (let j = i + 1; j < factors.length; j++) {
      const corr = matrix[i][j];
      const sig = significance[i][j];
      if (Math.abs(corr) > 0.4 && sig) {
        strongCorrelations.push({
          factor1: factors[i],
          factor2: factors[j],
          correlation: corr
        });
      }
    }
  }

  strongCorrelations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
            Analytics • Correlation Analysis
          </p>
          <h2 className="text-xl font-bold uppercase text-terminal-text font-mono">
            CORRELATION MATRIX
          </h2>
          <p className="text-sm text-terminal-muted font-mono">
            Risk factor relationships and statistical significance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeWindow}
            onChange={(e) => setSelectedTimeWindow(e.target.value)}
            className="bg-terminal-surface border border-terminal-border rounded px-3 py-1 text-sm font-mono text-terminal-text"
          >
            <option value="7D">7 Days</option>
            <option value="30D">30 Days</option>
            <option value="90D">90 Days</option>
          </select>
          <div className="text-sm text-terminal-muted font-mono">
            Updated: {new Date(correlationData.updatedAt).toLocaleTimeString()} UTC
          </div>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            FACTOR CORRELATION MATRIX
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Pearson correlations • {selectedTimeWindow} rolling window
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${factors.length}, 60px)` }}>
              <div className="p-2"></div>
              {factors.map((factor, i) => (
                <div
                  key={i}
                  className="p-2 text-center font-mono text-xs font-semibold text-terminal-text transform -rotate-45 origin-center"
                  style={{ height: '60px', display: 'flex', alignItems: 'end', justifyContent: 'center' }}
                >
                  {factor.slice(0, 8)}
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            {factors.map((factor, i) => (
              <div key={i} className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${factors.length}, 60px)` }}>
                <div className="p-2 font-mono text-xs font-semibold text-terminal-text border border-terminal-border bg-terminal-surface">
                  {factor}
                </div>
                {factors.map((_, j) => (
                  <CorrelationCell
                    key={j}
                    value={matrix[i][j]}
                    significant={significance[i][j]}
                    factor1={factors[i]}
                    factor2={factors[j]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-terminal-red"></div>
              <span>Strong (|r| &gt; 0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-terminal-orange"></div>
              <span>Moderate (|r| &gt; 0.4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-terminal-green/20 border border-terminal-green"></div>
              <span>Weak (|r| &gt; 0.2)</span>
            </div>
          </div>
          <div className="text-xs text-terminal-muted font-mono">
            Significance level: α = 0.05
          </div>
        </div>
      </div>

      {/* Strong Correlations */}
      {strongCorrelations.length > 0 && (
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              SIGNIFICANT CORRELATIONS
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Factor pairs with |r| &gt; 0.4 and p &lt; 0.05
            </p>
          </div>

          <div className="space-y-2">
            {strongCorrelations.slice(0, 5).map((corr, i) => {
              const strength = Math.abs(corr.correlation) > 0.7 ? "Strong" : "Moderate";
              const color = Math.abs(corr.correlation) > 0.7 ? "text-terminal-red" : "text-terminal-orange";
              
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-terminal-surface rounded border border-terminal-border">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-terminal-text">
                      {corr.factor1} ↔ {corr.factor2}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`font-mono text-sm font-semibold ${color}`}>
                      {corr.correlation.toFixed(3)}
                    </div>
                    <div className="text-xs text-terminal-muted font-mono">
                      {strength}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors">
          Explain Methodology →
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
          Export Matrix
        </button>
      </div>
    </div>
  );
}
