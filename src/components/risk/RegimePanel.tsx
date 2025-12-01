"use client";

import { useRegimeData } from "@/hooks/useRegimeData";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import Tooltip from "@/components/ui/Tooltip";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";
import { HelpCircle, Info } from "lucide-react";

export default function RegimePanel() {
  const { data, isLoading } = useRegimeData();
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  const handleMethodologyClick = () => {
    openModal({
      title: "Regime Classification Methodology",
      subtitle: "Machine learning approach to detecting macroeconomic regimes",
      sections: [
        {
          title: "Objective",
          content: "Detect macroeconomic regimes that warrant adaptive weighting of GERII components and provide narrative framing for RRIO intelligence outputs.",
          type: "definition"
        },
        {
          title: "Model Framework",
          content: "Gaussian Mixture Model (GMM) with 4-5 components or Hidden Markov Model for temporal persistence. Model selection validated via Bayesian Information Criterion and out-of-sample regime stability tests.",
          type: "process"
        },
        {
          title: "Input Features",
          content: "Normalized feature vector including VIX, yield curve slope, credit spreads, freight indices, diesel prices, PMI, oil prices, CPI YoY, unemployment rate, plus engineered features like rolling volatility and z-score momentum.",
          type: "inputs"
        },
        {
          title: "Regime Categories",
          content: "Calm: Stable market conditions. Inflationary_Stress: Rising price pressures. Supply_Shock: Disrupted supply chains. Financial_Stress: Credit market tension. Each regime includes recommended weight adjustments for GERII components.",
          type: "outputs"
        },
        {
          title: "Training & Validation",
          content: "Rolling 10-year window updated quarterly. Cross-validation ensures alignment with known macro episodes (2008 crisis, 2020 pandemic). Drift monitoring triggers retraining if distributions deviate beyond tolerance for >30 days.",
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
      <section className="terminal-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                Regime Engine
              </p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Probability Stack
              </h3>
            </div>
            <Tooltip content="ML-powered regime classification identifying current macroeconomic conditions and probability distributions across defined regime types." placement="top">
              <Info className="w-3 h-3 text-terminal-muted cursor-help" />
            </Tooltip>
          </div>
          <Tooltip content="View regime classification methodology and model details" placement="left">
            <button
              onClick={handleMethodologyClick}
              className="p-1 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
              aria-label="View regime methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      <div className="space-y-2">
        {data?.probabilities.map((prob) => (
          <div key={prob.name}>
            <div className="flex items-center justify-between text-xs font-semibold text-terminal-text">
              <span>{prob.name}</span>
              <span>{Math.round(prob.probability * 100)}%</span>
            </div>
            <div className="h-2 rounded bg-terminal-border">
              <div
                className="h-2 rounded bg-terminal-text"
                style={{ width: `${prob.probability * 100}%` }}
              />
            </div>
          </div>
        ))}
        {!data && !isLoading && (
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-terminal-text">
                <span>Calm</span>
                <span>65%</span>
              </div>
              <div className="h-2 rounded bg-terminal-border">
                <div
                  className="h-2 rounded bg-terminal-text"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-terminal-text">
                <span>Financial Stress</span>
                <span>20%</span>
              </div>
              <div className="h-2 rounded bg-terminal-border">
                <div
                  className="h-2 rounded bg-terminal-text"
                  style={{ width: "20%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-terminal-text">
                <span>Supply Shock</span>
                <span>10%</span>
              </div>
              <div className="h-2 rounded bg-terminal-border">
                <div
                  className="h-2 rounded bg-terminal-text"
                  style={{ width: "10%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-terminal-text">
                <span>Inflationary Stress</span>
                <span>5%</span>
              </div>
              <div className="h-2 rounded bg-terminal-border">
                <div
                  className="h-2 rounded bg-terminal-text"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
            <p className="text-xs text-terminal-muted mt-3">
              Simulated probabilities - insufficient data for ML regime classification
            </p>
          </div>
        )}
      </div>
      {data?.watchlist && data.watchlist.length > 0 && (
        <div className="space-y-1 rounded border border-terminal-border bg-terminal-bg p-3">
          <p className="text-xs font-semibold uppercase text-terminal-muted">
            Transition Watchlist
          </p>
          <ul className="list-disc pl-5 text-xs text-terminal-text">
            {data.watchlist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {data?.current ? (
        <StatusBadge variant="critical">
          Current: {data.current}
        </StatusBadge>
      ) : !isLoading && (
        <StatusBadge variant="good">
          Current: Calm
        </StatusBadge>
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
