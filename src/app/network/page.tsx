 "use client";

import MainLayout from "@/components/layout/MainLayout";
import NetworkOverview from "@/components/network/NetworkOverview";
import DependencyHeatmap from "@/components/network/DependencyHeatmap";
import { useNetworkSnapshot } from "@/hooks/useNetworkSnapshot";
import ProviderReliabilityTrend from "@/components/network/ProviderReliabilityTrend";
import PagePrimer from "@/components/ui/PagePrimer";
import WhatChanged from "@/components/risk/WhatChanged";
import { useSupplyCascadeSnapshot, useCascadeImpacts, useCascadeHistory } from "@/hooks/useSupplyCascade";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import CascadeHistoryChart from "@/components/network/CascadeHistoryChart";
import { useQuery } from "@tanstack/react-query";
import { getSPGlobalVulnerabilities, getWtoTradeVolume } from "@/services/realTimeDataService";
import SectorVulnerabilityTable from "@/components/network/SectorVulnerabilityTable";
import { mlIntelligenceService } from "@/services/mlIntelligenceService";
import { useIsClient } from "@/hooks/useIsClient";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Zap, 
  Target, 
  Cpu, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Shield
} from "lucide-react";

export default function NetworkPage() {
  const isClient = useIsClient();
  const { data } = useNetworkSnapshot();
  const { data: cascadeSnapshot, isLoading: cascadeLoading } = useSupplyCascadeSnapshot();
  const { data: cascadeImpacts, isLoading: impactsLoading } = useCascadeImpacts();
  const { data: cascadeHistory, isLoading: historyLoading } = useCascadeHistory();
  const { data: spGlobalVuln } = useQuery({
    queryKey: ["sp-global-vulnerabilities"],
    queryFn: getSPGlobalVulnerabilities,
    staleTime: 60_000,
  });
  const { data: wtoTradeVolume } = useQuery({
    queryKey: ["wto-trade-volume"],
    queryFn: getWtoTradeVolume,
    staleTime: 6 * 60_000,
  });

  // Network ML Insights Query
  const { 
    data: networkMLInsightsData, 
    isLoading: networkMLInsightsLoading, 
    error: networkMLInsightsError,
    refetch: refetchNetworkMLInsights 
  } = useQuery({
    queryKey: ["network-ml-insights-summary"],
    queryFn: () => mlIntelligenceService.getNetworkMLInsights(),
    staleTime: 600_000, // 10 minutes
    refetchInterval: 1200_000, // 20 minutes
    enabled: isClient, // Only run on client side
  });
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Analysis
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Systemic Topology Overview
          </h1>
          <p className="text-sm text-terminal-muted">
            Critical nodes, paths, and vulnerabilities from `/api/v1/network/topology`.
          </p>
        </header>
        <PagePrimer
          kicker="Primer"
          title="What This Page Measures"
          description="System topology, critical paths, and provider reliability projected into network risk."
          expandable={true}
          showDataFlow={true}
          items={[
            { 
              title: "Inputs", 
              content: "Provider health, partner dependencies, vulnerabilities, critical paths.",
              tooltip: "Real-time network topology feeds updating every 30 seconds from infrastructure monitoring",
              expandedContent: "Network topology discovery, provider health metrics (uptime, latency, error rates), partner dependency mapping, vulnerability assessment data, critical path analysis using graph algorithms with weighted edges based on traffic volume and business criticality."
            },
            { 
              title: "Process", 
              content: "Risk scoring per node, status mix, cascades, and dependency heatmaps.",
              tooltip: "Multi-layer network analysis combining topological and business impact modeling",
              expandedContent: "1) Graph centrality analysis (betweenness, closeness, eigenvector centrality), 2) Cascade simulation using Monte Carlo methods for failure propagation, 3) Dependency risk scoring with weighted business impact factors, 4) Heatmap generation using hierarchical clustering and risk aggregation."
            },
            { 
              title: "Outputs", 
              content: "Critical nodes/paths, partner status, reliability trends, cascade visuals.",
              tooltip: "Actionable network intelligence with real-time monitoring and predictive alerts",
              expandedContent: "Critical node identification with failure impact scores, shortest path analysis for redundancy planning, partner reliability dashboards with SLA tracking, cascade visualization showing potential failure propagation paths with timeline estimates."
            },
          ]}
          dataFlowNodes={[
            {
              id: "topology-scanner",
              label: "Topology Scanner",
              type: "source",
              status: "active",
              latency: "< 30s",
              quality: 93,
              description: "Network topology discovery and mapping",
              endpoint: "/api/v1/network/topology"
            },
            {
              id: "provider-health",
              label: "Provider Health",
              type: "source", 
              status: "active",
              latency: "< 10s",
              quality: 89,
              description: "Real-time provider status monitoring",
              endpoint: "/api/v1/network/providers/health"
            },
            {
              id: "dependency-mapper",
              label: "Dependency Mapper",
              type: "source",
              status: "active",
              latency: "< 60s", 
              quality: 91,
              description: "Partner dependency analysis",
              endpoint: "/api/v1/network/dependencies"
            },
            {
              id: "network-analyzer",
              label: "Network Analyzer",
              type: "process",
              status: "active",
              latency: "< 5s",
              quality: 95,
              description: "Graph analysis and risk scoring"
            },
            {
              id: "cascade-simulator",
              label: "Cascade Model",
              type: "model",
              status: "active",
              latency: "< 3s",
              quality: 88,
              description: "Failure propagation simulation"
            },
            {
              id: "heatmap-generator",
              label: "Heatmap Engine",
              type: "model",
              status: "active",
              latency: "< 2s",
              quality: 92,
              description: "Risk visualization and clustering"
            },
            {
              id: "network-dashboard",
              label: "Network UI",
              type: "output",
              status: "active",
              latency: "< 500ms",
              quality: 97,
              description: "Real-time network risk dashboard"
            }
          ]}
          dataFlowConnections={[
            { from: "topology-scanner", to: "network-analyzer", type: "batch", volume: "~100 nodes/min" },
            { from: "provider-health", to: "network-analyzer", type: "real-time", volume: "~200 metrics/s" },
            { from: "dependency-mapper", to: "network-analyzer", type: "batch", volume: "~50 deps/min" },
            { from: "network-analyzer", to: "cascade-simulator", type: "on-demand", volume: "1 update/10m" },
            { from: "network-analyzer", to: "heatmap-generator", type: "real-time", volume: "1 update/30s" },
            { from: "cascade-simulator", to: "network-dashboard", type: "real-time" },
            { from: "heatmap-generator", to: "network-dashboard", type: "real-time" },
            { from: "network-analyzer", to: "network-dashboard", type: "real-time" }
          ]}
        />
        <WhatChanged />

        {/* Network ML Intelligence Section */}
        <section className="space-y-4">
          <div className="terminal-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-terminal-blue" />
                <h4 className="text-lg font-bold text-terminal-text">Network ML Intelligence</h4>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={networkMLInsightsLoading ? "warning" : networkMLInsightsError ? "critical" : "good"} size="sm">
                  {networkMLInsightsLoading ? "PROCESSING" : networkMLInsightsError ? "OFFLINE" : "ACTIVE"}
                </StatusBadge>
                <Button onClick={() => refetchNetworkMLInsights()} size="sm" variant="outline" className="font-mono text-xs">
                  Refresh ML
                </Button>
              </div>
            </div>

            {networkMLInsightsLoading ? (
              <SkeletonLoader variant="card" className="h-64" />
            ) : networkMLInsightsError ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Network ML models temporarily unavailable</span>
                </div>
                <p className="text-xs text-red-300 mt-1">Using cached network analytics while models come online</p>
              </div>
            ) : networkMLInsightsData ? (
              <>
                {/* Network Health Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="terminal-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-terminal-green" />
                      <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Network Health</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-green">
                      {(networkMLInsightsData.overall_metrics.network_health_score * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-terminal-muted font-mono">
                      Status: {networkMLInsightsData.overall_metrics.overall_status.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="terminal-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-terminal-amber" />
                      <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Cascade Risk</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-amber">
                      {(networkMLInsightsData.cascade_analysis.cascade_risk_score * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-terminal-muted font-mono">
                      Level: {networkMLInsightsData.cascade_analysis.risk_level}
                    </p>
                  </div>

                  <div className="terminal-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-terminal-blue" />
                      <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Resilience</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-blue">
                      {(networkMLInsightsData.resilience_analysis.resilience_score * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-terminal-muted font-mono">
                      Recovery: {networkMLInsightsData.resilience_analysis.estimated_recovery_hours.toFixed(0)}h
                    </p>
                  </div>

                  <div className="terminal-card p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-terminal-purple" />
                      <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Anomalies</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-terminal-purple">
                      {networkMLInsightsData.anomaly_analysis.total_anomalies}
                    </p>
                    <p className="text-xs text-terminal-muted font-mono">
                      High: {networkMLInsightsData.anomaly_analysis.severity_breakdown.high}
                      Medium: {networkMLInsightsData.anomaly_analysis.severity_breakdown.medium}
                    </p>
                  </div>
                </div>

                {/* Detailed Analysis Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cascade Analysis */}
                  <div className="terminal-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-terminal-amber" />
                      <h5 className="font-bold text-terminal-text">Cascade Risk Analysis</h5>
                    </div>
                    <div className="space-y-3">
                      {networkMLInsightsData.cascade_analysis.critical_edges?.length > 0 ? (
                        <>
                          <div>
                            <p className="text-xs uppercase text-terminal-muted mb-2">Critical Routes</p>
                            {networkMLInsightsData.cascade_analysis.critical_edges.slice(0, 3).map((edge, idx) => (
                              <div key={idx} className="bg-terminal-surface p-2 rounded border-l-4 border-terminal-amber mb-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-mono text-terminal-text">{edge.from} → {edge.to}</span>
                                  <StatusBadge 
                                    variant={edge.criticality > 0.8 ? "critical" : "warning"}
                                    size="sm"
                                  >
                                    {(edge.criticality * 100).toFixed(0)}%
                                  </StatusBadge>
                                </div>
                                <p className="text-xs text-terminal-muted">
                                  Flow: {(edge.flow * 100).toFixed(0)}% | Congestion: {(edge.congestion * 100).toFixed(0)}%
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-terminal-muted">No critical routes identified</p>
                      )}
                      {networkMLInsightsData.cascade_analysis.insights?.map((insight, idx) => (
                        <p key={idx} className="text-xs text-terminal-muted bg-terminal-surface/50 p-2 rounded">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Resilience Analysis */}
                  <div className="terminal-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-terminal-blue" />
                      <h5 className="font-bold text-terminal-text">Resilience Assessment</h5>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-terminal-surface p-3 rounded border-l-4 border-terminal-blue">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-terminal-muted">Resilience Score</p>
                            <p className="font-mono text-terminal-text">{(networkMLInsightsData.resilience_analysis.resilience_score * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-terminal-muted">Redundancy</p>
                            <p className="font-mono text-terminal-text">{(networkMLInsightsData.resilience_analysis.redundancy_score * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-terminal-muted">Recovery Time</p>
                            <p className="font-mono text-terminal-text">{networkMLInsightsData.resilience_analysis.estimated_recovery_hours.toFixed(0)}h</p>
                          </div>
                          <div>
                            <p className="text-terminal-muted">Confidence</p>
                            <p className="font-mono text-terminal-text">{(networkMLInsightsData.resilience_analysis.confidence * 100).toFixed(0)}%</p>
                          </div>
                        </div>
                      </div>
                      {networkMLInsightsData.resilience_analysis.insights?.map((insight, idx) => (
                        <p key={idx} className="text-xs text-terminal-muted bg-terminal-surface/50 p-2 rounded">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Anomaly Detection */}
                  <div className="terminal-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-terminal-purple" />
                      <h5 className="font-bold text-terminal-text">Anomaly Detection</h5>
                    </div>
                    <div className="space-y-3">
                      {networkMLInsightsData.anomaly_analysis.anomalies?.length > 0 ? (
                        <>
                          {networkMLInsightsData.anomaly_analysis.anomalies.slice(0, 3).map((anomaly, idx) => (
                            <div key={idx} className="bg-terminal-surface p-3 rounded border-l-4 border-terminal-purple">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono text-terminal-text">{anomaly.type.replace('_', ' ')}</span>
                                <StatusBadge 
                                  variant={anomaly.severity === 'high' ? "critical" : anomaly.severity === 'medium' ? "warning" : "good"}
                                  size="sm"
                                >
                                  {anomaly.severity.toUpperCase()}
                                </StatusBadge>
                              </div>
                              <p className="text-xs text-terminal-muted mt-1">{anomaly.entity_name}</p>
                              <p className="text-xs text-terminal-muted">{anomaly.details}</p>
                              <p className="text-xs text-terminal-muted">
                                Score: {anomaly.anomaly_score.toFixed(3)} | {new Date(anomaly.detected_at).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="bg-terminal-surface p-3 rounded border-l-4 border-terminal-green">
                          <p className="text-sm text-terminal-green font-mono">✓ No anomalies detected</p>
                          <p className="text-xs text-terminal-muted">Network behavior within normal parameters</p>
                        </div>
                      )}
                      {networkMLInsightsData.anomaly_analysis.insights?.map((insight, idx) => (
                        <p key={idx} className="text-xs text-terminal-muted bg-terminal-surface/50 p-2 rounded">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Model Performance Summary */}
                <div className="bg-terminal-surface/30 rounded p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <p className="text-terminal-muted">Cascade Model</p>
                      <p className="font-mono text-terminal-green">
                        Accuracy: {(networkMLInsightsData.cascade_analysis.model_performance.accuracy * 100).toFixed(0)}%
                      </p>
                      <p className="font-mono text-terminal-muted">
                        Confidence: {(networkMLInsightsData.cascade_analysis.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-terminal-muted">Resilience Model</p>
                      <p className="font-mono text-terminal-green">
                        Accuracy: {(networkMLInsightsData.resilience_analysis.model_performance.accuracy * 100).toFixed(0)}%
                      </p>
                      <p className="font-mono text-terminal-muted">
                        Confidence: {(networkMLInsightsData.resilience_analysis.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-terminal-muted">Anomaly Model</p>
                      <p className="font-mono text-terminal-green">
                        Precision: {(networkMLInsightsData.anomaly_analysis.model_performance.precision * 100).toFixed(0)}%
                      </p>
                      <p className="font-mono text-terminal-muted">
                        Recall: {(networkMLInsightsData.anomaly_analysis.model_performance.recall * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <p className="text-terminal-muted">Network ML insights loading...</p>
              </div>
            )}
          </div>
        </section>

        <NetworkOverview />
        <ProviderReliabilityTrend />
        {data && data.partnerDependencies && data.partnerDependencies.length > 0 && (
          <DependencyHeatmap snapshot={data} />
        )}

        {/* Supply Chain Cascade Snapshot */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">Supply Chain Cascade</p>
              <h3 className="text-lg font-bold text-terminal-text">World Map Cascade Snapshot</h3>
              <p className="text-sm text-terminal-muted">
                Nodes, routes, and disruptions with finance/policy/industry impacts.
              </p>
            </div>
            <span className="text-xs font-mono text-terminal-muted">
              {cascadeSnapshot?.as_of ? `As of ${new Date(cascadeSnapshot.as_of).toLocaleString()}` : "Loading..."}
            </span>
          </div>
          {cascadeLoading ? (
            <SkeletonLoader variant="card" />
          ) : cascadeSnapshot ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="terminal-card p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Nodes / Edges</p>
                <p className="text-2xl font-bold font-mono text-terminal-text">
                  {cascadeSnapshot.nodes.length} / {cascadeSnapshot.edges.length}
                </p>
                <p className="text-xs text-terminal-muted font-mono">Critical paths: {cascadeSnapshot.critical_paths.length}</p>
              </div>
              <div className="terminal-card p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Disruptions</p>
                <p className="text-2xl font-bold font-mono text-terminal-text">
                  {cascadeSnapshot.disruptions.length}
                </p>
                <p className="text-xs text-terminal-muted font-mono">Live geo/policy events</p>
              </div>
              <div className="terminal-card p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Top Critical Path</p>
                <p className="text-sm font-mono text-terminal-text break-words">
                  {cascadeSnapshot.critical_paths[0]?.join(" → ") || "n/a"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-terminal-muted font-mono">Cascade snapshot unavailable.</p>
          )}

          {/* Impacts */}
          {impactsLoading ? (
            <SkeletonLoader variant="card" />
          ) : cascadeImpacts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Financial Impact */}
              <div className="terminal-card p-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Financial Impact</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-muted">Total Disruption Impact</span>
                    <span className="text-xs font-mono text-terminal-text">
                      ${(cascadeImpacts.financial?.total_disruption_impact_usd || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-muted">Active Disruptions</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {cascadeImpacts.financial?.active_disruptions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-muted">Port Congestion Impact</span>
                    <span className="text-xs font-mono text-terminal-text">
                      ${(cascadeImpacts.financial?.port_congestion_impact_usd || 0).toLocaleString()}
                    </span>
                  </div>
                  {cascadeImpacts.financial?.credit_spreads && (
                    <div className="mt-2 pt-2 border-t border-terminal-border">
                      <p className="text-xs text-terminal-muted mb-1">Credit Spreads</p>
                      <div className="text-xs font-mono space-y-1">
                        <div className="flex justify-between">
                          <span>EM:</span>
                          <span>{cascadeImpacts.financial.credit_spreads.em?.bp || 0} bp</span>
                        </div>
                        <div className="flex justify-between">
                          <span>High Yield:</span>
                          <span>{cascadeImpacts.financial.credit_spreads.high_yield?.bp || 0} bp</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Policy Impact */}
              <div className="terminal-card p-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Policy Impact</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-muted">Overall Policy Risk</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {((cascadeImpacts.policy?.overall_policy_risk || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-muted">Policy Events</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {cascadeImpacts.policy?.policy_events || 0}
                    </span>
                  </div>
                  {cascadeImpacts.policy?.trade_routes && Object.keys(cascadeImpacts.policy.trade_routes).length > 0 ? (
                    <div className="mt-2 pt-2 border-t border-terminal-border">
                      <p className="text-xs text-terminal-muted mb-1">Affected Trade Routes</p>
                      <div className="text-xs font-mono space-y-1">
                        {Object.entries(cascadeImpacts.policy.trade_routes).slice(0, 3).map(([route, impact], idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="truncate">{route}:</span>
                            <span>{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-terminal-border">
                      <p className="text-xs text-terminal-green">✓ No trade route disruptions</p>
                    </div>
                  )}
                  {cascadeImpacts.policy?.note && (
                    <p className="text-xs text-terminal-muted italic mt-2">
                      {cascadeImpacts.policy.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Industry Impact */}
              <div className="terminal-card p-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Industry Impact</p>
                <div className="space-y-2">
                  {cascadeImpacts.industry?.lead_time_days && (
                    <div>
                      <p className="text-xs text-terminal-muted mb-1">Lead Time (Days)</p>
                      <div className="text-xs font-mono space-y-1">
                        {Object.entries(cascadeImpacts.industry.lead_time_days).map(([sector, days], idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="capitalize">{sector}:</span>
                            <span>{days}d</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cascadeImpacts.industry?.capacity && (
                    <div className="mt-2 pt-2 border-t border-terminal-border">
                      <p className="text-xs text-terminal-muted mb-1">Capacity Utilization</p>
                      <div className="text-xs font-mono space-y-1">
                        {Object.entries(cascadeImpacts.industry.capacity).map(([type, util], idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="capitalize">{type.replace('_', ' ')}:</span>
                            <span>{((util as number) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cascadeImpacts.industry?.disruption_summary && (
                    <div className="mt-2 pt-2 border-t border-terminal-border">
                      <p className="text-xs text-terminal-muted mb-1">Active Disruptions</p>
                      <div className="text-xs font-mono space-y-1">
                        {Object.entries(cascadeImpacts.industry.disruption_summary).map(([sector, count], idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="capitalize">{sector}:</span>
                            <span className={count as number > 0 ? "text-terminal-amber" : "text-terminal-green"}>
                              {count as number}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Sector Vulnerabilities (S&P mock) */}
          {spGlobalVuln && (
            <SectorVulnerabilityTable
              sectors={spGlobalVuln.sectors}
              recommendations={spGlobalVuln.recommendations}
            />
          )}

          {/* WTO Trade Volume */}
          {wtoTradeVolume && (
            <div className="terminal-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-terminal-muted">Global Trade Volume</p>
                  <h4 className="text-sm font-semibold text-terminal-text">WTO Trade Statistics</h4>
                </div>
                <span className="text-xs font-mono text-terminal-muted">
                  {wtoTradeVolume.data_timestamp ? new Date(wtoTradeVolume.data_timestamp).toLocaleString() : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-terminal-border rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Total Trade</p>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    ${((wtoTradeVolume.total_global_trade || 0) / 1_000_000_000).toFixed(2)}B
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">YoY {(wtoTradeVolume.year_on_year_growth || 0).toFixed(2)}%</p>
                </div>
                <div className="border border-terminal-border rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Top Traders</p>
                  <ul className="text-xs font-mono text-terminal-text space-y-1">
                    {(wtoTradeVolume.top_traders || []).slice(0, 3).map((t, idx) => (
                      <li key={`${t.country}-${idx}`}>{t.country || "N/A"}: ${((t.value || 0) / 1_000_000_000).toFixed(2)}B</li>
                    ))}
                  </ul>
                </div>
                <div className="border border-terminal-border rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Regional Breakdown</p>
                  <ul className="text-xs font-mono text-terminal-text space-y-1">
                    {Object.entries(wtoTradeVolume.regional_breakdown || {}).slice(0, 4).map(([region, val]) => (
                      <li key={region}>{region}: ${(val / 1_000_000_000).toFixed(2)}B</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {historyLoading ? (
            <SkeletonLoader variant="chart" />
          ) : (
            <CascadeHistoryChart history={cascadeHistory} />
          )}
        </section>
      </main>
    </MainLayout>
  );
}
