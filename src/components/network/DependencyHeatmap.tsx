"use client";

import { useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Scatter, XAxis, YAxis, Tooltip, ZAxis } from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { NetworkSnapshot } from "@/lib/types";
import { useIsClient } from "@/hooks/useIsClient";

interface DependencyHeatmapProps {
  snapshot: NetworkSnapshot;
}

export default function DependencyHeatmap({ snapshot }: DependencyHeatmapProps) {
  const isClient = useIsClient();

  const data = useMemo(() => {
    const deps = snapshot.partnerDependencies || [];
    if (!deps.length) return [];
    return deps.map((dep, idx) => ({
      x: dep.partner,
      y: dep.dependency,
      z: dep.status === "critical" ? 90 : dep.status === "watch" ? 60 : 30,
      status: dep.status,
      key: `${dep.partner}-${idx}`,
    }));
  }, [snapshot.partnerDependencies]);

  if (!data.length) {
    return <SkeletonLoader variant="chart" className="h-48" />;
  }

  return (
    <div className="terminal-card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">
          Dependency Map
        </p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">
          Partner Dependency Heatmap
        </h3>
      </div>
      <div className="h-56 w-full" style={{ minWidth: 260 }}>
        {isClient ? (
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 40 }}>
              <XAxis dataKey="x" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis dataKey="y" type="category" tick={{ fontSize: 10 }} width={140} />
              <ZAxis dataKey="z" range={[10, 120]} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, name: string, props) => [
                  `${props.payload.status.toUpperCase()} • Risk ${props.payload.z}`,
                  `${props.payload.x} → ${props.payload.y}`,
                ]}
              />
              <Scatter
                dataKey="z"
                fill="#0ea5e9"
                shape="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-56" />
        )}
      </div>
    </div>
  );
}
