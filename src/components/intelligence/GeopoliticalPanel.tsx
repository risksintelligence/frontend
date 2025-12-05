"use client";

import { useGeopoliticalDisruptions } from "@/hooks/useGeopoliticalDisruptions";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { getRiskLevel } from "@/lib/risk-colors";

export default function GeopoliticalPanel() {
  const { data, isLoading } = useGeopoliticalDisruptions(30);

  const disruptions = data?.disruptions ?? [];
  const events = data?.events ?? [];
  const severityScore = Math.min(100, disruptions.length * 5 + events.length * 2);
  const riskLevel = getRiskLevel(severityScore);

  return (
    <div className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Free Geopolitical Intelligence</p>
          <h3 className="text-xl font-semibold text-terminal-text">Disruptions (Last 30 Days)</h3>
        </div>
        <StatusBadge variant={riskLevel.semanticColor === "red" ? "critical" : riskLevel.semanticColor === "amber" ? "warning" : "good"}>
          {riskLevel.name}
        </StatusBadge>
      </div>

      <MetricCard
        title="Active Disruptions"
        value={isLoading ? "--" : disruptions.length}
        description="Supply chain disruptions derived from GDELT events"
        riskScore={severityScore}
        loading={isLoading}
        timestamp={data?.refreshed_at}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Top Events</p>
          <ul className="space-y-2 text-sm text-terminal-text">
            {(events.slice(0,5)).map((ev) => (
              <li key={ev.event_id} className="flex flex-col rounded border border-terminal-border p-2">
                <span className="font-semibold {riskColor}">{ev.event_type} · {ev.country}</span>
                <span className="text-terminal-muted text-xs">{new Date(ev.event_date).toLocaleString()} • {ev.source}</span>
                <span className="text-terminal-muted text-sm">{ev.description}</span>
              </li>
            ))}
            {(!events.length && !isLoading) && <li className="text-terminal-muted text-xs">No events available</li>}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Routes Impacted</p>
          <ul className="space-y-2 text-sm text-terminal-text">
            {(disruptions.slice(0,5)).map((d) => (
              <li key={d.disruption_id} className="flex flex-col rounded border border-terminal-border p-2">
                <span className="font-semibold">{d.severity.toUpperCase()} · {d.source}</span>
                <span className="text-terminal-muted text-sm">{d.description}</span>
              </li>
            ))}
            {(!disruptions.length && !isLoading) && <li className="text-terminal-muted text-xs">No disruptions available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
