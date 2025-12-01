"use client";

import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import Tooltip from "@/components/ui/Tooltip";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";
import { useExplainability } from "@/hooks/useExplainability";
import { useAlerts } from "@/hooks/useAlerts";
import { RegimeDriver, ForecastDriver, Alert } from "@/lib/types";
import { HelpCircle, Info } from "lucide-react";

export default function ExplainabilityPreview() {
  const { data, isLoading } = useExplainability();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts();
  const regimeDrivers: RegimeDriver[] = data?.regime || [];
  const forecastDrivers: ForecastDriver[] = data?.forecast || [];
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  const handleExplainabilityMethodology = () => {
    openModal({
      title: "Explainability Framework Methodology",
      subtitle: "SHAP-based interpretable AI for transparent risk assessment",
      sections: [
        {
          title: "Framework Principles",
          content: "Every published GERII value, ML inference, and anomaly alert includes interpretable drivers. Explanations maintain consistency across dashboards, APIs, and RRIO content to ensure institutional trust and transparency.",
          type: "definition"
        },
        {
          title: "Driver Attribution",
          content: "Component Contribution Tables list each indicator with z-score contributions and color-coded risk bands. Driver narratives provide textual summaries referencing component moves and regime context.",
          type: "process"
        },
        {
          title: "SHAP Integration",
          content: "SHapley Additive exPlanations (SHAP) provide feature importance rankings for forecast models. Contributions are ranked by magnitude and include confidence intervals to assess reliability.",
          type: "technical"
        },
        {
          title: "Model Metadata",
          content: "Complete transparency includes model version, training dates, performance metrics, and data lineage links. All artifacts stored alongside primary outputs for retrospective reviews.",
          type: "outputs"
        },
        {
          title: "Governance Standards",
          content: "Explainability data undergoes governance board validation. Any methodology changes must maintain equal or improved transparency levels. All explanations cite data freshness and source attribution.",
          type: "technical"
        }
      ]
    });
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" />;
  }
  
  return (
    <>
      <section className="terminal-card space-y-6">
        {/* Model Driver Snapshot - Full Width */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                Explainability Framework
              </p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Model Driver Snapshot
              </h3>
            </div>
            <Tooltip content="SHAP-based interpretable AI providing transparent explanations for all GRII predictions, regime classifications, and anomaly detections." placement="top">
              <Info className="w-3 h-3 text-terminal-muted cursor-help" />
            </Tooltip>
          </div>
          <Tooltip content="View explainability framework methodology and SHAP integration details" placement="left">
            <button
              onClick={handleExplainabilityMethodology}
              className="p-1 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
              aria-label="View explainability methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Regime Drivers Section */}
        <div className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <p className="text-xs uppercase tracking-wide font-semibold text-blue-400">
              Regime Drivers
            </p>
            <span className="text-xs text-terminal-muted">Classification Model</span>
            <Tooltip content="Features with highest importance in determining current macroeconomic regime (Calm, Financial_Stress, Supply_Shock, Inflationary_Stress). Importance values from trained GMM classifier." placement="top">
              <Info className="w-3 h-3 text-blue-400/70 cursor-help" />
            </Tooltip>
          </div>
          {regimeDrivers.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="VIX VOLATILITY"
                value="0.245 imp"
                description="Value 18.2"
                riskScore={24.5}
                trend="rising"
                tooltip="Volatility Index importance in regime classification. Simulated data - insufficient historical observations for ML training."
              />
              <MetricCard
                title="CREDIT SPREADS"
                value="0.198 imp"
                description="Value 1.85"
                riskScore={19.8}
                trend="stable"
                tooltip="Credit spread importance in regime classification. Simulated data - insufficient historical observations for ML training."
              />
              <MetricCard
                title="YIELD CURVE"
                value="0.156 imp"
                description="Value 0.85"
                riskScore={15.6}
                trend="falling"
                tooltip="Yield curve slope importance in regime classification. Simulated data - insufficient historical observations for ML training."
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regimeDrivers.slice(0, 6).map((driver) => (
              <MetricCard
                key={driver.feature}
                title={driver.feature.replace(/_/g, " ").toUpperCase()}
                value={`${(driver.importance ?? 0).toFixed(3)} imp`}
                description={`Value ${driver.value ?? 0}`}
                riskScore={Math.abs(driver.importance ?? 0) * 100}
                trend={(driver.value ?? 0) >= 0 ? "rising" : "falling"}
                tooltip={`Feature importance in regime classification. Higher values indicate stronger influence on determining current macroeconomic regime. Current value: ${driver.value ?? 0}.`}
              />
            ))}
          </div>
        </div>

        {/* Forecast Drivers Section */}
        <div className="space-y-4 rounded-lg border border-green-500/30 bg-green-500/5 p-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-400">
              Forecast Drivers
            </p>
            <span className="text-xs text-terminal-muted">Regression Model</span>
            <Tooltip content="SHAP-ranked feature contributions to 24-hour GRII forecast prediction. Contribution values show expected impact on GRII movement. From XGBoost/LightGBM ensemble model." placement="top">
              <Info className="w-3 h-3 text-green-400/70 cursor-help" />
            </Tooltip>
          </div>
          {forecastDrivers.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="OIL PRICES"
                value="1.25 pts"
                description="Coef 0.078"
                riskScore={12.5}
                trend="rising"
                tooltip="Oil price SHAP contribution to 24-hour GRII forecast. Simulated data - insufficient historical observations for ML training."
              />
              <MetricCard
                title="USD INDEX"
                value="-0.85 pts"
                description="Coef -0.052"
                riskScore={8.5}
                trend="falling"
                tooltip="US Dollar Index SHAP contribution to 24-hour GRII forecast. Simulated data - insufficient historical observations for ML training."
              />
              <MetricCard
                title="PMI DIFFUSION"
                value="0.42 pts"
                description="Coef 0.031"
                riskScore={4.2}
                trend="stable"
                tooltip="PMI Diffusion Index SHAP contribution to 24-hour GRII forecast. Simulated data - insufficient historical observations for ML training."
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecastDrivers.slice(0, 6).map((driver) => (
              <MetricCard
                key={driver.feature}
                title={driver.feature.replace(/_/g, " ").toUpperCase()}
                value={`${(driver.contribution ?? 0).toFixed(2)} pts`}
                description={`Coef ${driver.coef ?? 0}`}
                riskScore={Math.abs(driver.contribution ?? 0) * 10}
                trend={(driver.contribution ?? 0) >= 0 ? "rising" : "falling"}
                tooltip={`SHAP contribution to 24-hour GRII forecast. Positive values increase predicted risk, negative values decrease it. Model coefficient: ${driver.coef ?? 0}.`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts Section - Full Width Below */}
      <div className="border-t border-terminal-border pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-terminal-muted">
            Active Alerts
          </h3>
        </div>
        
        {alertsLoading ? (
          <SkeletonLoader variant="card" />
        ) : (
          <div className="space-y-3">
            {alertsData?.anomalies?.map((alert: Alert, index: number) => (
              <article key={alert.id || index} className="rounded border border-terminal-border bg-terminal-bg p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <StatusBadge
                    variant={
                      alert.severity === "critical"
                        ? "critical"
                        : alert.severity === "high"
                          ? "warning"
                          : "info"
                    }
                  >
                    {alert.severity?.toUpperCase() || "NORMAL"}
                  </StatusBadge>
                  <p className="text-[11px] text-terminal-muted">
                    {new Date(alert.timestamp).toLocaleString()} · {alert.driver || 'System Alert'}
                  </p>
                </div>
                <p className="text-sm font-semibold text-terminal-text">
                  {alert.message}
                </p>
              </article>
            ))}
            {!alertsData?.anomalies?.length && !alertsLoading && (
              <p className="text-sm text-terminal-muted">
                No live alerts. Connect RRIO anomaly endpoints to stream updates.
              </p>
            )}
          </div>
        )}
      </div>
      </section>
      
      <MethodologyModal
        {...modalProps}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}
