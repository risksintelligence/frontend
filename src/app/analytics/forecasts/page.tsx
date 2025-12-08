 "use client";

import MainLayout from "@/components/layout/MainLayout";
import ForecastPanel from "@/components/analytics/ForecastPanel";
import RegimePanel from "@/components/risk/RegimePanel";
import EconomicOverview from "@/components/analytics/EconomicOverview";
import ForecastBacktest from "@/components/analytics/ForecastBacktest";
import PagePrimer from "@/components/ui/PagePrimer";
import WhatChanged from "@/components/risk/WhatChanged";

export default function ForecastsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Analytics
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Forecast & Regime Studio
          </h1>
          <p className="text-sm text-terminal-muted">
            ΔGRII projections, confidence bands, and regime probabilities from `/api/v1/ai/*`.
          </p>
        </header>
        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="ΔGRII forecast trajectory with confidence bands and regime context."
          items={[
            { title: "Inputs", content: "GRII baseline, regime probabilities, forecast drivers/history." },
            { title: "Process", content: "24h forecast delta, confidence intervals, backtest vs realized." },
            { title: "Outputs", content: "Forecast path, backtest chart, regime odds, economic indicators." },
          ]}
        />

        <WhatChanged />

        <div className="terminal-grid lg:grid-cols-2">
          <ForecastPanel />
          <RegimePanel />
        </div>

        <ForecastBacktest />
        <EconomicOverview />
      </div>
    </MainLayout>
  );
}
