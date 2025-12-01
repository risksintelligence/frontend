"use client";

import { useMemo, useState, useCallback } from "react";
import { useForecastData } from "@/hooks/useForecastData";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type SimulationResult = {
  meanDelta: number;
  p05: number;
  p95: number;
  probGt5: number;
  best: number;
  worst: number;
  distribution: Array<{ bucket: string; count: number }>;
};

function randomNormal() {
  const u = Math.random() || 1e-9;
  const v = Math.random() || 1e-9;
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export default function SimulationRunner() {
  const { data: forecastData, isLoading: forecastLoading } = useForecastData();
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const isClient = useIsClient();

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const runSimulation = useCallback(() => {
    if (!forecastData || !riskData?.overview) return;
    setRunning(true);
    // Inputs
    const mean = forecastData.delta24h ?? 0;
    const sigma =
      forecastData.points && forecastData.points.length > 0
        ? Math.max(0.2, Math.abs((forecastData.points.at(-1)!.upper - forecastData.points.at(-1)!.lower) / 2))
        : 1.0;
    const baseScore = riskData.overview.score ?? 50;
    const iterations = 2000;

    const samples: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const delta = mean + sigma * randomNormal();
      samples.push(baseScore + delta);
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const p = (q: number) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(q * sorted.length)))] ?? baseScore;
    const meanDelta = samples.reduce((s, v) => s + (v - baseScore), 0) / iterations;
    const probGt5 = samples.filter((v) => v - baseScore > 5).length / iterations;

    // Build distribution (histogram)
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const bins = 15;
    const step = (max - min || 1) / bins;
    const dist = Array.from({ length: bins }, (_, i) => ({
      bucket: `${(min + i * step).toFixed(1)}–${(min + (i + 1) * step).toFixed(1)}`,
      count: 0,
    }));
    samples.forEach((v) => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((v - min) / step)));
      dist[idx].count += 1;
    });

    setResult({
      meanDelta,
      p05: p(0.05),
      p95: p(0.95),
      probGt5,
      best: max,
      worst: min,
      distribution: dist,
    });
    setLastRunAt(new Date().toISOString());
    setRunning(false);
  }, [forecastData, riskData]);

  const disabled = running || forecastLoading || riskLoading || !forecastData || !riskData?.overview;

  const summaryCards = useMemo(() => {
    if (!result) return null;
    return [
      { label: "Mean Δ", value: `${result.meanDelta.toFixed(2)} pts` },
      { label: "P05 / P95", value: `${result.p05.toFixed(1)} / ${result.p95.toFixed(1)}` },
      { label: "Pr(Δ>5)", value: `${(result.probGt5 * 100).toFixed(1)}%` },
      { label: "Worst / Best", value: `${result.worst.toFixed(1)} / ${result.best.toFixed(1)}` },
    ];
  }, [result]);

  if (forecastLoading || riskLoading) {
    return <SkeletonLoader variant="card" />;
  }

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Monte Carlo</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Forecast & Stress Simulation
          </h3>
          <p className="text-xs text-terminal-muted">
            Uses forecast delta and GRII baseline to generate probabilistic outcomes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant={result ? "good" : "warning"}>
            {result ? "Ready" : "Idle"}
          </StatusBadge>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 text-cyan-700 border border-cyan-600/30 rounded font-mono text-sm hover:bg-cyan-600/30 transition-colors disabled:opacity-50"
            onClick={runSimulation}
            disabled={disabled}
          >
            {running ? "Running…" : "Run New Simulation"}
          </button>
        </div>
      </div>

      {summaryCards && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-terminal-surface border border-terminal-border rounded p-3">
              <p className="text-xs text-terminal-muted uppercase tracking-wide">{card.label}</p>
              <p className="text-sm font-semibold text-terminal-text">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="h-64 w-full">
        {isClient && result ? (
          <ResponsiveContainer>
            <ComposedChart data={result.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bucket" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, name: string) => [`${val} sims`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Bar dataKey="count" fill="#0ea5e9" name="Frequency" />
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="#bae6fd" name="Density" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-64" />
        )}
      </div>
      {lastRunAt && (
        <p className="text-[11px] text-terminal-muted font-mono">Last run: {new Date(lastRunAt).toLocaleTimeString()}</p>
      )}
    </section>
  );
}
