"use client";

import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAlerts } from "@/hooks/useAlerts";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import EconomicOverview from "@/components/analytics/EconomicOverview";
import ExplainabilityPreview from "@/components/explainability/ExplainabilityPreview";
import RegimePanel from "@/components/risk/RegimePanel";
import ForecastPanel from "@/components/analytics/ForecastPanel";
import NetworkOverview from "@/components/network/NetworkOverview";
import RasWidget from "@/components/product/RasWidget";
import TransparencyCard from "@/components/product/TransparencyCard";
import AnomalyLedger from "@/components/risk/AnomalyLedger";
import GeopoliticalPanel from "@/components/intelligence/GeopoliticalPanel";
import MaritimePanel from "@/components/intelligence/MaritimePanel";

export default function DashboardPreview() {
  const { data: riskData, isLoading: riskLoading } = useRiskOverview();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            RRIO Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Risk Intelligence Observatory
          </h1>
        </div>
        <StatusBadge variant="info">
          Live Intelligence · Real-time Updates
        </StatusBadge>
      </header>

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
          description="Real-time assessment based on global economic indicators and risk patterns."
          riskScore={riskData?.overview?.score}
          trend="stable"
          timestamp={riskData?.overview?.updated_at}
          loading={riskLoading}
          tooltip="Global Economic Resilience Index: 0-100 scale measuring systemic stress across financial, supply chain, and macroeconomic indicators. Updates hourly with latest available data."
          showMethodology={true}
          methodologyTitle="GERII Index Methodology"
          methodologyContent={[
            {
              title: "Index Definition",
              content: "The Global Economic Resilience Index (GERII) condenses cross-asset, supply-chain, and macroeconomic stress indicators into a 0–100 scale for institutional use by researchers, analysts, and policymakers.",
              type: "definition"
            },
            {
              title: "Input Components",
              content: "VIX volatility index, yield curve slope (10Y-2Y), credit spreads (BAA-10Y), freight proxies (diesel prices, Baltic Dry Index), PMI diffusion, WTI oil prices, CPI year-over-year, unemployment rate.",
              type: "inputs"
            },
            {
              title: "Processing Method",
              content: "5-year rolling z-score normalization per component with directional adjustments. Base weights sum to 1.0, with regime classifier overrides when confidence exceeds thresholds. Weighted sum scaled to 0–100 with saturation controls.",
              type: "process"
            },
            {
              title: "Risk Bands",
              content: "Minimal (0-19): Stable conditions. Low (20-39): Mild tension. Moderate (40-59): Early warning. High (60-79): Elevated stress. Critical (80-100): Severe dislocation requiring immediate action.",
              type: "outputs"
            }
          ]}
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
          tooltip="Categorical classification based on GRII score. Each band represents increasing levels of systemic stress and recommended response protocols."
        />

        <MetricCard
          title="Alert Volume"
          value={
            alertsLoading ? "--" : `${alertsData?.anomalies?.length?.toString() ?? "0"}`
          }
          description="Active risk alerts and anomalies requiring attention."
          riskScore={(alertsData?.anomalies?.length ?? 0) * 10}
          timestamp={new Date().toISOString()}
          loading={alertsLoading}
          tooltip="Count of active anomaly alerts detected by the monitoring system. High alert volumes may indicate emerging systemic stress requiring investigation."
          showMethodology={true}
          methodologyTitle="Anomaly Detection Methodology"
          methodologyContent={[
            {
              title: "Detection Framework",
              content: "Statistical anomaly detection using rolling z-scores and change-point detection algorithms to identify unusual patterns in economic indicators.",
              type: "definition"
            },
            {
              title: "Alert Classification",
              content: "Alerts classified by severity (critical, high, medium, low) based on deviation magnitude and impact on overall GRII score calculation.",
              type: "process"
            },
            {
              title: "Investigation Protocol",
              content: "Active alerts require analyst review to determine whether they represent genuine risk signals or data quality issues. All alerts include suggested investigative steps.",
              type: "outputs"
            }
          ]}
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

      <div className="terminal-grid lg:grid-cols-2">
        <GeopoliticalPanel />
        <MaritimePanel />
      </div>

      <ExplainabilityPreview />

      <AnomalyLedger />
    </div>
  );
}
