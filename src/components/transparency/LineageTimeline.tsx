"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { TransparencyLineage } from "@/lib/types";
import { useIsClient } from "@/hooks/useIsClient";

interface LineageTimelineProps {
  lineage: TransparencyLineage;
}

export default function LineageTimeline({ lineage }: LineageTimelineProps) {
  const isClient = useIsClient();
  const chartData =
    lineage.observations.slice(0, 20).map((obs) => ({
      timestamp: obs.observed_at,
      age: obs.age_hours,
      status: obs.soft_ttl && obs.hard_ttl ? obs.age_hours > obs.hard_ttl / 3600 ? "expired" : obs.age_hours > obs.soft_ttl / 3600 ? "stale" : "fresh" : "unknown",
    })) ?? [];

  if (!chartData.length) {
    return <SkeletonLoader variant="chart" className="h-40" />;
  }

  return (
    <div className="terminal-card">
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-terminal-muted">Lineage Timeline</p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">
          Observation Age (hrs)
        </h3>
      </div>
      <div className="h-48 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={(p) =>
                  new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number) => `${val.toFixed(1)} hrs`}
              />
              <Line
                type="monotone"
                dataKey="age"
                stroke="#1e3a8a"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-48" />
        )}
      </div>
    </div>
  );
}
