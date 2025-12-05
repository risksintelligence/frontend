"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import MarketIntelligenceDashboard from "@/components/intelligence/MarketIntelligenceDashboard";
export default function MarketIntelligencePage() {
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Risk Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Market Intelligence & Analysis
          </h1>
          <p className="text-sm text-terminal-muted">
            ML-powered market intelligence with financial health scoring, trade flow analysis, and supply chain mapping.
          </p>
        </header>

        <PagePrimer
          kicker="Primer"
          title="Market Intelligence Platform"
          description="Professional-grade market intelligence combining SEC EDGAR, World Bank WITS, UN Comtrade, and OpenStreetMap data sources."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Data Sources",
              content: "SEC EDGAR, World Bank WITS, UN Comtrade, OpenStreetMap - authoritative government APIs.",
              tooltip: "Authoritative data from government and international organizations",
              expandedContent: "Four authoritative data sources: SEC EDGAR for U.S. company financials and market health, World Bank WITS for global trade flows and country risk indicators, UN Comtrade for bilateral trade statistics and concentration analysis, and OpenStreetMap + OpenRouteService for supply chain mapping and logistics risk assessment."
            },
            {
              title: "Intelligence Features", 
              content: "Financial health scoring, country risk assessment, trade flow analysis, supply chain mapping.",
              tooltip: "Comprehensive market analytics from authoritative sources",
              expandedContent: "Financial health analysis using SEC filings with automated risk scoring, country risk assessment via World Bank economic indicators, global trade concentration analysis through UN statistics, supply chain route optimization and geographic risk mapping using OpenStreetMap data."
            },
            {
              title: "Data Quality",
              content: "Institutional-grade analytics with transparency, independence, and authoritative sources.",
              tooltip: "High-quality data with full transparency and no vendor dependencies",
              expandedContent: "Professional market intelligence with complete transparency, vendor independence, and direct access to authoritative government and international organization data sources. Comprehensive coverage with institutional-grade analytics and data validation."
            }
          ]}
          dataFlowNodes={[
            {
              id: "sec-edgar-feed",
              label: "SEC EDGAR",
              type: "source",
              status: "active",
              latency: "< 60s",
              quality: 98,
              description: "U.S. company financial data",
              endpoint: "/api/v1/intel/financial-health"
            },
            {
              id: "worldbank-feed",
              label: "World Bank WITS", 
              type: "source",
              status: "active",
              latency: "< 30s",
              quality: 96,
              description: "Global trade flows and country risk",
              endpoint: "/api/v1/intel/trade-intelligence"
            },
            {
              id: "un-comtrade-feed",
              label: "UN Comtrade",
              type: "source",
              status: "active",
              latency: "< 45s", 
              quality: 94,
              description: "Bilateral trade statistics",
              endpoint: "/api/v1/intel/trade-statistics"
            },
            {
              id: "openstreetmap-feed",
              label: "OpenStreetMap",
              type: "source",
              status: "active",
              latency: "< 20s",
              quality: 97,
              description: "Supply chain mapping",
              endpoint: "/api/v1/intel/supply-chain-mapping"
            },
            {
              id: "intelligence-aggregator",
              label: "Intelligence Aggregator",
              type: "model", 
              status: "active",
              latency: "< 2s",
              quality: 95,
              description: "Combined risk scoring and analysis"
            },
            {
              id: "intelligence-dashboard",
              label: "Intelligence UI",
              type: "output",
              status: "active", 
              latency: "< 300ms",
              quality: 97,
              description: "Unified market intelligence interface"
            }
          ]}
          dataFlowConnections={[
            { from: "sec-edgar-feed", to: "intelligence-aggregator", type: "real-time", volume: "~50 metrics/min" },
            { from: "worldbank-feed", to: "intelligence-aggregator", type: "real-time", volume: "~30 metrics/min" },
            { from: "un-comtrade-feed", to: "intelligence-aggregator", type: "real-time", volume: "~20 metrics/min" },
            { from: "openstreetmap-feed", to: "intelligence-aggregator", type: "real-time", volume: "~15 metrics/min" },
            { from: "intelligence-aggregator", to: "intelligence-dashboard", type: "real-time" }
          ]}
        />

        <MarketIntelligenceDashboard className="w-full" />
      </main>
    </MainLayout>
  );
}
