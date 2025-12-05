"use client";

import { useMaritimeHealth } from "@/hooks/useMaritimeHealth";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";

export default function MaritimePanel() {
  const { data, isLoading } = useMaritimeHealth();
  const overview = data?.overview;
  const healthScore = overview?.average_health_score ?? 0;
  const providers = data?.providers ?? [];

  const badgeVariant = healthScore > 0.7 ? "good" : healthScore > 0.4 ? "warning" : "critical";

  return (
    <div className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Free Maritime Intelligence</p>
          <h3 className="text-xl font-semibold text-terminal-text">Provider Health</h3>
        </div>
        <StatusBadge variant={badgeVariant}>
          {healthScore ? `${Math.round(healthScore * 100) / 100}` : "--"}
        </StatusBadge>
      </div>

      <MetricCard
        title="Healthy Providers"
        value={isLoading ? "--" : overview?.healthy_providers ?? 0}
        description="Active free maritime providers (AISHub/NOAA/OpenSeaMap)"
        riskScore={(1 - healthScore) * 100}
        loading={isLoading}
        timestamp={data?.timestamp}
      />

      <div className="grid gap-2 md:grid-cols-2">
        {providers.slice(0,6).map((p) => (
          <div key={p.provider_id} className="rounded border border-terminal-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-terminal-text">{p.name}</span>
              <StatusBadge variant={p.status === "healthy" ? "good" : p.status === "degraded" ? "warning" : "critical"} size="sm">
                {p.status}
              </StatusBadge>
            </div>
            <p className="text-terminal-muted text-xs mt-1">Health: {Math.round(p.health_score * 100)}%</p>
          </div>
        ))}
        {(!providers.length && !isLoading) && <p className="text-terminal-muted text-xs">No provider health data</p>}
      </div>
    </div>
  );
}
