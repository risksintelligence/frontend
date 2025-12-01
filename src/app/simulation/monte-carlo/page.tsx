"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { TrendingUp } from "lucide-react";
import SimulationRunner from "@/components/simulation/SimulationRunner";
import PagePrimer from "@/components/ui/PagePrimer";
import TourOverlay from "@/components/ui/TourOverlay";
import { useState } from "react";

export default function MonteCarloPage() {
  const [showTour, setShowTour] = useState(false);
  const tourSteps = [
    { title: "Baseline & Inputs", description: "GRII baseline, correlation matrix, and vol calibration feed the simulator." },
    { title: "Run Controls", description: "Launch 10k-path Monte Carlo runs with live parameters and reproducible seeds." },
    { title: "Outputs & Exports", description: "Read confidence bands, VaR/CVaR, and export datasets or reports." },
  ];

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  MONTE CARLO SIMULATION
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Stochastic risk modeling and probabilistic analysis framework
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="good">ACTIVE</StatusBadge>
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
          description="Monte Carlo stochastic simulation framework for probabilistic GRII path analysis and uncertainty quantification."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Inputs",
              content: "GRII baseline, correlation matrix, historical volatility, scenario parameters, confidence levels.",
              tooltip: "Real-time risk inputs and user-defined parameters for probabilistic modeling",
              expandedContent: "Current GRII composite baseline (0-100), cross-asset correlation matrices with 252-day rolling estimates, historical volatility calibration from VIX, yield curves, credit spreads, user-defined scenario parameters (shock magnitudes, time horizons), confidence interval specifications (90%, 95%, 99%), random number generator seeds for reproducible results."
            },
            {
              title: "Process", 
              content: "10,000 Monte Carlo iterations, correlated random walks, path-dependent simulation, confidence band calculation.",
              tooltip: "Advanced stochastic simulation with correlation-preserving random number generation",
              expandedContent: "1) Multivariate normal random generation using Cholesky decomposition for correlation preservation, 2) 10,000 Monte Carlo iterations with antithetic variance reduction, 3) Path-dependent GRII evolution using geometric Brownian motion with drift, 4) Statistical moment calculation (mean, variance, skewness, kurtosis), 5) Confidence band construction using percentile methods, 6) Convergence testing with rolling window diagnostics."
            },
            {
              title: "Outputs",
              content: "Probabilistic GRII paths, confidence bands, risk metrics (VaR, CVaR), convergence diagnostics, scenario comparisons.",
              tooltip: "Comprehensive probabilistic analysis results with institutional-grade risk metrics",
              expandedContent: "Ensemble of 10,000 GRII evolution paths with statistical summary, confidence bands at 90/95/99% levels, Value-at-Risk (VaR) and Conditional VaR metrics at multiple horizons, convergence diagnostics with Monte Carlo standard error, scenario comparison matrices showing relative outcomes, exportable simulation datasets with full methodology documentation."
            }
          ]}
          dataFlowNodes={[
            {
              id: "grii-baseline-mc",
              label: "GRII Baseline",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 94,
              description: "Current GRII composite for simulation initialization",
              endpoint: "/api/v1/analytics/geri"
            },
            {
              id: "correlation-matrix",
              label: "Correlation Matrix",
              type: "source",
              status: "active",
              latency: "< 10s",
              quality: 89,
              description: "Cross-asset correlation estimates",
              endpoint: "/api/v1/analytics/correlations"
            },
            {
              id: "volatility-calibration",
              label: "Vol Calibration",
              type: "source",
              status: "active",
              latency: "< 15s",
              quality: 92,
              description: "Historical volatility parameters",
              endpoint: "/api/v1/simulation/volatility"
            },
            {
              id: "random-generator",
              label: "RNG Engine",
              type: "process",
              status: "active",
              latency: "< 1s",
              quality: 98,
              description: "Correlated random number generation"
            },
            {
              id: "monte-carlo-core",
              label: "MC Simulator",
              type: "model",
              status: "active",
              latency: "< 30s",
              quality: 87,
              description: "Core Monte Carlo simulation engine"
            },
            {
              id: "path-generator",
              label: "Path Generator",
              type: "model",
              status: "active",
              latency: "< 25s",
              quality: 90,
              description: "GRII path evolution simulation"
            },
            {
              id: "statistics-engine",
              label: "Stats Engine",
              type: "process",
              status: "active",
              latency: "< 5s",
              quality: 95,
              description: "Statistical analysis and metrics calculation"
            },
            {
              id: "monte-carlo-dashboard",
              label: "MC Dashboard",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 97,
              description: "Monte Carlo results visualization"
            }
          ]}
          dataFlowConnections={[
            { from: "grii-baseline-mc", to: "monte-carlo-core", type: "real-time", volume: "1 baseline/run" },
            { from: "correlation-matrix", to: "random-generator", type: "batch", volume: "1 matrix/day" },
            { from: "volatility-calibration", to: "path-generator", type: "batch", volume: "1 calibration/day" },
            { from: "random-generator", to: "monte-carlo-core", type: "on-demand", volume: "10k samples/run" },
            { from: "monte-carlo-core", to: "path-generator", type: "real-time", volume: "Continuous" },
            { from: "path-generator", to: "statistics-engine", type: "real-time", volume: "10k paths/run" },
            { from: "statistics-engine", to: "monte-carlo-dashboard", type: "real-time" },
            { from: "monte-carlo-core", to: "monte-carlo-dashboard", type: "real-time" }
          ]}
        />

        <SimulationRunner />
        {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
      </main>
    </MainLayout>
  );
}
