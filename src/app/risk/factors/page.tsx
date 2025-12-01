 "use client";

import MainLayout from "@/components/layout/MainLayout";
import MetricCard from "@/components/ui/MetricCard";
import { useComponentsData } from "@/hooks/useComponentsData";
import { ComponentMetric } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { mlIntelligenceService } from "@/services/mlIntelligenceService";
import PagePrimer from "@/components/ui/PagePrimer";
import { useState } from "react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

function FactorsContent() {
  const { data, isLoading } = useComponentsData();
  const components = data?.components;
  
  // Get ML insights data for enhanced risk factors
  const { data: mlInsights, isLoading: mlLoading } = useQuery({
    queryKey: ["ml-insights-summary"],
    queryFn: () => mlIntelligenceService.getMLInsightsSummary(),
    staleTime: 300_000, // 5 minutes
    refetchInterval: 600_000, // 10 minutes
  });

  // Get risk scenarios data
  const { data: riskScenarios, isLoading: scenariosLoading } = useQuery({
    queryKey: ["risk-scenarios"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend-1-s84g.onrender.com'}/api/v1/predictive/risk-scenarios`);
      return response.json();
    },
    staleTime: 600_000, // 10 minutes
    refetchInterval: 1200_000, // 20 minutes
  });

  // Get network ML insights
  const { data: networkInsights, isLoading: networkLoading } = useQuery({
    queryKey: ["network-ml-insights"],
    queryFn: () => mlIntelligenceService.getNetworkMLInsights(),
    staleTime: 300_000, // 5 minutes
    refetchInterval: 600_000, // 10 minutes
  });

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">
          Risk Intelligence
        </p>
        <h1 className="text-2xl font-bold uppercase text-terminal-text">
          Component Contributions
        </h1>
        <p className="text-sm text-terminal-muted">
          Comprehensive risk factor analysis across components, supply chains, markets, and predictive scenarios for Observatory research.
        </p>
      </header>
      <PagePrimer
        kicker="Research Observatory"
        title="Comprehensive Risk Factor Analysis"
        description="Multi-dimensional risk analysis combining traditional components, ML predictions, supply chain intelligence, and stress scenarios for research transparency."
        expandable={true}
        items={[
          { title: "Component Analysis", content: "GRII component contributions, z-scores, and historical trends for academic research." },
          { title: "ML Intelligence", content: "Supply chain predictions, market trends, and anomaly detection from multiple models." },
          { title: "Network Analysis", content: "Cascade risk, resilience metrics, and topology-based risk factors." },
          { title: "Scenario Analysis", content: "Predictive risk scenarios and stress test recommendations for research." },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-terminal-border">
        <nav className="flex space-x-8">
          {[
            { key: "overview", label: "Overview" },
            { key: "components", label: "Component Factors" },
            { key: "ml-insights", label: "ML Intelligence" },
            { key: "network", label: "Network Analysis" },
            { key: "scenarios", label: "Risk Scenarios" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-terminal-green text-terminal-green"
                  : "border-transparent text-terminal-muted hover:text-terminal-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <section className="space-y-6">
            {/* Cross-System Risk Summary */}
            <div className="terminal-grid md:grid-cols-4">
              <MetricCard
                title="COMPONENT FACTORS"
                value={components?.length?.toString() || "0"}
                description="Traditional GRII components"
                riskScore={25}
                loading={isLoading}
              />
              <MetricCard
                title="ML PREDICTIONS"
                value={mlInsights?.summary_metrics?.total_predictions?.toString() || "0"}
                description="Active ML model predictions"
                riskScore={30}
                loading={mlLoading}
              />
              <MetricCard
                title="NETWORK INSIGHTS"
                value={networkInsights ? "Active" : "Loading"}
                description="Supply chain cascade analysis"
                riskScore={networkInsights?.overall_metrics?.network_health_score ? (100 - networkInsights.overall_metrics.network_health_score * 100) : 50}
                loading={networkLoading}
              />
              <MetricCard
                title="SCENARIO MODELS"
                value={riskScenarios?.scenarios?.length?.toString() || "0"}
                description="Predictive risk scenarios"
                riskScore={35}
                loading={scenariosLoading}
              />
            </div>

            {/* Risk Factor Health Overview */}
            {mlInsights && (
              <div className="terminal-card p-6">
                <h3 className="text-lg font-bold uppercase text-terminal-text mb-4">
                  Multi-System Risk Intelligence Status
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-terminal-muted">Supply Chain Intelligence</p>
                      <p className="text-xs text-terminal-text">
                        {Array.isArray(mlInsights.supply_chain_insights?.predictions) ? mlInsights.supply_chain_insights.predictions.length : 0} predictions, 
                        {Array.isArray(mlInsights.supply_chain_insights?.insights) ? mlInsights.supply_chain_insights.insights.length : 0} insights generated
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-terminal-muted">Market Intelligence</p>
                      <p className="text-xs text-terminal-text">
                        {Array.isArray(mlInsights.market_trend_insights?.predictions) ? mlInsights.market_trend_insights.predictions.length : 0} trend predictions, 
                        accuracy: {((mlInsights.market_trend_insights?.model_performance?.accuracy || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "components" && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold uppercase text-terminal-text">
              Traditional Component Risk Factors
            </h3>
            <div className="terminal-grid md:grid-cols-2 lg:grid-cols-4">
              {components
                ? components.map((component: ComponentMetric) => (
                    <MetricCard
                      key={component.id}
                      title={component.id.replace(/_/g, " ").toUpperCase()}
                      value={`${component.value.toFixed(1)} pts`}
                      riskScore={component.value}
                      description={`Z-Score: ${component.z_score.toFixed(2)}`}
                      loading={isLoading}
                    />
                  ))
                : Array.from({ length: 5 }).map((_, idx) => (
                    <MetricCard key={idx} title="Loading" value="--" loading />
                  ))}
            </div>
          </section>
        )}

        {activeTab === "ml-insights" && (
          <section className="space-y-6">
            {mlInsights ? (
              <>
                <div className="terminal-grid md:grid-cols-3">
                  <MetricCard
                    title="TOTAL PREDICTIONS"
                    value={mlInsights.summary_metrics?.total_predictions?.toString() || "0"}
                    description="Active ML predictions across all models"
                    riskScore={20}
                    loading={mlLoading}
                  />
                  <MetricCard
                    title="HIGH CONFIDENCE"
                    value={mlInsights.summary_metrics?.high_confidence_predictions?.toString() || "0"}
                    description="Predictions with >80% confidence"
                    riskScore={30}
                    loading={mlLoading}
                  />
                  <MetricCard
                    title="ANOMALIES DETECTED"
                    value={mlInsights.summary_metrics?.anomalies_detected?.toString() || "0"}
                    description="Active anomalies requiring attention"
                    riskScore={mlInsights.summary_metrics?.anomalies_detected > 0 ? 70 : 20}
                    loading={mlLoading}
                  />
                </div>

                {/* Detailed ML Insights */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="terminal-card p-4">
                    <h4 className="font-bold text-terminal-text mb-3">Supply Chain Predictions</h4>
                    <div className="space-y-2">
                      {Array.isArray(mlInsights.supply_chain_insights?.predictions) ? 
                        mlInsights.supply_chain_insights.predictions.slice(0, 3).map((pred: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-terminal-muted">{pred.route_id}</span>
                            <span className={`font-mono ${pred.risk_level === 'high' ? 'text-terminal-red' : pred.risk_level === 'medium' ? 'text-terminal-amber' : 'text-terminal-green'}`}>
                              {pred.risk_level} ({(pred.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                        )) : <p className="text-xs text-terminal-muted">No predictions available</p>
                      }
                    </div>
                  </div>

                  <div className="terminal-card p-4">
                    <h4 className="font-bold text-terminal-text mb-3">Market Trend Analysis</h4>
                    <div className="space-y-2">
                      {Array.isArray(mlInsights.market_trend_insights?.predictions) ? 
                        mlInsights.market_trend_insights.predictions.slice(0, 3).map((pred: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-terminal-muted">{pred.metric}</span>
                            <span className={`font-mono ${pred.trend === 'declining' ? 'text-terminal-red' : pred.trend === 'improving' ? 'text-terminal-green' : 'text-terminal-amber'}`}>
                              {pred.trend} ({(pred.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                        )) : <p className="text-xs text-terminal-muted">No predictions available</p>
                      }
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <SkeletonLoader variant="card" />
            )}
          </section>
        )}

        {activeTab === "network" && (
          <section className="space-y-6">
            {networkInsights ? (
              <>
                <div className="terminal-grid md:grid-cols-3">
                  <MetricCard
                    title="CASCADE RISK"
                    value={`${(networkInsights.cascade_analysis?.cascade_risk_score * 100 || 0).toFixed(1)}%`}
                    description={`${networkInsights.cascade_analysis?.risk_level || 'unknown'} risk level`}
                    riskScore={networkInsights.cascade_analysis?.cascade_risk_score * 100 || 0}
                    loading={networkLoading}
                  />
                  <MetricCard
                    title="RESILIENCE SCORE"
                    value={`${(networkInsights.resilience_analysis?.resilience_score * 100 || 0).toFixed(1)}%`}
                    description={`Recovery: ${networkInsights.resilience_analysis?.estimated_recovery_hours || 0}h`}
                    riskScore={100 - (networkInsights.resilience_analysis?.resilience_score * 100 || 0)}
                    loading={networkLoading}
                  />
                  <MetricCard
                    title="NETWORK HEALTH"
                    value={`${(networkInsights.overall_metrics?.network_health_score * 100 || 0).toFixed(1)}%`}
                    description={`${networkInsights.overall_metrics?.total_nodes || 0} nodes, ${networkInsights.overall_metrics?.total_edges || 0} edges`}
                    riskScore={100 - (networkInsights.overall_metrics?.network_health_score * 100 || 0)}
                    loading={networkLoading}
                  />
                </div>

                {/* Network Analysis Details */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="terminal-card p-4">
                    <h4 className="font-bold text-terminal-text mb-3">Critical Network Nodes</h4>
                    <div className="space-y-2">
                      {Array.isArray(networkInsights.cascade_analysis?.critical_nodes) ? 
                        networkInsights.cascade_analysis.critical_nodes.slice(0, 5).map((node: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-terminal-muted">{node.name}</span>
                            <span className="font-mono text-terminal-text">{(node.risk_score * 100).toFixed(1)}%</span>
                          </div>
                        )) : <p className="text-xs text-terminal-muted">No critical nodes identified</p>
                      }
                    </div>
                  </div>

                  <div className="terminal-card p-4">
                    <h4 className="font-bold text-terminal-text mb-3">Network Anomalies</h4>
                    <div className="space-y-2">
                      {Array.isArray(networkInsights.anomaly_analysis?.anomalies) ? 
                        networkInsights.anomaly_analysis.anomalies.slice(0, 5).map((anomaly: any, idx: number) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between">
                              <span className="text-terminal-muted">{anomaly.entity_name}</span>
                              <span className={`font-mono ${anomaly.severity === 'high' ? 'text-terminal-red' : anomaly.severity === 'medium' ? 'text-terminal-amber' : 'text-terminal-green'}`}>
                                {anomaly.severity}
                              </span>
                            </div>
                            <p className="text-terminal-muted truncate">{anomaly.details}</p>
                          </div>
                        )) : <p className="text-xs text-terminal-muted">No network anomalies detected</p>
                      }
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <SkeletonLoader variant="card" />
            )}
          </section>
        )}

        {activeTab === "scenarios" && (
          <section className="space-y-6">
            {riskScenarios ? (
              <>
                <div className="terminal-card p-4">
                  <h3 className="font-bold text-terminal-text mb-3">Risk Scenario Summary</h3>
                  <p className="text-sm text-terminal-muted mb-4">{typeof riskScenarios.scenario_summary === 'string' ? riskScenarios.scenario_summary : "Risk scenario analysis summary"}</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-mono text-terminal-text">{Array.isArray(riskScenarios.scenarios) ? riskScenarios.scenarios.length : 0}</p>
                      <p className="text-xs text-terminal-muted">Active Scenarios</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-mono text-terminal-text">{Array.isArray(riskScenarios.stress_test_recommendations) ? riskScenarios.stress_test_recommendations.length : 0}</p>
                      <p className="text-xs text-terminal-muted">Stress Test Recommendations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-mono text-terminal-text">{riskScenarios.as_of ? new Date(riskScenarios.as_of).toLocaleDateString() : "N/A"}</p>
                      <p className="text-xs text-terminal-muted">Last Updated</p>
                    </div>
                  </div>
                </div>

                {/* Individual Scenarios */}
                {Array.isArray(riskScenarios.scenarios) && (
                  <div className="grid gap-4">
                    {riskScenarios.scenarios.slice(0, 4).map((scenario: any, idx: number) => (
                      <div key={idx} className="terminal-card p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-terminal-text">{scenario.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            scenario.severity === 'high' ? 'bg-terminal-red/20 text-terminal-red' :
                            scenario.severity === 'medium' ? 'bg-terminal-amber/20 text-terminal-amber' :
                            'bg-terminal-green/20 text-terminal-green'
                          }`}>
                            {scenario.severity} impact
                          </span>
                        </div>
                        <p className="text-sm text-terminal-muted mb-3">{typeof scenario.description === 'string' ? scenario.description : "Risk scenario description"}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-semibold text-terminal-text">Probability: {typeof scenario.probability === 'number' ? (scenario.probability * 100).toFixed(1) : 'N/A'}%</p>
                            <p className="text-terminal-muted">Impact Score: {typeof scenario.impact_score === 'number' ? scenario.impact_score : 'N/A'}/100</p>
                          </div>
                          <div>
                            <p className="font-semibold text-terminal-text">Sectors: {Array.isArray(scenario.affected_sectors) ? scenario.affected_sectors.join(", ") : "N/A"}</p>
                            <p className="text-terminal-muted">Duration: {typeof scenario.duration_days === 'number' ? scenario.duration_days : 'N/A'} days</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <SkeletonLoader variant="card" />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function RiskFactorsPage() {
  return (
    <MainLayout>
      <main className="px-6 py-6">
        <FactorsContent />
      </main>
    </MainLayout>
  );
}
