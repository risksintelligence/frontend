"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ForecastDriver } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";

interface ShapWaterfallProps {
  drivers: ForecastDriver[];
  baseline?: number;
  title?: string;
}

export default function ShapWaterfall({
  drivers,
  baseline = 0,
  title = "SHAP Waterfall",
}: ShapWaterfallProps) {
  const isClient = useIsClient();
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const topDrivers = drivers.slice(0, 6);

  const chartData = useMemo(() => {
    return topDrivers.map((driver) => {
      const scale = adjustments[driver.feature] ?? 1;
      return {
        name: driver.feature.replace(/_/g, " ").toUpperCase(),
        contribution: Number((driver.contribution * scale).toFixed(3)),
        coef: driver.coef,
        value: driver.value,
        scale,
      };
    });
  }, [topDrivers, adjustments]);

  const totalImpact = chartData.reduce((sum, d) => sum + d.contribution, 0);
  const adjustedDelta = baseline + totalImpact;

  if (!drivers.length) {
    return <SkeletonLoader variant="card" />;
  }

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Explainability
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-terminal-muted">Baseline: {baseline.toFixed(2)} pts</p>
          <p className="text-xs text-terminal-text font-mono">
            Adjusted ΔGRII: {adjustedDelta.toFixed(2)} pts
          </p>
        </div>
      </div>

      <div className="h-64 w-full" style={{ minWidth: 240 }}>
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={180} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, _name, props) => [
                  `${val.toFixed(3)} pts`,
                  `Contribution (${(props.payload as { scale: number }).scale.toFixed(2)}x)`,
                ]}
              />
              <Bar dataKey="contribution" fill="#1e3a8a" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-64" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chartData.map((driver) => (
          <div key={driver.name} className="rounded border border-terminal-border bg-terminal-bg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-terminal-text">{driver.name}</p>
              <span className="text-xs font-mono text-terminal-muted">
                Coef {driver.coef.toFixed(3)}
              </span>
            </div>
            <div className="text-sm font-mono text-terminal-text">
              Contribution: {driver.contribution.toFixed(3)} pts
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-terminal-muted font-mono">Adjust scenario</label>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={driver.scale}
                onChange={(e) =>
                  setAdjustments((prev) => ({
                    ...prev,
                    [driver.name.replace(/ /g, "_").toLowerCase()]: Number(e.target.value),
                  }))
                }
                className="w-full accent-terminal-text"
              />
              <div className="text-[11px] text-terminal-muted font-mono">
                {driver.scale.toFixed(2)}x impact
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
