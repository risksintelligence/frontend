"use client";

import MainLayout from "@/components/layout/MainLayout";
import MetricCard from "@/components/ui/MetricCard";
import EconomicOverview from "@/components/analytics/EconomicOverview";
import RegimePanel from "@/components/risk/RegimePanel";
import ForecastPanel from "@/components/analytics/ForecastPanel";
import NetworkOverview from "@/components/network/NetworkOverview";
import RasWidget from "@/components/product/RasWidget";
import TransparencyCard from "@/components/product/TransparencyCard";
import AnomalyLedger from "@/components/risk/AnomalyLedger";
import ExplainabilityPreview from "@/components/explainability/ExplainabilityPreview";
import AnomalyTimeline from "@/components/risk/AnomalyTimeline";
import RiskAlerts from "@/components/risk/RiskAlerts";
import PagePrimer from "@/components/ui/PagePrimer";
import { useState } from "react";
import WhatChanged from "@/components/risk/WhatChanged";
import FeedbackBanner from "@/components/ui/FeedbackBanner";
import TourOverlay from "@/components/ui/TourOverlay";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useAlerts } from "@/hooks/useAlerts";
import { useQuery } from "@tanstack/react-query";
import { mlIntelligenceService } from "@/services/mlIntelligenceService";

function RiskOverviewContent() {
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();
  const [showTour, setShowTour] = useState(false);
  
  // Get ML insights for enhanced risk intelligence
  const { data: mlInsights, isLoading: mlLoading } = useQuery({
    queryKey: ["risk-ml-insights-summary"],
    queryFn: () => mlIntelligenceService.getMLInsightsSummary(),
    staleTime: 300_000, // 5 minutes
    refetchInterval: 600_000, // 10 minutes
  });
  void mlInsights;
  void mlLoading;
  const tourSteps = [
    { title: "GRII Score", description: "Core composite risk score with band/semantic colors." },
    { title: "Forecast Delta", description: "24h ΔGRII with confidence bands and driver context." },
    { title: "Regime & Alerts", description: "Macro regime probabilities and live anomalies." },
    { title: "Exports & Explainability", description: "Use Explain Drivers/Export buttons to drill into drivers and download reports." },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Risk Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            GRII + Regime Overview
          </h1>
        </div>
        <button
          className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors"
          onClick={() => setShowTour(true)}
        >
          Start Tour →
        </button>
      </header>

      <WhatChanged />

      <PagePrimer
        kicker="Primer"
        title="What the Observatory Measures"
        description="GRII (Global Resilience & Instability Index) blends macro, market, supply chain, policy, and technical signals into a single composite, updated continuously by the RRIO (Resilience & Risk Intelligence Observatory) pipeline."
        expandable={true}
        showDataFlow={true}
        items={[
          {
            title: "Inputs",
            content: "Multi-source observables: rates, curves, credit, commodities, PMI, supply chain stress, policy shocks.",
            tooltip: "Real-time global economic and financial data feeds updating every 5-15 seconds",
            expandedContent: "VIX volatility index, yield curve spreads (10Y-2Y, 10Y-3M), corporate credit spreads (HYG, LQD), PMI manufacturing indices (US, EU, China), unemployment rates, WTI oil prices, supply chain pressure indices, policy uncertainty measures. Data normalized using 252-day rolling z-scores with outlier detection."
          },
          {
            title: "Process",
            content: "Weighted composites + z-scores, regime classifier, 24h forecast delta, anomaly detector, semantic colors.",
            tooltip: "Multi-stage analytical pipeline combining statistical modeling with machine learning",
            expandedContent: "1) Real-time z-score normalization with adaptive lookback windows, 2) Dynamic factor loadings based on market volatility, 3) Hidden Markov Model regime classification across 4 economic states, 4) Monte Carlo simulation for 24-hour forecasts with 10,000 iterations, 5) Statistical anomaly detection using rolling percentiles, 6) Semantic color mapping for intuitive risk communication."
          },
          {
            title: "Outputs", 
            content: "GRII score/band, regime probabilities, ΔGRII forecast with confidence bands, alerts, explainability drivers.",
            tooltip: "Institutional-grade risk intelligence with transparency and audit trails",
            expandedContent: "GRII composite score (0-100), risk band classification (low/moderate/high/extreme), regime probabilities with confidence intervals, 24-hour forecast delta with 95% bands, real-time anomaly alerts with severity scoring, component driver attribution using SHAP explanations, exportable analysis reports for compliance documentation."
          }
        ]}
        dataFlowNodes={[
          {
            id: "market-feeds",
            label: "Market Feeds",
            type: "source",
            status: "active", 
            latency: "< 5s",
            quality: 96,
            description: "Real-time financial market data streams",
            endpoint: "/api/v1/data/feeds/market"
          },
          {
            id: "economic-data",
            label: "Economic Data",
            type: "source",
            status: "active",
            latency: "< 15s", 
            quality: 92,
            description: "Macro economic indicators and releases",
            endpoint: "/api/v1/data/feeds/economic"
          },
          {
            id: "supply-chain",
            label: "Supply Chain",
            type: "source",
            status: "active",
            latency: "< 30s",
            quality: 89,
            description: "Global supply chain stress indicators",
            endpoint: "/api/v1/data/feeds/supply-chain"
          },
          {
            id: "grii-engine",
            label: "GRII Engine", 
            type: "process",
            status: "active",
            latency: "< 2s",
            quality: 94,
            description: "Core risk composite calculation"
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
            label: "Forecast Engine",
            type: "model", 
            status: "active",
            latency: "< 3s",
            quality: 91,
            description: "Monte Carlo 24h simulation"
          },
          {
            id: "anomaly-detector",
            label: "Anomaly Engine",
            type: "model",
            status: "active",
            latency: "< 1s",
            quality: 88,
            description: "Statistical outlier detection"
          },
          {
            id: "risk-dashboard",
            label: "Risk Dashboard",
            type: "output",
            status: "active",
            latency: "< 500ms", 
            quality: 98,
            description: "Real-time GRII risk interface"
          }
        ]}
        dataFlowConnections={[
          { from: "market-feeds", to: "grii-engine", type: "real-time", volume: "~500 msg/s" },
          { from: "economic-data", to: "grii-engine", type: "batch", volume: "~50 updates/day" },
          { from: "supply-chain", to: "grii-engine", type: "batch", volume: "~20 updates/day" },
          { from: "grii-engine", to: "regime-classifier", type: "real-time", volume: "1 update/5s" },
          { from: "grii-engine", to: "forecast-engine", type: "on-demand", volume: "1 update/15m" },
          { from: "grii-engine", to: "anomaly-detector", type: "real-time", volume: "1 update/5s" },
          { from: "regime-classifier", to: "risk-dashboard", type: "real-time" },
          { from: "forecast-engine", to: "risk-dashboard", type: "real-time" },
          { from: "anomaly-detector", to: "risk-dashboard", type: "real-time" },
          { from: "grii-engine", to: "risk-dashboard", type: "real-time" }
        ]}
      />

      <section className="terminal-grid md:grid-cols-3">
        <MetricCard
          title="GRII Composite Score"
          value={
            riskLoading
              ? "--"
              : riskData?.overview?.score != null
              ? `${riskData.overview.score.toFixed(1)} pts`
              : "-- pts"
          }
          description="Real-time composite risk assessment from global economic monitoring."
          riskScore={riskData?.overview?.score}
          timestamp={riskData?.overview?.updated_at}
          loading={riskLoading}
        />

        <MetricCard
          title="Risk Band"
          value={
            riskLoading
              ? "--"
              : `${riskData?.overview?.band ?? "Unknown"}`
          }
          description="Current risk classification from GRII analysis."
          timestamp={riskData?.overview?.updated_at}
          loading={riskLoading}
        />

        <MetricCard
          title="Active Alerts"
          value={
            alertsLoading ? "--" : `${alertsData?.anomalies?.length?.toString() ?? "0"}`
          }
          description="Current risk alerts requiring immediate attention."
          riskScore={(alertsData?.anomalies?.length ?? 0) * 10}
          timestamp={alertsData?.anomalies?.[0]?.timestamp}
          loading={alertsLoading}
        />
      </section>

      <EconomicOverview />

      <div className="terminal-grid lg:grid-cols-2">
        <RegimePanel />
        <ForecastPanel />
      </div>

      <NetworkOverview />

      <div className="terminal-grid lg:grid-cols-2">
        <RasWidget />
        <TransparencyCard />
      </div>

      <ExplainabilityPreview />

      {/* Consolidated Anomaly Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase text-terminal-text">
          Anomaly Detection & Alerts
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <AnomalyLedger />
          <RiskAlerts />
        </div>
        <AnomalyTimeline />
      </section>
      {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
    </div>
  );
}

export default function RiskPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <RiskOverviewContent />
        <FeedbackBanner page="risk" trigger="scroll" />
      </div>
    </MainLayout>
  );
}
