"use client";

import MainLayout from "@/components/layout/MainLayout";
import MarketIntelligenceDashboard from "@/components/intelligence/MarketIntelligenceDashboard";
import PagePrimer from "@/components/ui/PagePrimer";

export default function IntelligencePage() {
  return (
    <MainLayout>
      <main className="space-y-8 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Market Intelligence & Analysis
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Intelligence Dashboard
          </h1>
          <p className="text-sm text-terminal-muted">
            Comprehensive market intelligence, trade flows, and geopolitical analysis.
          </p>
        </header>

        <PagePrimer
          kicker="Intelligence"
          title="Market Intelligence Overview"
          description="Real-time intelligence from SEC EDGAR, World Bank WITS, and maritime sources."
          expandable={true}
          items={[
            { 
              title: "Financial Health", 
              content: "SEC EDGAR company analysis with risk scoring.",
              tooltip: "Real-time financial health analysis from SEC filings"
            },
            { 
              title: "Trade Intelligence", 
              content: "World Bank WITS global trade flow analysis.",
              tooltip: "Comprehensive trade flow and country risk assessment"
            },
            { 
              title: "Supply Chain Mapping", 
              content: "OpenStreetMap supply chain route analysis.",
              tooltip: "Geographic supply chain mapping and logistics risk"
            },
          ]}
        />

        <MarketIntelligenceDashboard />
      </main>
    </MainLayout>
  );
}