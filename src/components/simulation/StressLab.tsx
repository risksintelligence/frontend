"use client";

import { useState, useMemo } from "react";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useComponentsData } from "@/hooks/useComponentsData";
import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";

type Scenario = {
  id: string;
  name: string;
  description: string;
  shocks: Array<{ component: string; delta: number }>;
};

type StressResult = {
  scenarioId: string;
  stressedScore: number;
  baseScore: number;
  deltas: Array<{ component: string; newValue: number; delta: number }>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "rate_spike",
    name: "Rate Shock +50 bps",
    description: "YIELD_CURVE up 50 bps; spreads widen modestly.",
    shocks: [
      { component: "YIELD_CURVE", delta: 0.5 },
      { component: "CREDIT_SPREAD", delta: 0.2 },
    ],
  },
  {
    id: "energy_spike",
    name: "Energy Spike +10%",
    description: "WTI_OIL up 10%; freight/diesel costs rise.",
    shocks: [
      { component: "WTI_OIL", delta: 0.1 * 10 },
      { component: "FREIGHT_DIESEL", delta: 0.1 * 5 },
    ],
  },
  {
    id: "macro_slowdown",
    name: "Macro Slowdown",
    description: "PMI -3 pts; unemployment uptick; VIX +5.",
    shocks: [
      { component: "PMI", delta: -3 },
      { component: "UNEMPLOYMENT", delta: 0.3 },
      { component: "VIX", delta: 5 },
    ],
  },
];

export default function StressLab() {
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const { data: componentsData, isLoading: compLoading } = useComponentsData();
  const isClient = useIsClient();

  const [selectedScenario, setSelectedScenario] = useState<string>(SCENARIOS[0].id);
  const [result, setResult] = useState<StressResult | null>(null);

  const baseScore = riskData?.overview?.score ?? 50;
  const components = componentsData?.components ?? [];

  const runStress = () => {
    const scenario = SCENARIOS.find((s) => s.id === selectedScenario);
    if (!scenario) return;

    // Simple deterministic stress: each component delta impacts GRII by factor
    const impactFactor = 1.2; // tune as needed
    const deltas: StressResult["deltas"] = scenario.shocks.map((shock) => {
      const comp = components.find((c) => c.id.toUpperCase() === shock.component.toUpperCase());
      const baseVal = comp?.value ?? 0;
      return { component: shock.component, newValue: baseVal + shock.delta, delta: shock.delta };
    });

    const totalImpact = deltas.reduce((sum, d) => sum + d.delta * impactFactor, 0);
    const stressedScore = baseScore + totalImpact;

    setResult({
      scenarioId: scenario.id,
      stressedScore,
      baseScore,
      deltas,
    });
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.deltas.map((d) => ({
      component: d.component,
      delta: d.delta,
      newValue: d.newValue,
    }));
  }, [result]);

  if (riskLoading || compLoading) {
    return <SkeletonLoader variant="card" />;
  }

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Stress Testing Lab</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">Tail-Risk Scenarios</h3>
          <p className="text-xs text-terminal-muted">Applies shocks to live components to project GRII under stress.</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge variant={result ? "warning" : "info"}>
            {result ? "Result Ready" : "Pick Scenario"}
          </StatusBadge>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-700 border border-red-600/30 rounded font-mono text-sm hover:bg-red-600/30 transition-colors"
            onClick={runStress}
          >
            Run Stress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`text-left rounded border p-3 transition-colors ${
              selectedScenario === scenario.id
                ? "border-red-500/50 bg-red-500/10"
                : "border-terminal-border hover:bg-terminal-surface"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-terminal-muted">{scenario.name}</p>
            <p className="text-sm text-terminal-text">{scenario.description}</p>
          </button>
        ))}
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-terminal-surface border border-terminal-border rounded p-3">
            <p className="text-xs text-terminal-muted uppercase tracking-wide">Base GRII</p>
            <p className="text-xl font-bold text-terminal-text">{result.baseScore.toFixed(1)} pts</p>
          </div>
          <div className="bg-terminal-surface border border-terminal-border rounded p-3">
            <p className="text-xs text-terminal-muted uppercase tracking-wide">Stressed GRII</p>
            <p className="text-xl font-bold text-terminal-text">{result.stressedScore.toFixed(1)} pts</p>
          </div>
          <div className="bg-terminal-surface border border-terminal-border rounded p-3">
            <p className="text-xs text-terminal-muted uppercase tracking-wide">Δ GRII</p>
            <p className={`text-xl font-bold ${result.stressedScore - result.baseScore >= 0 ? "text-terminal-red" : "text-terminal-green"}`}>
              {(result.stressedScore - result.baseScore).toFixed(2)} pts
            </p>
          </div>
        </div>
      )}

      <div className="h-64 w-full">
        {isClient && result ? (
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="component" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number, name: string) => [`${val.toFixed(2)}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Bar dataKey="delta" fill="#ef4444" name="Shock Δ" />
              <Line type="monotone" dataKey="newValue" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} name="New Value" />
              <Area type="monotone" dataKey="delta" stroke="#ef4444" fill="#fecdd3" name="Shock Area" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-64" />
        )}
      </div>
    </section>
  );
}
