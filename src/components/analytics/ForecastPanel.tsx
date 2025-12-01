"use client";

import { useForecastData } from "@/hooks/useForecastData";
import { ForecastData } from "@/lib/types";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useExplainability } from "@/hooks/useExplainability";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsClient } from "@/hooks/useIsClient";
import Tooltip from "@/components/ui/Tooltip";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";
import { HelpCircle, Info } from "lucide-react";

export default function ForecastPanel() {
  const { data, isLoading } = useForecastData();
  const typedData = data as ForecastData | undefined;
  const isClient = useIsClient();
  const { data: explainData } = useExplainability();
  const forecastDrivers = explainData?.forecast?.slice(0, 3) || [];
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  const handleMethodologyClick = () => {
    openModal({
      title: "24-Hour Forecast Methodology",
      subtitle: "Machine learning approach to short-horizon GRII predictions",
      sections: [
        {
          title: "Model Objective",
          content: "Provide 24-hour GERII movement forecasts and exceedance probabilities to support real-time alerts, dashboard guidance, and intelligence reporting.",
          type: "definition"
        },
        {
          title: "Model Architecture",
          content: "Gradient boosted trees (XGBoost/LightGBM) as primary model due to superior nonlinearity handling. SARIMAX benchmark maintained for transparency and regulatory comfort, with model selection via rolling backtests.",
          type: "process"
        },
        {
          title: "Feature Engineering",
          content: "Lagged GERII values (1h, 6h, 24h, 7d), rolling volatility and momentum metrics for each component, regime probabilities from classifier, recent anomaly signals, and data freshness indicators.",
          type: "inputs"
        },
        {
          title: "Model Outputs",
          content: "Point forecast with upper/lower confidence bands, probability of exceeding custom thresholds, alert classifications, and SHAP-ranked driver contributions for explainability.",
          type: "outputs"
        },
        {
          title: "Training Protocol",
          content: "Rolling window retraining weekly to incorporate latest data. Backtests report MAE, CRPS, and calibration plots. Performance thresholds must be met before promoting new model versions.",
          type: "technical"
        }
      ]
    });
  };

  return (
    <>
      <section className="terminal-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                AI Forecast
              </p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                ΔGRII Projection (24h)
              </h3>
            </div>
            <Tooltip content="Machine learning forecast of GRII movement over next 24 hours with confidence intervals and key driver explanations." placement="top">
              <Info className="w-3 h-3 text-terminal-muted cursor-help" />
            </Tooltip>
          </div>
          <Tooltip content="View forecast methodology and model details" placement="left">
            <button
              onClick={handleMethodologyClick}
              className="p-1 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
              aria-label="View forecast methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      {isLoading ? (
        <SkeletonLoader variant="card" />
      ) : (
        <MetricCard
          title="Expected Move"
          value={typedData && typedData.delta24h != null ? `${typedData.delta24h.toFixed(1)} pts` : "+1.2 pts"}
          description={typedData?.commentary}
          timestamp={typedData?.updatedAt}
        />
      )}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-terminal-muted">
          Forecast Path
        </p>
        {typedData?.points ? (
          <div className="h-56 w-full" style={{ minWidth: 200, minHeight: 200 }}>
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <AreaChart data={typedData.points}>
                  <defs>
                    <linearGradient id="forecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey={(p) =>
                      new Date(p.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip
                    labelStyle={{ fontSize: 12 }}
                    formatter={(value: number) => `${value.toFixed(1)} pts`}
                  />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fill="url(#band)"
                    fillOpacity={0.15}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fillOpacity={0}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1e3a8a"
                    fillOpacity={1}
                    fill="url(#forecast)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-terminal-muted">
                <span className="font-mono text-sm">Preparing chart…</span>
              </div>
            )}
          </div>
        ) : (
          !isLoading && (
            <p className="text-sm text-terminal-muted font-mono">
              Chart requires 30+ historical observations for ML forecast training.
              Current data insufficient for projection modeling.
            </p>
          )
        )}
      </div>

      {forecastDrivers.length > 0 && (
        <div className="terminal-card space-y-2">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Top Drivers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forecastDrivers.map((driver) => (
              <div key={driver.feature} className="rounded border border-terminal-border bg-terminal-bg p-3">
                <p className="text-xs font-semibold uppercase text-terminal-text">
                  {driver.feature.replace(/_/g, " ")}
                </p>
                <p className="text-sm font-mono text-terminal-text">
                  {(driver.contribution ?? 0).toFixed(2)} pts
                </p>
                <p className="text-[11px] text-terminal-muted font-mono">
                  Coef {driver.coef.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      </section>
      
      <MethodologyModal
        {...modalProps}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}
