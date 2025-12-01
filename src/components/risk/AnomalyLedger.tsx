"use client";

import { useAlerts } from "@/hooks/useAlerts";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "@/hooks/useIsClient";
import { Alert } from "@/lib/types";

export default function AnomalyLedger() {
  const { data, isLoading } = useAlerts();
  const isClient = useIsClient();

  if (isLoading) {
    return <SkeletonLoader variant="chart" />;
  }

  const severityCounts = ["critical", "high", "medium", "low"].map(
    (severity) => ({
      severity,
      count: data?.anomalies?.filter((alert: Alert) => alert.severity === severity).length ?? 0,
    }),
  );

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Anomaly Ledger
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Sorted by Severity
          </h3>
        </div>
      </div>

      <div className="h-32 w-full" style={{ minWidth: 200, minHeight: 120 }}>
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={120}>
          <BarChart data={severityCounts}>
            <XAxis
              dataKey="severity"
              tick={{ fontSize: 10 }}
              tickFormatter={(s) => s.toUpperCase()}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-[120px]" />
        )}
      </div>

      <div className="space-y-2">
        {data?.anomalies?.map((alert: Alert, index: number) => (
          <article
            key={alert.id || index}
            className="rounded border border-terminal-border bg-terminal-bg p-3"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={
                    alert.severity === "critical"
                      ? "critical"
                      : alert.severity === "high"
                        ? "warning"
                        : "info"
                  }
                >
                  {alert.severity?.toUpperCase() || "UNKNOWN"}
                </StatusBadge>
                <p className="text-sm font-semibold text-terminal-text">
                  {alert.driver}
                </p>
              </div>
              <p className="text-[11px] text-terminal-muted">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-terminal-text">{alert.message}</p>
          </article>
        ))}
        {!data?.anomalies?.length && !isLoading && (
          <p className="text-sm text-terminal-muted">
            No anomalies currently detected. Alerts will appear here when available.
          </p>
        )}
      </div>
    </section>
  );
}
