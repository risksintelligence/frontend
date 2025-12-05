"use client";

import { useIsClient } from "@/hooks/useIsClient";
import { useAlerts } from "@/hooks/useAlerts";
import { useAnomalyHistory } from "@/hooks/useAnomalyHistory";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Alert } from "@/lib/types";

export default function AnomalyTimeline() {
  const { data: latestAlerts, isLoading } = useAlerts();
  const { data: historyData } = useAnomalyHistory(30);
  const isClient = useIsClient();

  if (isLoading) {
    return <SkeletonLoader variant="chart" className="h-48" />;
  }

  const historical = historyData?.history || [];
  const anomalies =
    historical.length > 0
      ? historical.map((h) => ({
          timestamp: h.timestamp,
          severity: h.severity,
        }))
      : Array.isArray(latestAlerts?.anomalies) ? latestAlerts.anomalies.slice(0, 20).map((a) => ({
          timestamp: a.timestamp,
          severity: (a as Alert).severity,
        })) : [];
  if (!anomalies.length) {
    return (
      <div className="terminal-card">
        <p className="text-sm text-terminal-muted font-mono">
          No anomalies detected. Timeline will appear when alerts are available.
        </p>
      </div>
    );
  }

  const chartData = anomalies
    .map((a) => ({
      timestamp: a.timestamp,
      value: a.severity === "critical" ? 90 : a.severity === "high" ? 70 : a.severity === "medium" ? 50 : 25,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Anomaly History</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Severity Timeline
          </h3>
        </div>
      </div>
      <div className="h-48 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={(p) =>
                  new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number) => `${val.toFixed(0)} severity`}
              />
              <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-48" />
        )}
      </div>
    </div>
  );
}
