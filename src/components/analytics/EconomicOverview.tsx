"use client";

import { useEconomicData } from "@/hooks/useEconomicData";
import { EconomicIndicator } from "@/lib/types";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function EconomicOverview() {
  const { data, isLoading } = useEconomicData();

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Finance · Supply Chain · Macro
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Economic Intelligence Snapshot
          </h3>
        </div>
      </div>

      <div className="terminal-grid md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonLoader key={idx} variant="card" />
            ))
          : data?.indicators.map((indicator: EconomicIndicator) => (
              <MetricCard
                key={indicator.id}
                title={indicator.label}
                value={`${indicator.value} ${indicator.unit}`}
                description={indicator.changePercent != null ? `Δ ${indicator.changePercent.toFixed(2)}%` : "Δ --"}
                riskScore={indicator.value * 10}
                trend={
                  indicator.changePercent > 0
                    ? "rising"
                    : indicator.changePercent < 0
                      ? "falling"
                      : "stable"
                }
                timestamp={indicator.updatedAt}
                footer={indicator.category?.toUpperCase() || "ECONOMIC"}
              />
            ))}
        {!data?.indicators?.length && !isLoading && (
          <div className="terminal-grid md:grid-cols-3">
            <MetricCard
              title="CPI YoY"
              value="3.2%"
              description="Δ +0.1%"
              riskScore={32}
              trend="rising"
              timestamp={new Date().toISOString()}
              footer="INFLATION"
              tooltip="Consumer Price Index year-over-year change. Simulated data pending connection to economic data providers."
            />
            <MetricCard
              title="Unemployment"
              value="4.1%"
              description="Δ -0.2%"
              riskScore={20}
              trend="falling"
              timestamp={new Date().toISOString()}
              footer="LABOR"
              tooltip="Unemployment rate. Simulated data pending connection to economic data providers."
            />
            <MetricCard
              title="10Y-2Y Spread"
              value="0.85%"
              description="Δ +0.05%"
              riskScore={15}
              trend="rising"
              timestamp={new Date().toISOString()}
              footer="YIELD CURVE"
              tooltip="Treasury yield curve spread (10Y-2Y). Simulated data pending connection to economic data providers."
            />
          </div>
        )}
      </div>
    </section>
  );
}
