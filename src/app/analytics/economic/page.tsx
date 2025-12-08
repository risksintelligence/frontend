 "use client";

import MainLayout from "@/components/layout/MainLayout";
import { useEconomicData } from "@/hooks/useEconomicData";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { EconomicIndicator } from "@/lib/types";
import PagePrimer from "@/components/ui/PagePrimer";

export default function EconomicPage() {
  const { data, isLoading } = useEconomicData();

  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Analytics
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Economic Intelligence Detail
          </h1>
          <p className="text-sm text-terminal-muted">
            Indicator table with semantic scoring, ready for FRED/mission references.
          </p>
        </header>
        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="Economic indicators feeding GRII, with semantic scoring and trends."
          items={[
            { title: "Inputs", content: "Rates, curves, PMI, spreads, inflation, employment, trade." },
            { title: "Process", content: "Z-scores/semantic colors, change%, and category grouping." },
            { title: "Outputs", content: "Indicator cards/table with values, deltas, categories, timestamps." },
          ]}
        />

        <section className="terminal-grid md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonLoader key={idx} variant="card" />
              ))
            : data?.indicators.map((indicator: EconomicIndicator) => (
                <MetricCard
                  key={indicator.id}
                  title={indicator.label}
                  value={`${indicator.value} ${indicator.unit}`}
                  description={`Change ${indicator.changePercent}%`}
                  riskScore={indicator.value * 10}
                  trend={
                    indicator.changePercent > 0
                      ? "rising"
                      : indicator.changePercent < 0
                        ? "falling"
                        : "stable"
                  }
                  timestamp={indicator.updatedAt}
                  footer={indicator.category.toUpperCase()}
                />
              ))}
        </section>

        <section className="overflow-x-auto rounded border border-terminal-border">
          {isLoading ? (
            <SkeletonLoader variant="table" rows={4} />
          ) : (
            <table className="min-w-full text-left text-sm text-terminal-text">
              <thead className="bg-terminal-surface text-xs uppercase tracking-wide text-terminal-muted">
                <tr>
                  <th className="px-4 py-2">Indicator</th>
                  <th className="px-4 py-2">Value</th>
                  <th className="px-4 py-2">Δ%</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data?.indicators.map((indicator: EconomicIndicator) => (
                  <tr key={`${indicator.id}-row`} className="border-t border-terminal-border">
                    <td className="px-4 py-2">{indicator.label}</td>
                    <td className="px-4 py-2">{indicator.value}</td>
                    <td className="px-4 py-2">{indicator.changePercent}</td>
                    <td className="px-4 py-2">{indicator.category}</td>
                    <td className="px-4 py-2">
                      {new Date(indicator.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!data?.indicators.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-terminal-muted">
                      No indicators available. Connect `/api/v1/analytics/economic`.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
