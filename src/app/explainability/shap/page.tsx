"use client";

import MainLayout from "@/components/layout/MainLayout";
import ExplainabilityPreview from "@/components/explainability/ExplainabilityPreview";
import { useExplainability } from "@/hooks/useExplainability";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ShapWaterfall from "@/components/explainability/ShapWaterfall";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { RegimeDriver, ForecastDriver } from "@/lib/types";
import DriverImpactChart from "@/components/explainability/DriverImpactChart";
import PagePrimer from "@/components/ui/PagePrimer";

export default function ShapPage() {
  const { data, isLoading } = useExplainability();
  const regimeDrivers: RegimeDriver[] = data?.regime || [];
  const forecastDrivers: ForecastDriver[] = data?.forecast || [];

  const renderDriverChart = (
    title: string,
    drivers: RegimeDriver[] | ForecastDriver[],
    valueKey: "importance" | "contribution",
  ) => {
    if (!drivers.length) {
      return <p className="text-sm text-terminal-muted">Explainability data unavailable.</p>;
    }

    const chartData = drivers.slice(0, 6).map((d) => ({
      name: d.feature.replace(/_/g, " ").toUpperCase(),
      value: Number((d as RegimeDriver & ForecastDriver)[valueKey]),
    }));

    return (
      <div className="terminal-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">{title}</p>
            <h3 className="text-sm font-semibold uppercase text-terminal-text">Top Drivers</h3>
          </div>
        </div>
        <div className="h-64 w-full" style={{ minWidth: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={160} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number) => val.toFixed(3)}
              />
              <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Explainability
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            SHAP Driver Analysis
          </h1>
          <p className="text-sm text-terminal-muted">
            Highlight top contributors to GRII moves with semantic badges and accessibility patterns.
          </p>
        </header>
        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="SHAP (SHapley Additive exPlanations) driver analysis for regime and forecast models with institutional-grade explainability."
          expandable={true}
          showDataFlow={true}
          items={[
            { 
              title: "Inputs", 
              content: "Regime model predictions, forecast model outputs, feature values, baseline expectations.",
              tooltip: "Real-time model predictions and feature data for SHAP value calculation",
              expandedContent: "Current regime model predictions across 4 economic states, forecast model outputs with 24h GRII deltas, live feature values (VIX, yields, credit spreads, PMI, unemployment), baseline expectations for each feature, historical feature distributions for context, model confidence scores for interpretation weighting."
            },
            { 
              title: "Process", 
              content: "SHAP value computation, feature importance ranking, attribution analysis, waterfall decomposition, what-if scenario testing.",
              tooltip: "Advanced explainability framework using Shapley values and game theory principles",
              expandedContent: "1) SHAP value computation using TreeExplainer for ensemble models, 2) Feature importance ranking based on absolute SHAP contributions, 3) Attribution analysis decomposing predictions into individual feature effects, 4) Waterfall visualization showing cumulative contribution paths, 5) What-if scenario testing with interactive feature perturbation, 6) Statistical significance testing for feature importance rankings."
            },
            { 
              title: "Outputs", 
              content: "SHAP importance rankings, attribution waterfalls, driver impact charts, interactive what-if analysis, explainability reports.",
              tooltip: "Comprehensive model explainability with interactive analysis tools and audit trails",
              expandedContent: "Feature importance rankings with statistical confidence intervals, attribution waterfall charts showing prediction decomposition, interactive driver impact visualizations with magnitude and direction, what-if analysis tools for scenario exploration, exportable explainability reports for model governance, compliance documentation for regulatory requirements, bias detection summaries for fairness assessment."
            }
          ]}
          dataFlowNodes={[
            {
              id: "regime-predictions",
              label: "Regime Model",
              type: "source",
              status: "active",
              latency: "< 1s",
              quality: 87,
              description: "Regime classification model predictions",
              endpoint: "/api/v1/ai/regime/current"
            },
            {
              id: "forecast-predictions",
              label: "Forecast Model",
              type: "source",
              status: "active",
              latency: "< 3s",
              quality: 91,
              description: "24-hour GRII forecast predictions",
              endpoint: "/api/v1/ai/forecast/next-24h"
            },
            {
              id: "feature-data",
              label: "Feature Store",
              type: "source",
              status: "active",
              latency: "< 5s",
              quality: 94,
              description: "Live feature values and distributions",
              endpoint: "/api/v1/data/features"
            },
            {
              id: "shap-engine",
              label: "SHAP Engine",
              type: "model",
              status: "active",
              latency: "< 8s",
              quality: 89,
              description: "Shapley value computation engine"
            },
            {
              id: "attribution-analyzer",
              label: "Attribution Engine",
              type: "process",
              status: "active",
              latency: "< 3s",
              quality: 92,
              description: "Feature attribution and ranking analysis"
            },
            {
              id: "waterfall-generator",
              label: "Waterfall Engine",
              type: "process",
              status: "active",
              latency: "< 2s",
              quality: 95,
              description: "Contribution waterfall visualization"
            },
            {
              id: "explainability-dashboard",
              label: "SHAP Dashboard",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 98,
              description: "Interactive explainability interface"
            }
          ]}
          dataFlowConnections={[
            { from: "regime-predictions", to: "shap-engine", type: "real-time", volume: "1 prediction/5s" },
            { from: "forecast-predictions", to: "shap-engine", type: "batch", volume: "1 forecast/15m" },
            { from: "feature-data", to: "shap-engine", type: "real-time", volume: "~50 features/s" },
            { from: "shap-engine", to: "attribution-analyzer", type: "real-time", volume: "SHAP values" },
            { from: "attribution-analyzer", to: "waterfall-generator", type: "real-time", volume: "Attribution data" },
            { from: "waterfall-generator", to: "explainability-dashboard", type: "real-time" },
            { from: "attribution-analyzer", to: "explainability-dashboard", type: "real-time" },
            { from: "shap-engine", to: "explainability-dashboard", type: "real-time" }
          ]}
        />
        {isLoading ? (
          <SkeletonLoader variant="card" />
        ) : (
          <div className="space-y-6">
            <ExplainabilityPreview />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {renderDriverChart("Regime Model", regimeDrivers, "importance")}
              {renderDriverChart("Forecast Model", forecastDrivers, "contribution")}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DriverImpactChart
                title="Regime Driver Impact"
                subtitle="Magnitude (area) vs impact (line) with observed feature values"
                drivers={regimeDrivers}
                dataKey="importance"
              />
              <DriverImpactChart
                title="Forecast Driver Impact"
                subtitle="Live contributions powering ΔGRII projections"
                drivers={forecastDrivers}
                dataKey="contribution"
              />
            </div>
            <ShapWaterfall drivers={forecastDrivers} title="Forecast What-If" />
          </div>
        )}
      </main>
    </MainLayout>
  );
}
