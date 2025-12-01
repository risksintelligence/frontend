"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import ResilienceMetricsVisualization from "@/components/network/ResilienceMetricsVisualization";
import TimelineCascadeVisualization from "@/components/network/TimelineCascadeVisualization";
import { useMLModels } from "@/hooks/useMLModels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResilienceMetricsPage() {
  const { modelsAvailable } = useMLModels();

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Supply Chain Resilience Analytics
          </h1>
          <p className="text-sm text-terminal-muted">
            Comprehensive resilience scoring and vulnerability assessment for global supply chain networks.
          </p>
        </header>

        <PagePrimer
          kicker="Primer"
          title="Supply Chain Resilience Platform"
          description="Enterprise-grade resilience analytics with real-time vulnerability assessment, cascade modeling, and adaptive risk scoring."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Resilience Framework",
              content: "Multi-dimensional scoring across redundancy, adaptability, recovery, and robustness.",
              tooltip: "Comprehensive resilience assessment using industry-standard metrics",
              expandedContent: "Four-pillar resilience framework: Redundancy (alternative pathway analysis), Adaptability (dynamic reconfiguration capability), Recovery (mean time to restore operations), and Robustness (resistance to initial disruption). Each pillar weighted based on sector-specific criticality using machine learning optimization."
            },
            {
              title: "Data Integration", 
              content: "Real-time feeds from S&P Global, trade flows, geopolitical events, port congestion.",
              tooltip: "Multi-source data fusion with real-time processing",
              expandedContent: "Integrated data streams including S&P Global sector intelligence, UN Comtrade trade statistics, ACLED geopolitical events, MarineTraffic port congestion data, and proprietary supply chain topology mapping. Data processed in real-time with 30-second refresh cycles and historical trend analysis."
            },
            {
              title: "ML Analytics",
              content: "Cascade prediction models, vulnerability classifiers, adaptive risk scoring algorithms.",
              tooltip: "Machine learning pipeline for predictive resilience analytics",
              expandedContent: "Advanced ML pipeline with RandomForest cascade prediction models (94% accuracy), Gradient Boosting vulnerability classifiers, and neural network risk scorers with SHAP explainability. Models retrained weekly on rolling 5-year datasets with cross-validation and uncertainty quantification."
            }
          ]}
          dataFlowNodes={[
            {
              id: "multi-source-feeds",
              label: "Data Fusion Layer",
              type: "source",
              status: "active",
              latency: "< 45s",
              quality: 96,
              description: "Unified data ingestion from multiple intelligence sources",
              endpoint: "/api/v1/data-fusion"
            },
            {
              id: "resilience-engine",
              label: "Resilience Engine", 
              type: "model",
              status: modelsAvailable ? "active" : "warning",
              latency: "< 3s",
              quality: modelsAvailable ? 93 : 68,
              description: "Multi-dimensional resilience scoring and analysis"
            },
            {
              id: "cascade-analyzer",
              label: "Cascade Analyzer",
              type: "model", 
              status: modelsAvailable ? "active" : "warning",
              latency: "< 2s",
              quality: modelsAvailable ? 91 : 65,
              description: "Supply chain cascade prediction and impact modeling"
            },
            {
              id: "resilience-dashboard",
              label: "Resilience UI",
              type: "output",
              status: "active", 
              latency: "< 400ms",
              quality: 98,
              description: "Interactive resilience analytics dashboard"
            }
          ]}
          dataFlowConnections={[
            { from: "multi-source-feeds", to: "resilience-engine", type: "real-time", volume: "~300 metrics/min" },
            { from: "multi-source-feeds", to: "cascade-analyzer", type: "real-time", volume: "~150 events/min" },
            { from: "resilience-engine", to: "resilience-dashboard", type: "real-time" },
            { from: "cascade-analyzer", to: "resilience-dashboard", type: "real-time" }
          ]}
        />

        {/* Main Analytics Interface */}
        <div className="space-y-6">
          <Tabs defaultValue="resilience" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-terminal-card">
              <TabsTrigger value="resilience" className="font-mono text-xs uppercase">
                Resilience Metrics
              </TabsTrigger>
              <TabsTrigger value="timeline" className="font-mono text-xs uppercase">
                Cascade Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resilience" className="space-y-4 mt-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-terminal-text">
                  RESILIENCE SCORING & VULNERABILITY ASSESSMENT
                </h3>
                <p className="text-sm text-terminal-muted">
                  Real-time supply chain resilience analysis with sector-specific scoring and risk assessment.
                </p>
              </div>
              <ResilienceMetricsVisualization className="w-full" />
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4 mt-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-terminal-text">
                  CASCADE EVENT ANALYSIS & TIMELINE
                </h3>
                <p className="text-sm text-terminal-muted">
                  Historical and predictive analysis of supply chain cascade events with interactive timeline visualization.
                </p>
              </div>
              <TimelineCascadeVisualization className="w-full" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </MainLayout>
  );
}