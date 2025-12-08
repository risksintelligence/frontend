"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { getGaugeColor, getRiskTextColor } from "@/lib/risk-colors";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";

interface RiskDataPoint {
  timestamp: string;
  value: number;
  driver?: string;
}

interface RealTimeRiskChartProps {
  data: RiskDataPoint[];
  currentScore: number;
  change: number;
  title?: string;
  height?: number;
  showDrivers?: boolean;
  updatedAt?: string;
}

function RiskChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const point = payload[0].payload as RiskDataPoint;
    return (
      <div className="rounded border border-terminal-border bg-terminal-bg p-3 shadow-lg">
        <p className="text-xs font-mono text-terminal-text">
          {new Date(String(label)).toLocaleTimeString()}
        </p>
        <p className={`text-sm font-bold font-mono ${getRiskTextColor(point.value)}`}>
          GRII: {point.value.toFixed(1)}
        </p>
        {point.driver && (
          <p className="text-xs font-mono text-terminal-muted">Driver: {point.driver}</p>
        )}
      </div>
    );
  }
  return null;
}

export default function RealTimeRiskChart({
  data,
  currentScore,
  change,
  title = "Real-Time Risk",
  height = 200,
  showDrivers = true,
  updatedAt,
}: RealTimeRiskChartProps) {
  const isClientLoaded = useIsClient();

  const gaugeColor = getGaugeColor(currentScore);
  const changeColor = change >= 0 ? "text-terminal-red" : "text-terminal-green";
  const changeSymbol = change >= 0 ? "▲" : "▼";

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Find critical risk threshold crossings for reference lines
  const criticalThreshold = 70;
  const moderateThreshold = 40;

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Risk Intelligence
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title} Sparkline
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge 
            variant={currentScore >= 70 ? "critical" : currentScore >= 40 ? "warning" : "good"}
          >
            {currentScore.toFixed(1)}
          </StatusBadge>
          <span className={`text-sm font-mono ${changeColor}`}>
            {changeSymbol} {Math.abs(change).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="w-full" style={{ height: Math.max(height, 150), minWidth: 200, minHeight: 150 }}>
        {isClientLoaded && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={150} aspect={undefined}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            
            {/* Risk threshold reference lines */}
            <ReferenceLine
              y={criticalThreshold}
              stroke="#dc2626"
              strokeDasharray="2 2"
              strokeWidth={1}
            />
            <ReferenceLine
              y={moderateThreshold}
              stroke="#f59e0b"
              strokeDasharray="2 2"
              strokeWidth={1}
            />
            
            <Tooltip content={<RiskChartTooltip />} />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={gaugeColor}
              strokeWidth={2}
              dot={{ fill: gaugeColor, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: gaugeColor }}
            />
          </LineChart>
        </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-[200px]" />
        )}
      </div>

      {showDrivers && data.length > 0 && (
        <div className="bg-terminal-surface rounded border border-terminal-border p-3">
          <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
            Recent Drivers
          </p>
          <div className="space-y-1">
            {data.slice(-3).reverse().map((point, index) => (
              point.driver && (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-xs text-terminal-text font-mono">
                    {point.driver}
                  </p>
                  <p className={`text-xs font-mono ${getRiskTextColor(point.value)}`}>
                    {point.value.toFixed(1)}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono">
          Live Data · Updated {updatedAt ? new Date(updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors">
          Explain Risk Drivers →
        </button>
      </div>
    </section>
  );
}
