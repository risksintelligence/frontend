 "use client";

import MainLayout from "@/components/layout/MainLayout";
import EconomicOverview from "@/components/analytics/EconomicOverview";
import ForecastPanel from "@/components/analytics/ForecastPanel";
import RegimePanel from "@/components/risk/RegimePanel";
import ExplainabilityPreview from "@/components/explainability/ExplainabilityPreview";
import TransparencyCard from "@/components/product/TransparencyCard";
import PagePrimer from "@/components/ui/PagePrimer";
import TourOverlay from "@/components/ui/TourOverlay";
import { useState } from "react";
import WhatChanged from "@/components/risk/WhatChanged";

export default function AnalyticsPage() {
  const [showTour, setShowTour] = useState(false);
  const tourSteps = [
    { title: "Economic Intelligence", description: "Top macro indicators feeding GRII." },
    { title: "Forecast & Regime", description: "ΔGRII forecast bands and regime odds side by side." },
    { title: "Explainability", description: "Driver snapshot and transparency for forecasts/regimes." },
  ];

  return (
    <MainLayout>
      <main className="space-y-8 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Analytics & Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Economic + Forecast Workbench
          </h1>
          <p className="text-sm text-terminal-muted">
            Institutional-grade analytics, regime probabilities, and explainability frameworks.
          </p>
          <button
            className="mt-2 text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors"
            onClick={() => setShowTour(true)}
          >
            Start Tour →
          </button>
        </header>

        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="Economic signals, GRII regimes, and Δ24h forecasts with explainability overlays."
          expandable={true}
          showDataFlow={true}
          items={[
            { 
              title: "Inputs", 
              content: "Macro indicators (rates, curves, PMI, spreads) + regime probabilities.",
              tooltip: "Real-time economic data feeds updating every 5-15 seconds from major financial markets",
              expandedContent: "VIX volatility index, yield curve spreads (10Y-2Y), corporate credit spreads, PMI manufacturing indices, unemployment rates, and WTI oil prices. All data normalized using rolling z-scores with 252-day lookback windows."
            },
            { 
              title: "Process", 
              content: "GRII composites, regime classifier, Δ24h forecast with confidence bands.",
              tooltip: "Multi-stage analytical pipeline combining statistical modeling with machine learning",
              expandedContent: "1) Z-score normalization of input signals, 2) Weighted composite calculation using dynamic factor loadings, 3) Regime classification using Hidden Markov Models, 4) Monte Carlo simulation for 24-hour forecasts with 10,000 iterations per run."
            },
            { 
              title: "Outputs", 
              content: "GRII score/band, regime odds, ΔGRII forecast, drivers, transparency status.",
              tooltip: "Actionable risk intelligence with institutional-grade transparency and audit trails",
              expandedContent: "GRII composite score (0-100), risk band classification (low/moderate/high/extreme), regime probabilities across 4 economic states, 24-hour forecast delta with 95% confidence intervals, and component driver attribution with SHAP explanations."
            },
          ]}
          dataFlowNodes={[
            {
              id: "market-data",
              label: "Market Data",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 96,
              description: "Real-time financial market feeds",
              endpoint: "/api/v1/data/feeds"
            },
            {
              id: "economic-indicators", 
              label: "Economic Indicators",
              type: "source",
              status: "active",
              latency: "< 15s",
              quality: 92,
              description: "Macro economic data sources",
              endpoint: "/api/v1/data/economic"
            },
            {
              id: "grii-processor",
              label: "GRII Engine",
              type: "process",
              status: "active",
              latency: "< 2s",
              quality: 94,
              description: "Core risk intelligence processor"
            },
            {
              id: "regime-classifier",
              label: "Regime Model",
              type: "model",
              status: "active",
              latency: "< 1s", 
              quality: 87,
              description: "Hidden Markov regime detection"
            },
            {
              id: "forecast-engine",
              label: "Monte Carlo",
              type: "model",
              status: "active",
              latency: "< 3s",
              quality: 91,
              description: "24h forecast simulation"
            },
            {
              id: "risk-dashboard",
              label: "Analytics UI",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 98,
              description: "Real-time risk dashboard"
            }
          ]}
          dataFlowConnections={[
            { from: "market-data", to: "grii-processor", type: "real-time", volume: "~500 msg/s" },
            { from: "economic-indicators", to: "grii-processor", type: "batch", volume: "~50 updates/day" },
            { from: "grii-processor", to: "regime-classifier", type: "real-time", volume: "1 update/5s" },
            { from: "grii-processor", to: "forecast-engine", type: "on-demand", volume: "1 update/15m" },
            { from: "regime-classifier", to: "risk-dashboard", type: "real-time" },
            { from: "forecast-engine", to: "risk-dashboard", type: "real-time" },
            { from: "grii-processor", to: "risk-dashboard", type: "real-time" }
          ]}
        />

        <WhatChanged />

        <EconomicOverview />

        <div className="terminal-grid lg:grid-cols-2">
          <ForecastPanel />
          <RegimePanel />
        </div>

        <div className="terminal-grid lg:grid-cols-2">
          <ExplainabilityPreview />
          <TransparencyCard />
        </div>

        {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
      </main>
    </MainLayout>
  );
}
