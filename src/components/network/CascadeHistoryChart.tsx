"use client";

import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CascadeHistoryResponse } from "@/lib/types";

interface CascadeHistoryChartProps {
  history?: CascadeHistoryResponse;
}

export default function CascadeHistoryChart({ history }: CascadeHistoryChartProps) {
  const isClient = useIsClient();

  if (!history || !history.series || history.series.length === 0) {
    return (
      <div className="terminal-card p-4">
        <p className="text-sm text-terminal-muted font-mono">No cascade history available.</p>
      </div>
    );
  }

  // Normalize series into chart-friendly array by timestamp
  const timestamps = new Set<string>();
  history.series.forEach((s) => s.points.forEach((p) => timestamps.add(p.t)));
  const rows = Array.from(timestamps)
    .sort()
    .map((t) => {
      const row: Record<string, string | number> = { t };
      history.series.forEach((s) => {
        const point = s.points.find((p) => p.t === t);
        if (point) row[s.metric] = point.v;
      });
      return row;
    });

  return (
    <div className="terminal-card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">Cascade History</p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">Timeline</h3>
      </div>
      <div className="h-64 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
              />
              <Legend />
              {history.series.map((s, idx) => (
                <Line
                  key={s.metric}
                  type="monotone"
                  dataKey={s.metric}
                  stroke={idx === 0 ? "#0ea5e9" : idx === 1 ? "#ef4444" : "#10b981"}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-64" />
        )}
      </div>
    </div>
  );
}
