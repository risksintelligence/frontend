"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { RegimeDriver, ForecastDriver } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";

type Driver = RegimeDriver | ForecastDriver;

interface DriverImpactChartProps {
  title: string;
  subtitle?: string;
  drivers: Driver[];
  dataKey: "importance" | "contribution";
}

export default function DriverImpactChart({ title, subtitle, drivers, dataKey }: DriverImpactChartProps) {
  const isClient = useIsClient();

  if (!drivers || drivers.length === 0) {
    return (
      <div className="terminal-card">
        <p className="text-sm text-terminal-muted">Explainability data unavailable.</p>
      </div>
    );
  }

  const chartData = drivers
    .slice(0, 8)
    .map((d) => ({
      name: d.feature.replace(/_/g, " ").toUpperCase(),
      impact: Number((d as RegimeDriver & ForecastDriver)[dataKey] ?? 0),
      magnitude: Math.abs(Number((d as RegimeDriver & ForecastDriver)[dataKey] ?? 0)),
      value: Number((d as RegimeDriver & ForecastDriver).value ?? 0),
    }))
    .sort((a, b) => b.magnitude - a.magnitude);

  return (
    <section className="terminal-card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">Explainability</p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">{title}</h3>
        {subtitle && <p className="text-xs text-terminal-muted">{subtitle}</p>}
      </div>
      <div className="h-64 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 8, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, name: string) => [`${val.toFixed(3)}`, name]}
              />
              <Area type="monotone" dataKey="magnitude" fill="#bfdbfe" stroke="#1e3a8a" name="Magnitude" />
              <Line type="monotone" dataKey="impact" stroke="#f59e0b" strokeWidth={2} dot={false} name="Impact" />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} name="Feature Value" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-64" />
        )}
      </div>
    </section>
  );
}
