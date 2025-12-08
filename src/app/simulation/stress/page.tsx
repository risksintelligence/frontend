"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { Target } from "lucide-react";
import StressLab from "@/components/simulation/StressLab";
import PagePrimer from "@/components/ui/PagePrimer";
import TourOverlay from "@/components/ui/TourOverlay";
import { useState } from "react";

export default function StressTestPage() {
  const [showTour, setShowTour] = useState(false);
  const tourSteps = [
    { title: "Scenario Inputs", description: "Baseline GRII + regulatory and custom stress scenarios define shocks." },
    { title: "Run & Monitor", description: "Apply extreme shocks, correlation breakdowns, and cascade modeling." },
    { title: "Readouts", description: "Inspect tail metrics, cascade maps, resilience scores, and export reports." },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  STRESS TESTING
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Extreme scenario modeling and tail risk analysis framework
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="warning">ACTIVE</StatusBadge>
              <div className="text-terminal-muted font-mono text-sm">
                Live Data · {new Date().toLocaleTimeString()}
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
          description="Extreme scenario stress testing framework for tail risk analysis and system resilience validation under adverse conditions."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Inputs",
              content: "GRII baseline, extreme shock scenarios, historical crisis parameters, regulatory stress definitions, tail risk thresholds.",
              tooltip: "Predefined and custom extreme scenarios for comprehensive stress testing",
              expandedContent: "Current GRII baseline for stress baseline, predefined extreme scenarios (2008 financial crisis, COVID-19 pandemic, 1987 Black Monday), regulatory stress test parameters (CCAR, EBA, BCBS guidelines), custom user-defined shocks with magnitude ranges, tail risk thresholds at 99th and 99.9th percentiles, correlation breakdown scenarios for crisis conditions."
            },
            {
              title: "Process",
              content: "Extreme shock application, tail event simulation, correlation breakdown modeling, cascading failure analysis, resilience testing.",
              tooltip: "Advanced stress testing methodologies simulating extreme market conditions and system failures",
              expandedContent: "1) Extreme shock application with magnitude scaling (1-sigma to 5-sigma events), 2) Tail event simulation using extreme value theory and Pareto distributions, 3) Correlation breakdown modeling during crisis periods, 4) Cascading failure analysis through network propagation, 5) Multi-horizon stress testing (1-day to 1-year scenarios), 6) Recovery path simulation with policy intervention modeling."
            },
            {
              title: "Outputs",
              content: "Stress test results, tail risk metrics, failure cascade maps, resilience scores, recovery projections, regulatory compliance reports.",
              tooltip: "Comprehensive stress testing results with regulatory reporting and resilience assessment",
              expandedContent: "Stress test impact scores across all scenarios, tail risk metrics (Expected Shortfall, Maximum Drawdown), visual cascade failure maps showing contagion paths, system resilience scores with recovery timeframes, regulatory compliance reports (CCAR format), scenario comparison matrices, policy intervention effectiveness analysis, exportable stress testing documentation for audit trails."
            }
          ]}
          dataFlowNodes={[
            {
              id: "grii-baseline-stress",
              label: "GRII Baseline",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 94,
              description: "Current GRII composite for stress baseline",
              endpoint: "/api/v1/analytics/geri"
            },
            {
              id: "stress-scenarios",
              label: "Stress Scenarios",
              type: "source",
              status: "active",
              latency: "< 1s",
              quality: 96,
              description: "Predefined and custom extreme scenarios",
              endpoint: "/api/v1/simulation/stress/scenarios"
            },
            {
              id: "regulatory-params",
              label: "Regulatory Params",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 93,
              description: "Regulatory stress testing parameters",
              endpoint: "/api/v1/simulation/stress/regulatory"
            },
            {
              id: "shock-engine",
              label: "Shock Engine",
              type: "model",
              status: "active",
              latency: "< 10s",
              quality: 88,
              description: "Extreme shock application and modeling"
            },
            {
              id: "cascade-simulator",
              label: "Cascade Simulator",
              type: "model",
              status: "active",
              latency: "< 15s",
              quality: 85,
              description: "Failure propagation and contagion modeling"
            },
            {
              id: "resilience-analyzer",
              label: "Resilience Engine",
              type: "process",
              status: "active",
              latency: "< 8s",
              quality: 91,
              description: "System resilience and recovery analysis"
            },
            {
              id: "stress-processor",
              label: "Stress Processor",
              type: "process",
              status: "active",
              latency: "< 12s",
              quality: 89,
              description: "Stress test orchestration and result aggregation"
            },
            {
              id: "stress-dashboard",
              label: "Stress Dashboard",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 97,
              description: "Stress testing results interface"
            }
          ]}
          dataFlowConnections={[
            { from: "grii-baseline-stress", to: "stress-processor", type: "real-time", volume: "1 baseline/test" },
            { from: "stress-scenarios", to: "shock-engine", type: "on-demand", volume: "Custom scenarios" },
            { from: "regulatory-params", to: "shock-engine", type: "batch", volume: "1 update/quarter" },
            { from: "stress-processor", to: "shock-engine", type: "on-demand", volume: "Test triggers" },
            { from: "shock-engine", to: "cascade-simulator", type: "real-time", volume: "Shock propagation" },
            { from: "cascade-simulator", to: "resilience-analyzer", type: "real-time", volume: "Failure paths" },
            { from: "resilience-analyzer", to: "stress-dashboard", type: "real-time" },
            { from: "shock-engine", to: "stress-dashboard", type: "real-time" },
            { from: "stress-processor", to: "stress-dashboard", type: "real-time" }
          ]}
        />

        <StressLab />
        {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
      </div>
    </MainLayout>
  );
}
