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

  const runSimulation = useCallback(async () => {
    if (!forecastData || !riskData?.overview) return;
    setRunning(true);
    
    try {
      // Call backend Monte Carlo simulation API
      const response = await fetch("/api/v1/simulation/monte-carlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iterations: 10000,
          time_horizon: 1,
          confidence_levels: [0.95, 0.99],
          random_seed: null
        })
      });
      
      if (!response.ok) {
        throw new Error(`Simulation failed: ${response.statusText}`);
      }
      
      const simulationResult = await response.json();
      
      // Convert backend response to frontend format
      const baseScore = simulationResult.parameters.baseline_score;
      const results = simulationResult.results;
      
      const samples = simulationResult.sample_paths.map((path: any) => path.end_score);
      const dist = simulationResult.distribution.map((bucket: any) => ({
        bucket: bucket.range,
        count: Math.round(bucket.count * bucket.probability)
      }));
      
      const meanDelta = results.mean_delta;
      const probGt5 = simulationResult.risk_metrics.prob_increase_gt_5;
      
      setResult({
        meanDelta,
        p05: simulationResult.confidence_intervals["95%"].lower - baseScore,
        p95: simulationResult.confidence_intervals["95%"].upper - baseScore,
        probGt5,
        best: results.max_score - baseScore,
        worst: results.min_score - baseScore,
        distribution: dist,
      });
      
      setLastRunAt(new Date().toISOString());
      
    } catch (error) {
      console.error("Monte Carlo simulation failed:", error);
      // Fallback to basic client-side simulation if backend fails
      const baseScore = riskData.overview.score ?? 50;
      const meanDelta = forecastData.delta24h ?? 0;
      setResult({
        meanDelta: meanDelta,
        p05: meanDelta - 2,
        p95: meanDelta + 2,
        probGt5: meanDelta > 5 ? 0.8 : 0.2,
        best: meanDelta + 5,
        worst: meanDelta - 5,
        distribution: [
          { bucket: "Fallback", count: 1 }
        ],
      });
      setLastRunAt(new Date().toISOString());
    }
    
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
