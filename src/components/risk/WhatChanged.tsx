"use client";

import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useRegimeData } from "@/hooks/useRegimeData";
import { useAlerts } from "@/hooks/useAlerts";

export default function WhatChanged() {
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const { data: regimeData, isLoading: regimeLoading } = useRegimeData();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();

  if (riskLoading || regimeLoading || alertsLoading) {
    return <SkeletonLoader variant="card" />;
  }

  const change24h = riskData?.overview?.change_24h ?? 0;
  const changeColor =
    change24h >= 1 ? "text-terminal-red" : change24h <= -1 ? "text-terminal-green" : "text-terminal-muted";
  const changeLabel = `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)} pts in 24h`;
  const alertCount = alertsData?.anomalies?.length ?? alertsData?.length ?? 0;
  const regime = regimeData?.current ?? "Unknown";
  const narrative = [
    `GRII moved ${changeLabel}.`,
    `Regime: ${regime}${regimeData?.confidence ? ` (${(regimeData.confidence * 100).toFixed(0)}% conf)` : ""}.`,
    alertCount > 0 ? `${alertCount} alerts require attention.` : "No new alerts.",
  ].join(" ");

  return (
    <section className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">What Changed (24h)</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">Key Movements</h3>
        </div>
        <StatusBadge variant="info">Live Data</StatusBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-terminal-text">
        <div className="bg-terminal-surface border border-terminal-border rounded p-3 space-y-1">
          <p className="text-terminal-muted uppercase tracking-wide">GRII Move</p>
          <p className={`text-sm font-bold ${changeColor}`}>{changeLabel}</p>
          <p className="text-terminal-muted">Composite shift over last 24h.</p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded p-3 space-y-1">
          <p className="text-terminal-muted uppercase tracking-wide">Regime</p>
          <p className="text-sm font-bold text-terminal-text">{regime}</p>
          <p className="text-terminal-muted">
            Confidence {regimeData?.confidence ? `${(regimeData.confidence * 100).toFixed(0)}%` : "n/a"}
          </p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded p-3 space-y-1">
          <p className="text-terminal-muted uppercase tracking-wide">Alerts</p>
          <p className="text-sm font-bold text-terminal-text">{alertCount} active</p>
          <p className="text-terminal-muted">Latest anomalies and signals.</p>
        </div>
      </div>
      <p className="text-xs text-terminal-muted font-mono">{narrative}</p>
    </section>
  );
}
