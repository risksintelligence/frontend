"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import RiskOverview from "@/components/risk/WhatChanged";
import ForecastPanel from "@/components/analytics/ForecastPanel";
import RegimePanel from "@/components/risk/RegimePanel";
import EconomicOverview from "@/components/analytics/EconomicOverview";
import NetworkOverview from "@/components/network/NetworkOverview";
import TransparencyCard from "@/components/product/TransparencyCard";
import ExplainabilityPreview from "@/components/explainability/ExplainabilityPreview";
import { usePinnedWidgets } from "@/hooks/usePinnedWidgets";
import { useMemo } from "react";

export default function MyDeskPage() {
  const { isPinned, togglePin } = usePinnedWidgets();

  const widgets = useMemo(
    () => [
      {
        id: "grii",
        title: "GRII + What Changed",
        description: "Composite shifts, drivers, and alerts.",
        render: <RiskOverview />,
      },
      {
        id: "forecast",
        title: "Forecast",
        description: "ΔGRII projection with confidence bands.",
        render: <ForecastPanel />,
      },
      {
        id: "regime",
        title: "Regime Odds",
        description: "Economic regime probabilities and shifts.",
        render: <RegimePanel />,
      },
      {
        id: "economic",
        title: "Economic Overview",
        description: "Macro indicators powering GRII.",
        render: <EconomicOverview />,
      },
      {
        id: "network",
        title: "Network Health",
        description: "Provider reliability and dependencies.",
        render: <NetworkOverview />,
      },
      {
        id: "transparency",
        title: "Transparency",
        description: "Lineage, freshness, compliance state.",
        render: <TransparencyCard />,
      },
      {
        id: "explainability",
        title: "Explainability",
        description: "Drivers and attribution snapshots.",
        render: <ExplainabilityPreview />,
      },
    ],
    []
  );

  const pinnedWidgets = widgets.filter((w) => isPinned(w.id));

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">My Desk</p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">Pinned Intelligence</h1>
            <p className="text-sm text-terminal-muted">
              A consolidated view of GRII, forecast, network, explainability, and transparency cards.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => togglePin(widget.id)}
                className={`text-xs font-mono px-3 py-1 rounded border ${
                  isPinned(widget.id)
                    ? "border-terminal-green text-terminal-green hover:bg-terminal-green/10"
                    : "border-terminal-muted text-terminal-muted hover:bg-terminal-surface/60"
                }`}
              >
                {isPinned(widget.id) ? `Unpin ${widget.title}` : `Pin ${widget.title}`}
              </button>
            ))}
          </div>
        </header>

        <PagePrimer
          kicker="Primer"
          title="What This View Shows"
          description="Pinned widgets for daily monitoring—GRII moves, forecast, regime, network, and transparency."
          items={[
            { title: "Inputs", content: "GRII score/Δ24h, regime odds, forecast band, alerts, network health." },
            { title: "Process", content: "Live polling from core endpoints with semantic coloring and drivers." },
          { title: "Outputs", content: "24h change summary, forecast/regime cards, network snapshot, transparency status." },
        ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pinnedWidgets.map((widget) => (
            <div key={widget.id} className="space-y-2 terminal-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm text-terminal-text uppercase">{widget.title}</h3>
                  <p className="text-xs text-terminal-muted font-mono">{widget.description}</p>
                </div>
                <button
                  onClick={() => togglePin(widget.id)}
                  className="text-xs font-mono text-terminal-green hover:text-terminal-text transition-colors"
                >
                  {isPinned(widget.id) ? "Unpin" : "Pin"}
                </button>
              </div>
              <div className="rounded border border-terminal-border bg-terminal-surface/60">
                {widget.render}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
