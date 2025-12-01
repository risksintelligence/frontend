"use client";

import { getGaugeColor, getRiskTextColor, getAccessibilityPattern } from "@/lib/risk-colors";
import StatusBadge from "@/components/ui/StatusBadge";

interface GaugeData {
  id: string;
  label: string;
  value: number;
  unit: string;
  changePercent: number;
  category: "growth" | "inflation" | "employment" | "market";
  updatedAt: string;
}

interface EconomicGaugeDashboardProps {
  indicators: GaugeData[];
  title?: string;
  updatedAt?: string;
}

const Gauge = ({ value, maxValue = 100, size = 80 }: { value: number; maxValue?: number; size?: number }) => {
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const angle = (percentage / 100) * 180; // Half circle gauge
  const radius = size / 2 - 8;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate needle position
  const needleAngle = (angle - 90) * (Math.PI / 180);
  const needleLength = radius - 10;
  const needleX = centerX + needleLength * Math.cos(needleAngle);
  const needleY = centerY + needleLength * Math.sin(needleAngle);
  
  const gaugeColor = getGaugeColor(value);

  return (
    <svg width={size} height={size / 2 + 10}>
      {/* Background arc */}
      <path
        d={`M 8 ${centerY} A ${radius} ${radius} 0 0 1 ${size - 8} ${centerY}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="6"
      />
      
      {/* Value arc */}
      <path
        d={`M 8 ${centerY} A ${radius} ${radius} 0 0 1 ${8 + (angle / 180) * (size - 16)} ${centerY - Math.sin((angle * Math.PI) / 180) * radius}`}
        fill="none"
        stroke={gaugeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Center dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r="3"
        fill="#334155"
      />
      
      {/* Needle */}
      <line
        x1={centerX}
        y1={centerY}
        x2={needleX}
        y2={needleY}
        stroke="#334155"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function EconomicGaugeDashboard({ 
  indicators, 
  title = "Economic Intelligence",
  updatedAt 
}: EconomicGaugeDashboardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "growth": return "border-emerald-700 bg-emerald-50";
      case "inflation": return "border-orange-700 bg-orange-50";
      case "employment": return "border-sky-700 bg-sky-50";
      case "market": return "border-purple-700 bg-purple-50";
      default: return "border-terminal-border bg-terminal-surface";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "growth": return "📈";
      case "inflation": return "💰";
      case "employment": return "👥";
      case "market": return "📊";
      default: return "📋";
    }
  };

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Economic Metrics
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title} Dashboard
          </h3>
        </div>
        <StatusBadge variant="info">
          {indicators.length} INDICATORS
        </StatusBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((indicator) => {
          const riskScore = Math.abs(indicator.changePercent) * 20; // Convert change to risk score
          const riskColor = getRiskTextColor(riskScore);
          const accessibilityPattern = getAccessibilityPattern(riskScore);
          const categoryColor = getCategoryColor(indicator.category);
          const categoryIcon = getCategoryIcon(indicator.category);
          const changeColor = indicator.changePercent >= 0 ? "text-terminal-red" : "text-terminal-green";
          const changeSymbol = indicator.changePercent >= 0 ? "▲" : "▼";

          return (
            <div
              key={indicator.id}
              className={`rounded border-2 p-4 ${categoryColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{categoryIcon}</span>
                  <p className="text-xs font-semibold text-terminal-text font-mono uppercase">
                    {indicator.category}
                  </p>
                </div>
                <span className={`text-xs font-mono ${riskColor}`}>
                  {accessibilityPattern}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-terminal-text font-mono">
                    {indicator.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-bold font-mono ${riskColor}`}>
                      {indicator.value}{indicator.unit}
                    </p>
                    <span className={`text-xs font-mono ${changeColor}`}>
                      {changeSymbol} {Math.abs(indicator.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Gauge value={Math.abs(indicator.value)} maxValue={10} size={60} />
              </div>

              <div className="text-xs text-terminal-muted font-mono">
                Updated {new Date(indicator.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      {indicators.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-terminal-muted font-mono">
            No economic indicators currently available.
          </p>
        </div>
      )}

      <div className="bg-terminal-surface rounded border border-terminal-border p-3">
        <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
          Summary Stats
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["growth", "inflation", "employment", "market"].map(category => {
            const categoryIndicators = indicators.filter(i => i.category === category);
            const avgChange = categoryIndicators.length > 0 
              ? categoryIndicators.reduce((sum, i) => sum + Math.abs(i.changePercent), 0) / categoryIndicators.length
              : 0;
            const changeColor = avgChange > 1 ? "text-terminal-red" : avgChange > 0.5 ? "text-terminal-orange" : "text-terminal-green";

            return (
              <div key={category} className="text-center">
                <p className={`text-lg font-bold font-mono ${changeColor}`}>
                  {avgChange.toFixed(1)}%
                </p>
                <p className="text-xs text-terminal-muted font-mono uppercase">
                  Avg {category} Δ
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono">
          Data: Live Data · Updated {updatedAt ? new Date(updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors">
          Explain Economic Drivers →
        </button>
      </div>
    </section>
  );
}