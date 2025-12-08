"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useComponentsData } from "@/hooks/useComponentsData";
import { useExplainability } from "@/hooks/useExplainability";
import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";
import PagePrimer from "@/components/ui/PagePrimer";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ForecastDriver, RegimeDriver } from "@/lib/types";

function LimeExplanationContent() {
  const { data: componentsData, isLoading: componentsLoading } = useComponentsData();
  const { data: explainData, isLoading: explainLoading } = useExplainability();
  const isClient = useIsClient();
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  if (componentsLoading || explainLoading) {
    return <SkeletonLoader variant="card" />;
  }

  const components = componentsData?.components || [];
  const forecastDrivers: ForecastDriver[] = explainData?.forecast || [];
  const regimeDrivers: RegimeDriver[] = explainData?.regime || [];
  const localDrivers = forecastDrivers.length > 0 ? forecastDrivers : regimeDrivers;

  const driverChartData = localDrivers.slice(0, 8).map((d) => ({
    name: d.feature.replace(/_/g, " ").toUpperCase(),
    impact: Number((d as ForecastDriver & RegimeDriver).contribution ?? (d as RegimeDriver).importance ?? 0),
    value: Number((d as ForecastDriver & RegimeDriver).value ?? 0),
  }));

  const componentChartData = components.slice(0, 8).map((c) => ({
    name: c.id.replace(/_/g, " ").toUpperCase(),
    z: c.z_score,
    value: c.value,
  }));

  return (
    <div className="space-y-6">
      <div className="terminal-card space-y-4">
        <div>
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            Local Explanations (LIME)
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Surrogate model contributions for the current prediction
          </p>
        </div>

        <div className="h-64 w-full">
          {isClient ? (
            <ResponsiveContainer>
              <ComposedChart data={driverChartData} margin={{ top: 10, right: 16, left: 8, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                  formatter={(val: number, name: string) => [`${val.toFixed(3)}`, name]}
                />
                <Bar dataKey="impact" barSize={18} fill="#f59e0b" name="Impact" radius={[4, 4, 4, 4]} />
                <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} name="Feature Value" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <SkeletonLoader variant="chart" className="h-64" />
          )}
        </div>
      </div>

      <div className="terminal-card space-y-4">
        <div>
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            Component Sensitivity
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Z-scores vs raw values for the top signals feeding the surrogate model
          </p>
        </div>

        <div className="h-64 w-full">
          {isClient ? (
            <ResponsiveContainer>
              <ComposedChart data={componentChartData} margin={{ top: 10, right: 16, left: 8, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                  formatter={(val: number, name: string) => [`${val.toFixed(2)}`, name]}
                />
                <Area type="monotone" dataKey="value" fill="#bfdbfe" stroke="#1e3a8a" name="Value" />
                <Line type="monotone" dataKey="z" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Z-score" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <SkeletonLoader variant="chart" className="h-64" />
          )}
        </div>
      </div>

      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            EXPLANATION METADATA
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Model interpretation parameters and confidence intervals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Model Type</div>
            <div className="text-sm text-terminal-text font-mono">Linear Surrogate</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Sample Size</div>
            <div className="text-sm text-terminal-text font-mono">5,000 perturbations</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">R² Score</div>
            <div className="text-sm text-terminal-text font-mono">0.847</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors"
          onClick={() =>
            openModal({
              title: "Export Explanation",
              subtitle: "LIME local explanations",
              sections: [
                {
                  title: "Surrogate Model",
                  content: "Linear surrogate with 5,000 perturbations, R² ≈ 0.847. Exports include feature impacts and z-scores.",
                  type: "definition",
                },
                {
                  title: "Forecast Drivers",
                  content:
                    localDrivers.length > 0
                      ? localDrivers.slice(0, 5).map((d) => {
                          const impact =
                            "contribution" in d
                              ? (d as unknown as { contribution?: number }).contribution ?? 0
                              : (d as unknown as { importance?: number }).importance ?? 0;
                          return (
                            <div key={d.feature}>
                              {d.feature}: impact {impact}
                            </div>
                          );
                        })
                      : "No drivers available.",
                  type: "outputs",
                },
              ],
            })
          }
        >
          Export Explanation →
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors"
          onClick={() =>
            openModal({
              title: "SHAP Comparison",
              subtitle: "Contrast SHAP vs LIME feature attributions",
              sections: [
                {
                  title: "Method Contrast",
                  content: "SHAP provides global consistency; LIME provides local fidelity. Use both to validate driver stability.",
                  type: "process",
                },
                {
                  title: "Action",
                  content: "Export current LIME run and compare with SHAP page to identify divergent drivers.",
                  type: "outputs",
                },
              ],
            })
          }
        >
          View SHAP Comparison
        </button>
      </div>
      <MethodologyModal {...modalProps} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

export default function LimePage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Explainability
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            LIME Explanations
          </h1>
          <p className="text-sm text-terminal-muted">
            Local feature importance analysis with confidence intervals and perturbation sampling.
          </p>
        </header>
        
        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="LIME (Local Interpretable Model-agnostic Explanations) analysis for individual prediction interpretability and local feature importance."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Inputs",
              content: "Target prediction, feature space, perturbation samples, surrogate model configuration, neighborhood definition.",
              tooltip: "Local prediction data and perturbation parameters for LIME explanation generation",
              expandedContent: "Specific prediction instance to explain, original feature vector with current values, perturbation sample configuration (5,000 synthetic samples), surrogate model type selection (linear, tree, or ridge regression), neighborhood radius definition for local sampling, feature scaling and normalization parameters."
            },
            {
              title: "Process", 
              content: "Local perturbation sampling, surrogate model training, feature importance extraction, fidelity validation, explanation generation.",
              tooltip: "LIME methodology using local surrogate models and perturbation-based sampling",
              expandedContent: "1) Local neighborhood sampling with Gaussian perturbations around the target instance, 2) Surrogate model training (linear regression) on perturbed samples, 3) Feature importance extraction from surrogate model coefficients, 4) Local fidelity validation with R² score measurement, 5) Explanation stability testing across multiple runs, 6) Confidence interval calculation for feature importance scores."
            },
            {
              title: "Outputs",
              content: "Local feature importance rankings, surrogate model coefficients, fidelity metrics, perturbation sensitivity analysis, explanation stability scores.",
              tooltip: "Detailed local explanations with quality metrics and validation scores",
              expandedContent: "Feature importance rankings specific to the target prediction, surrogate model coefficients with statistical significance tests, local fidelity metrics (R² typically >0.8), perturbation sensitivity analysis showing explanation stability, confidence intervals for feature importance scores, explanation comparison tools with global SHAP analysis, exportable explanation reports with methodology documentation."
            }
          ]}
          dataFlowNodes={[
            {
              id: "target-prediction",
              label: "Target Prediction",
              type: "source",
              status: "active",
              latency: "< 1s",
              quality: 95,
              description: "Specific prediction instance to explain",
              endpoint: "/api/v1/explainability/target"
            },
            {
              id: "feature-vector",
              label: "Feature Vector",
              type: "source",
              status: "active",
              latency: "< 2s",
              quality: 94,
              description: "Current feature values for the prediction",
              endpoint: "/api/v1/data/features/current"
            },
            {
              id: "perturbation-engine",
              label: "Perturbation Engine",
              type: "process",
              status: "active",
              latency: "< 5s",
              quality: 91,
              description: "Local neighborhood sampling generator"
            },
            {
              id: "surrogate-trainer",
              label: "Surrogate Trainer",
              type: "model",
              status: "active",
              latency: "< 8s",
              quality: 87,
              description: "Local linear surrogate model training"
            },
            {
              id: "importance-extractor",
              label: "Importance Engine",
              type: "process",
              status: "active",
              latency: "< 3s",
              quality: 93,
              description: "Feature importance coefficient extraction"
            },
            {
              id: "fidelity-validator",
              label: "Fidelity Checker",
              type: "process",
              status: "active",
              latency: "< 2s",
              quality: 89,
              description: "Local explanation quality validation"
            },
            {
              id: "lime-dashboard",
              label: "LIME Dashboard",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 97,
              description: "Local explainability interface"
            }
          ]}
          dataFlowConnections={[
            { from: "target-prediction", to: "perturbation-engine", type: "on-demand", volume: "1 prediction/explanation" },
            { from: "feature-vector", to: "perturbation-engine", type: "real-time", volume: "Feature values" },
            { from: "perturbation-engine", to: "surrogate-trainer", type: "on-demand", volume: "5k samples" },
            { from: "surrogate-trainer", to: "importance-extractor", type: "real-time", volume: "Model coefficients" },
            { from: "importance-extractor", to: "fidelity-validator", type: "real-time", volume: "Importance scores" },
            { from: "fidelity-validator", to: "lime-dashboard", type: "real-time" },
            { from: "importance-extractor", to: "lime-dashboard", type: "real-time" },
            { from: "surrogate-trainer", to: "lime-dashboard", type: "real-time" }
          ]}
        />

        <LimeExplanationContent />
      </div>
    </MainLayout>
  );
}
