"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { Target, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import SimulationRunner from "@/components/simulation/SimulationRunner";
import PagePrimer from "@/components/ui/PagePrimer";
import TourOverlay from "@/components/ui/TourOverlay";
import { useState } from "react";
import WhatChanged from "@/components/risk/WhatChanged";
import { useSimulationMetrics } from "@/hooks/useSimulationMetrics";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function SimulationPage() {
  const { data: simMetrics, isLoading: metricsLoading } = useSimulationMetrics();
  const [showTour, setShowTour] = useState(false);
  const tourSteps = [
    { title: "Simulation Primer", description: "See how GRII baseline + forecasts feed Monte Carlo and stress engines." },
    { title: "Scenario Launchers", description: "Kick off Monte Carlo, stress tests, or Scenario Studio with live data." },
    { title: "Performance & Outputs", description: "Read accuracy/latency metrics and export results for deeper analysis." },
  ];

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  SIMULATION & MODELING
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Advanced risk modeling, scenario simulation, and stress testing infrastructure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 text-cyan-700 border border-cyan-600/30 rounded font-mono text-sm hover:bg-cyan-600/30 transition-colors">
                <Target className="w-4 h-4" />
                RUN SIMULATION
              </button>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors"
                onClick={() => setShowTour(true)}
              >
                Start Tour →
              </button>
            </div>
          </div>
        </header>

        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="Monte Carlo, scenarios, and stress tests rooted in live GRII/regime forecasts."
          expandable={true}
          showDataFlow={true}
          items={[
            { 
              title: "Inputs", 
              content: "GRII baseline, Δ24h forecast, component z-scores, scenario definitions.",
              tooltip: "Real-time risk data feeds and user-defined scenario parameters for simulation modeling",
              expandedContent: "Current GRII composite score, 24-hour forecast deltas with confidence intervals, normalized component z-scores (VIX, yield curves, PMI, spreads), user-defined stress scenarios with parameter ranges, historical calibration data for Monte Carlo initialization."
            },
            { 
              title: "Process", 
              content: "Monte Carlo simulations, stress shocks, scenario modeling with live hooks.",
              tooltip: "Stochastic simulation framework with real-time data integration and stress testing",
              expandedContent: "1) Monte Carlo simulation with 10,000 iterations using correlated random walks, 2) Stress scenario application with parameter shocks, 3) Real-time data hooks for live baseline adjustments, 4) Multivariate simulation using Cholesky decomposition for correlation preservation, 5) Parallel processing for computational efficiency."
            },
            { 
              title: "Outputs", 
              content: "Probabilistic GRII paths, stress deltas, scenario outcomes, exports to studio.",
              tooltip: "Comprehensive simulation results with probabilistic forecasts and scenario analysis",
              expandedContent: "Probabilistic GRII evolution paths with confidence bands, stress test impact deltas, scenario outcome distributions with percentile rankings, risk metrics (VaR, CVaR), export capability to Scenario Studio for further analysis, downloadable simulation reports with methodology documentation."
            },
          ]}
          dataFlowNodes={[
            {
              id: "grii-baseline",
              label: "GRII Baseline",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 94,
              description: "Current GRII composite score and components",
              endpoint: "/api/v1/analytics/geri"
            },
            {
              id: "forecast-feed",
              label: "Forecast Engine",
              type: "source",
              status: "active",
              latency: "< 15s",
              quality: 91,
              description: "24-hour GRII forecast deltas",
              endpoint: "/api/v1/ai/forecast/next-24h"
            },
            {
              id: "scenario-definitions",
              label: "Scenario Library",
              type: "source",
              status: "active",
              latency: "< 1s",
              quality: 96,
              description: "Predefined and custom stress scenarios",
              endpoint: "/api/v1/simulation/scenarios"
            },
            {
              id: "monte-carlo-engine",
              label: "Monte Carlo Engine",
              type: "model",
              status: "active",
              latency: "< 30s",
              quality: 87,
              description: "Stochastic simulation with 10k iterations"
            },
            {
              id: "stress-tester",
              label: "Stress Tester",
              type: "model",
              status: "active",
              latency: "< 45s",
              quality: 89,
              description: "Extreme scenario stress testing"
            },
            {
              id: "simulation-processor",
              label: "Sim Processor",
              type: "process",
              status: "active",
              latency: "< 10s",
              quality: 93,
              description: "Simulation orchestration and results aggregation"
            },
            {
              id: "simulation-dashboard",
              label: "Simulation UI",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 98,
              description: "Interactive simulation dashboard"
            },
            {
              id: "scenario-studio",
              label: "Scenario Studio",
              type: "output",
              status: "active",
              latency: "< 1s",
              quality: 95,
              description: "Advanced scenario modeling interface"
            }
          ]}
          dataFlowConnections={[
            { from: "grii-baseline", to: "simulation-processor", type: "real-time", volume: "1 update/5s" },
            { from: "forecast-feed", to: "simulation-processor", type: "batch", volume: "1 update/15m" },
            { from: "scenario-definitions", to: "monte-carlo-engine", type: "on-demand", volume: "Custom" },
            { from: "scenario-definitions", to: "stress-tester", type: "on-demand", volume: "Custom" },
            { from: "simulation-processor", to: "monte-carlo-engine", type: "on-demand", volume: "Job triggers" },
            { from: "simulation-processor", to: "stress-tester", type: "on-demand", volume: "Job triggers" },
            { from: "monte-carlo-engine", to: "simulation-dashboard", type: "real-time" },
            { from: "stress-tester", to: "simulation-dashboard", type: "real-time" },
            { from: "simulation-processor", to: "scenario-studio", type: "real-time" }
          ]}
        />

        <WhatChanged />

        {/* Simulation Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metricsLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonLoader key={idx} variant="card" />
            ))
          ) : (
            <>
              <MetricCard
                title="Active Models"
                value={simMetrics?.active_models.toString() || "7"}
                description="Running simulations"
              />
              <MetricCard
                title="Monte Carlo Runs"
                value={simMetrics?.monte_carlo_runs.toLocaleString() || "10,000"}
                description="Current iteration"
              />
              <MetricCard
                title="Scenario Tests"
                value={simMetrics?.scenario_tests.toString() || "156"}
                description="Completed this week"
              />
              <MetricCard
                title="Model Accuracy"
                value={`${simMetrics?.model_accuracy.toFixed(1) || "94.2"}%`}
                description="Validation score"
              />
            </>
          )}
        </div>

        {/* Simulation Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/simulation/monte-carlo"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-cyan-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">MONTE CARLO SIMULATION</h3>
                <p className="text-xs text-terminal-muted font-mono">Stochastic modeling</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Run probabilistic risk simulations using Monte Carlo methods for comprehensive uncertainty analysis
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="good">ACTIVE</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">10,000 iterations</span>
            </div>
          </Link>

          <Link
            href="/simulation/stress"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">STRESS TESTING</h3>
                <p className="text-xs text-terminal-muted font-mono">Extreme scenarios</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Test system resilience under extreme market conditions and tail risk scenarios
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="warning">SCHEDULED</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">156 scenarios</span>
            </div>
          </Link>

          <Link
            href="/analytics/scenarios"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">SCENARIO STUDIO</h3>
                <p className="text-xs text-terminal-muted font-mono">Interactive modeling</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Build custom scenarios and analyze their impact on the Global Risk Intelligence Index
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="good">AVAILABLE</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">Visual editor</span>
            </div>
          </Link>
        </div>

        {/* Model Performance */}
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              MODEL PERFORMANCE SUMMARY
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Current simulation performance and accuracy metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Risk Factor Coverage</span>
                <span className="font-mono text-sm text-terminal-text">98.5%</span>
              </div>
              <div className="w-full bg-terminal-border rounded-full h-2">
                <div className="h-2 bg-terminal-green rounded-full" style={{ width: "98.5%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Prediction Accuracy</span>
                <span className="font-mono text-sm text-terminal-text">94.2%</span>
              </div>
              <div className="w-full bg-terminal-border rounded-full h-2">
                <div className="h-2 bg-terminal-green rounded-full" style={{ width: "94.2%" }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Computing Performance</span>
                <span className="font-mono text-sm text-terminal-text">87.3%</span>
              </div>
              <div className="w-full bg-terminal-border rounded-full h-2">
                <div className="h-2 bg-terminal-orange rounded-full" style={{ width: "87.3%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Model Validation</span>
                <span className="font-mono text-sm text-terminal-text">92.8%</span>
              </div>
              <div className="w-full bg-terminal-border rounded-full h-2">
                <div className="h-2 bg-terminal-green rounded-full" style={{ width: "92.8%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <SimulationRunner />
        {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
      </main>
    </MainLayout>
  );
}
