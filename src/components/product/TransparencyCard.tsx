"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { useTransparencyStatus } from "@/hooks/useTransparencyStatus";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { TransparencyStatus } from "@/lib/types";

export default function TransparencyCard() {
  const { data, isLoading } = useTransparencyStatus();
  const isClient = useIsClient();
  const transparency = data as TransparencyStatus | undefined;

  if (isLoading) {
    return <SkeletonLoader variant="card" />;
  }

  const l1 = transparency?.cache_layers?.l1_redis;
  const l2 = transparency?.cache_layers?.l2_postgresql;
  const l3 = transparency?.cache_layers?.l3_file_store;

  const gaugeData = [
    { name: "L1 Redis", value: l1?.fresh_percentage ?? 0, color: "#1e3a8a" },
    { name: "L2 Postgres", value: l2?.fresh_percentage ?? 0, color: "#0ea5e9" },
    { name: "L3 File", value: l3?.fresh_percentage ?? 0, color: "#10b981" },
  ];

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Transparency Portal
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Data Freshness Meter
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-terminal-text">
          {transparency?.cache_layers?.l2_postgresql?.fresh_percentage 
            ? `${Math.round(transparency.cache_layers.l2_postgresql.fresh_percentage)}%` 
            : "--"}
        </p>
        <p className="text-xs text-terminal-muted">
          Cache Status: {transparency?.overall_status?.toUpperCase() || "UNKNOWN"} · Updated{" "}
          {transparency &&
            new Date(transparency.timestamp).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-terminal-muted">
          Cache Layers
        </p>
        {transparency?.cache_layers && Object.entries(transparency.cache_layers).filter(([key]) => key !== 'unified_status').map(([layerName, layer]) => (
          <div
            key={layerName}
            className="flex items-center justify-between rounded border border-terminal-border bg-terminal-bg px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold text-terminal-text">
                {layerName.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xs text-terminal-muted">
                Status: {"status" in layer ? (layer as { status: string }).status : "unified"}
              </p>
            </div>
            <StatusBadge
              variant={
                ("status" in layer && (layer as { status: string }).status === "unavailable")
                  ? "critical"
                  : ("status" in layer && (layer as { status: string }).status === "empty")
                    ? "warning"
                    : "good"
              }
            >
              {"status" in layer ? (layer as { status: string }).status.toUpperCase() : "UNIFIED"}
            </StatusBadge>
          </div>
        ))}
        {(!transparency?.cache_layers || Object.keys(transparency.cache_layers).length === 0) && !isLoading && (
          <p className="text-sm text-terminal-muted">
            No cache layer data available.
          </p>
        )}
      </div>

      {transparency?.cache_layers && (
        <div className="terminal-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              Freshness Gauges
            </p>
            <StatusBadge variant={transparency.overall_status === "critical" ? "critical" : transparency.overall_status === "degraded" ? "warning" : "good"}>
              {transparency.overall_status.toUpperCase()}
            </StatusBadge>
          </div>
          <div className="h-48 w-full">
            {isClient ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={gaugeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {gaugeData.map((entry, idx) => (
                      <Cell key={`cache-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                    formatter={(val: number, name: string) => [`${val}% fresh`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <SkeletonLoader variant="chart" className="h-48" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
