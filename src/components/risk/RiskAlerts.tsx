"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { useAlerts } from "@/hooks/useAlerts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Alert } from "@/lib/types";

export default function RiskAlerts() {
  const { data, isLoading } = useAlerts();

  if (isLoading) {
    return <SkeletonLoader variant="card" />;
  }

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-terminal-muted">
          Active Alerts
        </h3>
      </div>
      <div className="space-y-3">
        {data?.anomalies?.map((alert: Alert, index: number) => (
          <article key={alert.id || index} className="rounded border border-terminal-border bg-terminal-bg p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <StatusBadge
                variant={
                  alert.classification === "critical" || (alert.score ?? 0) > 0.8
                    ? "critical"
                    : alert.classification === "anomaly" || (alert.score ?? 0) > 0.4
                      ? "warning"
                      : "info"
                }
              >
                {alert.classification?.toUpperCase() || "NORMAL"}
              </StatusBadge>
              <p className="text-[11px] text-terminal-muted">
                {new Date(alert.timestamp).toLocaleString()} · {alert.drivers?.join(', ') || 'System Alert'}
              </p>
            </div>
            <p className="text-sm font-semibold text-terminal-text">
              Risk Score: {alert.score?.toFixed(2)} - {alert.classification || 'No anomalies detected'}
            </p>
          </article>
        ))}
        {!data?.anomalies?.length && !isLoading && (
          <p className="text-sm text-terminal-muted">
            No live alerts. Connect RRIO anomaly endpoints to stream updates.
          </p>
        )}
      </div>
    </section>
  );
}
