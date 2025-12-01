"use client";

import { useProviderHealthHistory } from "@/hooks/useProviderHealthHistory";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function ProviderReliabilityTrend() {
  const { data, isLoading } = useProviderHealthHistory(10);
  const isClient = useIsClient();

  if (isLoading) {
    return <SkeletonLoader variant="chart" className="h-48" />;
  }

  const history = data?.history || {};
  const providers = Object.keys(history);
  if (providers.length === 0) {
    return (
      <div className="terminal-card">
        <p className="text-sm text-terminal-muted">No provider history available.</p>
      </div>
    );
  }

  // Normalize into chart-friendly rows keyed by timestamp
  const timelineMap: Record<string, Record<string, number>> = {};
  providers.forEach((provider) => {
    (history[provider] || []).forEach((point) => {
      if (!timelineMap[point.timestamp]) {
        timelineMap[point.timestamp] = {};
      }
      timelineMap[point.timestamp][provider] = point.reliability;
    });
  });

  const chartData = Object.entries(timelineMap)
    .map(([timestamp, values]) => ({
      timestamp,
      ...(values as Record<string, number>),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <section className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Provider Health</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">Reliability Trend</h3>
        </div>
      </div>
      <div className="h-48 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={(p: { timestamp: string }) =>
                  new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, name: string) => [`${(val * 100).toFixed(1)}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
              {providers.map((provider, idx) => (
                <Line
                  key={provider}
                  type="monotone"
                  dataKey={provider}
                  stroke={["#1e3a8a", "#10b981", "#f59e0b", "#dc2626"][idx % 4]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-48" />
        )}
      </div>
    </section>
  );
}
