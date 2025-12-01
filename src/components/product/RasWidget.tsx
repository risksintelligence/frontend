"use client";

import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRasSummary } from "@/hooks/useRasSummary";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useRasHistory } from "@/hooks/useRasHistory";
import RasHistorySparkline from "@/components/product/RasHistorySparkline";

export default function RasWidget() {
  const { data, isLoading } = useRasSummary();
  const { data: history } = useRasHistory(30);

  if (isLoading) {
    return <SkeletonLoader variant="gauge" columns={2} />;
  }

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Resilience Activation Score
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Mission & Impact Pulse
          </h3>
        </div>
      </div>

      <MetricCard
        title="RAS Value"
        value={data ? data.score : "72"}
        description="Composite of policy, mission, partner, and media signals."
        riskScore={data?.score ?? 72}
        trend={data && data.delta >= 0 ? "rising" : "stable"}
        footer={
          data && data.delta != null ? `Δ ${data.delta >= 0 ? "+" : ""}${data.delta.toFixed(1)} pts` : "Δ +2.1 pts"
        }
        timestamp={data?.updatedAt ?? new Date().toISOString()}
      />

      <div className="grid grid-cols-2 gap-3">
        {data?.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded border border-terminal-border bg-terminal-bg p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-terminal-muted">
                {metric.label}
              </p>
              <StatusBadge variant={metric.status as "good" | "warning" | "critical"}>
                {metric.status?.toUpperCase() || "UNKNOWN"}
              </StatusBadge>
            </div>
            <p className="text-xl font-bold text-terminal-text">
              {metric.value}
            </p>
            <p className="text-xs text-terminal-muted">
              Δ {metric.change >= 0 ? "+" : ""}
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {data?.partners && (
        <div className="rounded border border-terminal-border bg-terminal-bg p-3">
          <p className="text-xs font-semibold uppercase text-terminal-muted">
            Featured Partners
          </p>
          <p className="text-sm text-terminal-text">
            {data.partners.join(" · ")}
          </p>
        </div>
      )}

      {history && history.length > 0 && (
        <RasHistorySparkline history={history} title="RAS History (30d)" />
      )}
    </section>
  );
}
