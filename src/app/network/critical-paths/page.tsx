"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupplyCascadeSnapshot, getCascadeHistory } from "@/services/realTimeDataService";
import { AlertTriangle, Route, Globe, Clock, TrendingUp, ArrowRight, Network } from "lucide-react";
import { CascadeSnapshotResponse, CascadeHistoryResponse } from "@/lib/types";
import CascadeHistoryChart from "@/components/network/CascadeHistoryChart";
import { getRiskTextColor, getAccessibilityPattern } from "@/lib/risk-colors";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@3.0.0/world/110m.json";

type MapVisibility = {
  showRoutes: boolean;
  showCritical: boolean;
  showDisruptions: boolean;
};

type MapPosition = {
  center: [number, number];
  scale: number;
};

type SnapshotNode = CascadeSnapshotResponse["nodes"][number];
type SnapshotDisruption = CascadeSnapshotResponse["disruptions"][number];

type MapFilters = {
  searchQuery: string;
  nodeTypes: string[];
  riskLevels: ("low" | "medium" | "high" | "critical")[];
  severityLevels: ("low" | "medium" | "high" | "critical")[];
  region: string;
  minTradeValue: number;
};

const Globe3D = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full flex items-center justify-center text-terminal-muted font-mono text-xs">
      Loading 3D globe...
    </div>
  ),
});

export default function CriticalPathsPage() {
  const [selectedPath, setSelectedPath] = useState<number>(0);

  const {
    data: cascadeData,
    isLoading: cascadeLoading,
    error: cascadeError,
    refetch: refetchCascade
  } = useQuery({
    queryKey: ["supply-cascade-snapshot"],
    queryFn: getSupplyCascadeSnapshot,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ["cascade-history"],
    queryFn: getCascadeHistory,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const isLoading = cascadeLoading || historyLoading;
  const error = cascadeError || historyError;
  const [mapMode, setMapMode] = useState<"globe" | "map">("globe");
  const [visibility, setVisibility] = useState<MapVisibility>({
    showRoutes: true,
    showCritical: true,
    showDisruptions: true,
  });
  const [position, setPosition] = useState<MapPosition>({ center: [0, 10], scale: 150 });
  const [showAnimations, setShowAnimations] = useState(true);
  const [filters, setFilters] = useState<MapFilters>({
    searchQuery: "",
    nodeTypes: ["port", "manufacturer", "supplier", "distributor", "retailer"],
    riskLevels: ["low", "medium", "high", "critical"],
    severityLevels: ["low", "medium", "high", "critical"],
    region: "all",
    minTradeValue: 0,
  });

  const filteredData = useMemo(() => {
    if (!cascadeData) return null;
    const term = filters.searchQuery.trim().toLowerCase();
    const nodes = cascadeData.nodes.filter((n) => {
      const risk = (n.risk_operational + n.risk_financial + n.risk_policy) / 3;
      const riskLevel =
        risk > 0.7 ? "critical" : risk > 0.5 ? "high" : risk > 0.3 ? "medium" : "low";
      const matchesType = filters.nodeTypes.includes(n.type as any);
      const matchesRisk = filters.riskLevels.includes(riskLevel as any);
      const matchesRegion = filters.region === "all" || (n as any).region === filters.region;
      const matchesSearch =
        !term ||
        n.name.toLowerCase().includes(term) ||
        n.type.toLowerCase().includes(term) ||
        ((n as any).region || "").toLowerCase().includes(term);
      return matchesType && matchesRisk && matchesRegion && matchesSearch;
    });
    const nodeIds = new Set(nodes.map((n) => n.id));

    const disruptions = cascadeData.disruptions.filter((d) => {
      const matchesSeverity = filters.severityLevels.includes((d.severity || "low") as any);
      const matchesSearch =
        !term ||
        d.type.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        (d.source && d.source.toLowerCase().includes(term));
      return matchesSeverity && matchesSearch;
    });

    const edges = cascadeData.edges.filter((e) => {
      if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) return false;
      if (filters.minTradeValue && (e as any).trade_value_usd && (e as any).trade_value_usd < filters.minTradeValue) {
        return false;
      }
      return true;
    });

    const critical_paths = cascadeData.critical_paths
      .map((path) => path.filter((id) => nodeIds.has(id)))
      .filter((p) => p.length >= 2);

    return { ...cascadeData, nodes, edges, disruptions, critical_paths };
  }, [cascadeData, filters]);
  
  const fetchData = () => {
    refetchCascade();
    refetchHistory();
  };

  const getPathRiskScore = (pathIndex: number): number => {
    if (!cascadeData || !cascadeData.critical_paths[pathIndex]) return 0;
    
    const path = cascadeData.critical_paths[pathIndex];
    let totalRisk = 0;
    let nodeCount = 0;
    
    path.forEach(nodeId => {
      const node = cascadeData.nodes.find(n => n.id === nodeId);
      if (node) {
        totalRisk += (node.risk_operational + node.risk_financial + node.risk_policy) / 3;
        nodeCount++;
      }
    });
    
    return nodeCount > 0 ? totalRisk / nodeCount : 0;
  };

  const getPathNodes = (pathIndex: number) => {
    if (!cascadeData || !cascadeData.critical_paths[pathIndex]) return [];
    
    const path = cascadeData.critical_paths[pathIndex];
    return path.map(nodeId => 
      cascadeData.nodes.find(n => n.id === nodeId)
    ).filter(Boolean);
  };

  const getPathEdges = (pathIndex: number) => {
    if (!cascadeData || !cascadeData.critical_paths[pathIndex]) return [];
    
    const path = cascadeData.critical_paths[pathIndex];
    const edges = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const edge = cascadeData.edges.find(e => 
        e.from === path[i] && e.to === path[i + 1]
      );
      if (edge) edges.push(edge);
    }
    
    return edges;
  };

  const getRiskColor = (risk: number) => getRiskTextColor(risk * 100);

  const getCurrentMetricValue = (metricName: string): number | null => {
    if (!historyData) return null;
    
    const series = historyData.series.find(s => s.metric === metricName);
    if (!series || series.points.length === 0) return null;
    
    return series.points[series.points.length - 1].v;
  };

  const getPathRiskBadge = (riskScore: number) => {
    if (riskScore > 0.7) return "critical";
    if (riskScore > 0.4) return "warning";
    return "good";
  };

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Analysis
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Critical Path Analysis
          </h1>
          <p className="text-sm text-terminal-muted">
            Identify and monitor critical supply chain pathways and vulnerabilities.
          </p>
        </header>

        <PagePrimer
          kicker="Primer"
          title="Critical Path Intelligence"
          description="Advanced network analysis identifying critical supply chain pathways with vulnerability assessment and impact modeling."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Path Discovery",
              content: "Graph algorithms, centrality analysis, critical node identification.",
              tooltip: "Advanced graph theory algorithms for critical path identification",
              expandedContent: "Betweenness centrality analysis for bottleneck identification, shortest path algorithms with weighted edges based on flow volume and criticality, eigenvector centrality for influence assessment, community detection for supply chain clustering analysis."
            },
            {
              title: "Vulnerability Assessment", 
              content: "Risk scoring, failure impact analysis, cascade prediction modeling.",
              tooltip: "Multi-dimensional risk assessment across operational, financial, and policy vectors",
              expandedContent: "Operational risk assessment based on performance metrics, financial risk analysis using credit scores and market volatility, policy risk evaluation through geopolitical stability indices, combined risk scoring with weighted impact factors."
            },
            {
              title: "Impact Analysis",
              content: "Network resilience, alternative routing, mitigation strategies.",
              tooltip: "Comprehensive impact assessment with alternative pathway analysis",
              expandedContent: "Network resilience scoring based on path redundancy, alternative routing recommendations with cost-benefit analysis, mitigation strategy development using scenario modeling, real-time impact quantification with economic modeling."
            }
          ]}
          dataFlowNodes={[
            {
              id: "network-topology",
              label: "Network Topology",
              type: "source",
              status: "active",
              latency: "< 60s",
              quality: 94,
              description: "Supply chain network mapping and discovery",
              endpoint: "/api/v1/network/topology"
            },
            {
              id: "path-analyzer",
              label: "Path Analyzer", 
              type: "model",
              status: "active",
              latency: "< 5s",
              quality: 91,
              description: "Critical path identification and analysis"
            },
            {
              id: "risk-assessor",
              label: "Risk Assessor",
              type: "model", 
              status: "active",
              latency: "< 3s",
              quality: 89,
              description: "Multi-dimensional risk scoring and assessment"
            },
            {
              id: "path-visualization",
              label: "Path Visualization",
              type: "output",
              status: "active", 
              latency: "< 400ms",
              quality: 96,
              description: "Interactive critical path dashboard"
            }
          ]}
          dataFlowConnections={[
            { from: "network-topology", to: "path-analyzer", type: "real-time", volume: "~100 nodes/min" },
            { from: "path-analyzer", to: "risk-assessor", type: "on-demand", volume: "~50 paths/analysis" },
            { from: "risk-assessor", to: "path-visualization", type: "real-time" },
            { from: "path-analyzer", to: "path-visualization", type: "real-time" }
          ]}
        />

        {/* Status and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {cascadeData && (
              <span className="text-xs font-mono text-terminal-muted">
                Last updated: {new Date(cascadeData.as_of).toLocaleString()}
              </span>
            )}
          </div>
          <Button 
            onClick={fetchData} 
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="font-mono text-xs"
          >
            <Clock className="w-4 h-4 mr-1" />
            Refresh Analysis
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="chart" className="h-96" />
          </div>
        ) : error ? (
          <div className="terminal-card p-6">
            <div className="text-center space-y-2">
              <StatusBadge variant="critical">Error</StatusBadge>
              <p className="text-sm text-terminal-muted">
                Error loading critical path data: {error?.message || 'Unknown error'}
              </p>
              <Button onClick={fetchData} size="sm" variant="outline">
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            {cascadeData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Critical Paths"
                  value={cascadeData.critical_paths.length}
                  unit=""
                  change={0}
                  status="blue"
                  updatedAt={cascadeData.as_of}
                  icon={<Route className="h-5 w-5" />}
                />

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Network Nodes</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {cascadeData.nodes.length}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Supply chain entities
                  </p>
                </div>

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Cascade Index</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {getCurrentMetricValue("global_cascade_index")?.toFixed(2) || "N/A"}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Risk propagation score
                  </p>
                </div>

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Average Path Risk</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {cascadeData.critical_paths.length > 0 
                      ? (cascadeData.critical_paths.reduce((acc, _, i) => acc + getPathRiskScore(i), 0) / cascadeData.critical_paths.length * 100).toFixed(0) + "%"
                      : "N/A"}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Risk assessment
                  </p>
                </div>
              </div>
            )}

            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-terminal-card">
                <TabsTrigger value="map" className="font-mono text-xs uppercase">
                  Interactive Map
                </TabsTrigger>
                <TabsTrigger value="paths" className="font-mono text-xs uppercase">
                  Path Analysis
                </TabsTrigger>
                <TabsTrigger value="trends" className="font-mono text-xs uppercase">
                  Historical Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-6 mt-6">
                {/* Interactive World Map */}
                {cascadeData && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-terminal-text">
                        CRITICAL PATH NETWORK VISUALIZATION
                      </h3>
                      <p className="text-sm text-terminal-muted">
                        Interactive network map showing critical supply chain pathways
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 border border-terminal-border rounded-lg overflow-hidden">
                        {["globe", "map"].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setMapMode(mode as "globe" | "map")}
                            className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                              mapMode === mode
                                ? "bg-terminal-accent/20 text-terminal-accent"
                                : "bg-terminal-surface text-terminal-muted"
                            }`}
                          >
                            {mode === "globe" ? "3D Globe" : "2D Map"}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapToggleButton label="Routes" active={visibility.showRoutes} onClick={() => setVisibility(v => ({...v, showRoutes: !v.showRoutes}))} />
                        <MapToggleButton label="Critical" active={visibility.showCritical} onClick={() => setVisibility(v => ({...v, showCritical: !v.showCritical}))} />
                        <MapToggleButton label="Disruptions" active={visibility.showDisruptions} onClick={() => setVisibility(v => ({...v, showDisruptions: !v.showDisruptions}))} />
                        <MapToggleButton label="Animations" active={showAnimations} onClick={() => setShowAnimations(a => !a)} />
                      </div>
                    </div>
                    <FilterPanel filters={filters} onFiltersChange={setFilters} />
                    <div className="terminal-card p-4">
                      {mapMode === "globe" ? (
                        <GlobeCriticalMap
                          data={filteredData || cascadeData}
                          visibility={visibility}
                          showAnimations={showAnimations}
                          showDisruptions={visibility.showDisruptions}
                        />
                      ) : (
                        <CriticalMap2D
                          data={filteredData || cascadeData}
                          visibility={visibility}
                          position={position}
                          onMove={setPosition}
                          showAnimations={showAnimations}
                        />
                      )}
                    </div>
                    {filteredData && (
                      <FilteredSummary
                        filtered={filteredData}
                        total={cascadeData}
                      />
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="paths" className="space-y-6 mt-6">
                {/* Critical Paths Analysis */}
                {cascadeData && cascadeData.critical_paths.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Path Selector */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                        Critical Supply Paths
                      </h4>
                      <div className="space-y-3">
                        {cascadeData.critical_paths.map((path, index) => {
                          const riskScore = getPathRiskScore(index);
                          const pathNodes = getPathNodes(index);
                          
                          return (
                            <div 
                              key={index}
                              className={`terminal-card p-4 cursor-pointer transition-all ${
                                selectedPath === index ? "border-terminal-accent bg-terminal-accent/10" : "hover:border-terminal-muted"
                              }`}
                              onClick={() => setSelectedPath(index)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-terminal-text">Path {index + 1}</span>
                                <StatusBadge variant={getPathRiskBadge(riskScore)}>
                                  Risk: {(riskScore * 100).toFixed(0)}%
                                </StatusBadge>
                              </div>
                              
                              <div className="flex items-center space-x-2 text-sm text-terminal-muted">
                                {pathNodes.slice(0, 3).map((node, nodeIndex) => (
                                  <div key={node?.id} className="flex items-center">
                                    <span className="truncate max-w-24 font-mono">{node?.name}</span>
                                    {nodeIndex < pathNodes.length - 1 && nodeIndex < 2 && (
                                      <ArrowRight className="w-3 h-3 mx-1" />
                                    )}
                                  </div>
                                ))}
                                {pathNodes.length > 3 && (
                                  <span className="text-terminal-muted font-mono">+{pathNodes.length - 3} more</span>
                                )}
                              </div>
                              
                              <div className="mt-2">
                                <div className="w-full bg-terminal-border/20 rounded-full h-2">
                                  <div 
                                    className={`h-full rounded-full ${
                                      riskScore > 0.7 ? 'bg-terminal-red' : 
                                      riskScore > 0.4 ? 'bg-terminal-orange' : 'bg-terminal-green'
                                    }`}
                                    style={{ width: `${riskScore * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Path Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                        Path {selectedPath + 1} Details
                      </h4>
                      {cascadeData.critical_paths[selectedPath] && (
                        <div className="space-y-4">
                          
                          {/* Path Nodes */}
                          <div className="terminal-card p-4 space-y-3">
                            <h5 className="font-mono text-terminal-text uppercase">
                              Network Nodes ({getPathNodes(selectedPath).length})
                            </h5>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {getPathNodes(selectedPath).map((node, index) => (
                                <div key={node?.id} className="flex items-center justify-between p-3 border border-terminal-border rounded">
                                  <div>
                                    <p className="font-mono text-terminal-text">{node?.name}</p>
                                    <p className="text-xs text-terminal-muted font-mono capitalize">{node?.type}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex space-x-2 text-xs">
                                      <span className={`font-mono ${getRiskColor(node?.risk_operational || 0)}`}>
                                        Op: {((node?.risk_operational || 0) * 100).toFixed(0)}%
                                      </span>
                                      <span className={`font-mono ${getRiskColor(node?.risk_financial || 0)}`}>
                                        Fin: {((node?.risk_financial || 0) * 100).toFixed(0)}%
                                      </span>
                                      <span className={`font-mono ${getRiskColor(node?.risk_policy || 0)}`}>
                                        Pol: {((node?.risk_policy || 0) * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Path Connections */}
                          <div className="terminal-card p-4 space-y-3">
                            <h5 className="font-mono text-terminal-text uppercase">
                              Path Connections ({getPathEdges(selectedPath).length})
                            </h5>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {getPathEdges(selectedPath).map((edge, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-terminal-border rounded">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-mono text-terminal-text">
                                      {cascadeData.nodes.find(n => n.id === edge.from)?.name} 
                                    </span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="text-xs font-mono text-terminal-text">
                                      {cascadeData.nodes.find(n => n.id === edge.to)?.name}
                                    </span>
                                  </div>
                                  <div className="text-right text-xs font-mono">
                                    <div className="space-y-1 text-terminal-muted">
                                      <div>Flow: {(edge.flow * 100).toFixed(0)}%</div>
                                      <div>Congestion: {(edge.congestion * 100).toFixed(0)}%</div>
                                      <div>Delay: {edge.eta_delay_hours}h</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>

                  </div>
                )}
              </TabsContent>

              <TabsContent value="trends" className="space-y-6 mt-6">
                {/* Historical Trends */}
                {historyData && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                      Historical Trends Analysis
                    </h4>
                    <CascadeHistoryChart history={historyData} />
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </>
        )}
      </main>
    </MainLayout>
  );
}

function MapToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
        active
          ? "bg-terminal-accent/20 text-terminal-accent border-terminal-accent/40"
          : "bg-terminal-surface text-terminal-muted border-terminal-border"
      }`}
    >
      {active ? "Hide" : "Show"} {label}
    </button>
  );
}

function CriticalMap2D({
  data,
  visibility,
  position,
  onMove,
  showAnimations,
}: {
  data: CascadeSnapshotResponse;
  visibility: MapVisibility;
  position: MapPosition;
  onMove: (pos: MapPosition) => void;
  showAnimations: boolean;
}) {
  const nodes = data.nodes || [];
  const edges = data.edges || [];
  const criticalPathsRaw = data.critical_paths || [];

  const nodeById = useMemo(() => {
    const map = new Map<string, SnapshotNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const routes = useMemo(() => {
    if (!visibility.showRoutes) return [];
    return edges.slice(0, 200).map((edge) => {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      if (!from || !to) return null;
      return {
        id: `${edge.from}-${edge.to}`,
        coords: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ] as [number, number][],
        criticality: edge.criticality,
      };
    }).filter(Boolean) as { id: string; coords: [number, number][]; criticality?: number }[];
  }, [edges, nodeById, visibility.showRoutes]);

  const criticalPaths = useMemo(() => {
    if (!visibility.showCritical) return [];
    return criticalPathsRaw.map((path, idx) => {
      const coords = path
        .map((id) => nodeById.get(id))
        .filter(Boolean)
        .map((n) => [n!.lng, n!.lat]) as [number, number][];
      return { id: `critical-${idx}`, coords };
    });
  }, [criticalPathsRaw, nodeById, visibility.showCritical]);

  return (
    <div className="relative">
      <ComposableMap projection="geoNaturalEarth1" height={420} className="w-full">
        <ZoomableGroup
          center={position.center}
          zoom={position.scale / 150}
          onMoveEnd={({ coordinates, zoom }) => onMove({ center: [coordinates[0], coordinates[1]], scale: zoom * 150 })}
        >
          <Sphere stroke="#0b1220" strokeWidth={0.6} fill="#0f172a" />
          <Graticule stroke="#162132" strokeWidth={0.35} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#0f172a", stroke: "#1f2937", strokeWidth: 0.25 },
                    hover: { fill: "#111827", stroke: "#334155", strokeWidth: 0.35 },
                  }}
                />
              ))
            }
          </Geographies>

        {routes.map((route) => (
          <Line
            key={route.id}
            from={route.coords[0]}
            to={route.coords[1]}
            stroke={route.criticality && route.criticality > 0.7 ? "#fbbf24" : "#38bdf8"}
            strokeWidth={route.criticality && route.criticality > 0.7 ? 1.8 : 1}
            strokeOpacity={0.7}
            strokeDasharray={showAnimations ? "6 4" : undefined}
          />
        ))}

          {criticalPaths.map((path) =>
            path.coords.length > 1 ? (
              <Line
                key={path.id}
                from={path.coords[0]}
                to={path.coords[path.coords.length - 1]}
                stroke="#f97316"
                strokeWidth={2.4}
                strokeOpacity={0.8}
                strokeDasharray="4 3"
              />
            ) : null
          )}

          {visibility.showDisruptions &&
            data.disruptions?.map((d) => (
              <Marker key={d.id} coordinates={[d.location[1], d.location[0]]}>
                <g className="animate-pulse">
                  <circle r={4} fill={severityColor(d.severity)} opacity={0.85} />
                  <circle r={8} fill={severityColor(d.severity)} opacity={0.15} />
                </g>
              </Marker>
            ))}

          {nodes.map((node) => {
            const risk = (node.risk_operational + node.risk_financial + node.risk_policy) / 3;
            return (
              <Marker key={node.id} coordinates={[node.lng, node.lat]}>
                <g className="cursor-pointer">
                  <circle
                    r={5}
                    fill={risk > 0.6 ? "#f87171" : risk > 0.4 ? "#fbbf24" : "#34d399"}
                    opacity={0.9}
                    className={risk > 0.6 ? "animate-pulse" : ""}
                  />
                  <circle r={9} stroke="#0ea5e9" strokeOpacity={0.3} strokeWidth={1} />
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      <div className="absolute left-3 bottom-3 bg-terminal-bg/80 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-muted font-mono space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Low Risk Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Medium Risk Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>High Risk Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-yellow-400"></span>
          <span>Trade Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-orange-400"></span>
          <span>Critical Path</span>
        </div>
      </div>
    </div>
  );
}

function GlobeCriticalMap({
  data,
  visibility,
  showAnimations,
  showDisruptions,
}: {
  data: CascadeSnapshotResponse;
  visibility: MapVisibility;
  showAnimations: boolean;
  showDisruptions: boolean;
}) {
  const globeRef = useRef<any>(null);
  const nodes = data.nodes || [];
  const edges = data.edges || [];

  const arcsData = useMemo(() => {
    if (!visibility.showRoutes) return [];
    return edges.slice(0, 180).map((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return null;
      return {
        startLat: from.lat,
        startLng: from.lng,
        endLat: to.lat,
        endLng: to.lng,
        color: edge.criticality && edge.criticality > 0.7 ? "#f97316" : "#38bdf8",
        arcAlt: Math.min(0.3, (edge.criticality || 0.5) * 0.4),
      };
    }).filter(Boolean) as any[];
  }, [edges, nodes, visibility.showRoutes]);

  const pointsData = useMemo(
    () =>
      nodes.map((n) => ({
        lat: n.lat,
        lng: n.lng,
        name: n.name,
        risk: (n.risk_operational + n.risk_financial + n.risk_policy) / 3,
      })),
    [nodes]
  );

  const disruptionPoints = useMemo(
    () =>
      (data.disruptions || []).map((d) => ({
        lat: d.location[0],
        lng: d.location[1],
        severity: d.severity,
        id: d.id,
      })),
    [data.disruptions]
  );

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.6;
    }
  }, []);

  return (
    <div className="relative">
      <Globe3D
        ref={globeRef}
        height={420}
        width={900}
        backgroundColor="#0b1220"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        arcsData={arcsData}
        arcColor={(d: unknown) => d.color}
        arcDashLength={showAnimations ? 0.3 : 1}
        arcDashGap={showAnimations ? 0.9 : 0}
        arcDashAnimateTime={showAnimations ? 4000 : 0}
        pointsData={pointsData}
        pointLat={(d: unknown) => d.lat}
        pointLng={(d: unknown) => d.lng}
        pointAltitude={(d: unknown) => 0.02 + d.risk * 0.05}
        pointColor={(d: unknown) => (d.risk > 0.6 ? "#f87171" : d.risk > 0.4 ? "#fbbf24" : "#34d399")}
        pointRadius={0.8}
        enablePointerInteraction
        hexBinPointsData={showDisruptions ? disruptionPoints : []}
        hexBinPointLat={(d: unknown) => d.lat}
        hexBinPointLng={(d: unknown) => d.lng}
        hexAltitude={showDisruptions ? 0.08 : 0}
        hexTopColor={() => "#f97316"}
        hexSideColor={() => "#f97316"}
        hexBinResolution={4}
      />
      <div className="absolute right-3 bottom-3 text-xs font-mono text-terminal-muted">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: MapFilters;
  onFiltersChange: (next: MapFilters) => void;
}) {
  const toggleList = (key: "riskLevels" | "severityLevels" | "nodeTypes", value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFiltersChange({ ...filters, [key]: next } as MapFilters);
  };

  return (
    <div className="terminal-card p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-mono text-terminal-muted">Search</label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search nodes or disruptions..."
            className="w-full px-3 py-2 rounded border border-terminal-border bg-terminal-bg text-terminal-text text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-terminal-muted">Region</label>
          <select
            value={filters.region}
            onChange={(e) => onFiltersChange({ ...filters, region: e.target.value })}
            className="w-full px-3 py-2 rounded border border-terminal-border bg-terminal-bg text-terminal-text text-sm"
          >
            <option value="all">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Latin America">Latin America</option>
            <option value="Middle East">Middle East</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFiltersChange({ ...filters, riskLevels: ["high", "critical"], severityLevels: filters.severityLevels })}
          className="px-3 py-1.5 text-xs font-mono rounded border bg-terminal-red/10 text-terminal-red border-terminal-red/30"
        >
          High Risk Only
        </button>
        <button
          onClick={() => onFiltersChange({ ...filters, severityLevels: ["critical"] })}
          className="px-3 py-1.5 text-xs font-mono rounded border bg-terminal-orange/10 text-terminal-orange border-terminal-orange/30"
        >
          Critical Disruptions
        </button>
        <button
          onClick={() =>
            onFiltersChange({
              searchQuery: "",
              nodeTypes: ["port", "manufacturer", "supplier", "distributor", "retailer"],
              riskLevels: ["low", "medium", "high", "critical"],
              severityLevels: ["low", "medium", "high", "critical"],
              region: "all",
              minTradeValue: 0,
            })
          }
          className="px-3 py-1.5 text-xs font-mono rounded border bg-terminal-surface text-terminal-muted border-terminal-border"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ToggleGroup
          label="Risk Levels"
          options={["low", "medium", "high", "critical"]}
          active={filters.riskLevels}
          onToggle={(v) => toggleList("riskLevels", v)}
        />
        <ToggleGroup
          label="Severity"
          options={["low", "medium", "high", "critical"]}
          active={filters.severityLevels}
          onToggle={(v) => toggleList("severityLevels", v)}
        />
        <ToggleGroup
          label="Node Types"
          options={["port", "manufacturer", "supplier", "distributor", "retailer"]}
          active={filters.nodeTypes}
          onToggle={(v) => toggleList("nodeTypes", v)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-terminal-muted">Min Trade Value (USD)</label>
        <input
          type="range"
          min={0}
          max={1_000_000_000}
          step={50_000_000}
          value={filters.minTradeValue}
          onChange={(e) => onFiltersChange({ ...filters, minTradeValue: Number(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs font-mono text-terminal-muted">
          {filters.minTradeValue > 0 ? `$${(filters.minTradeValue / 1_000_000).toFixed(0)}M` : "N/A"}
        </p>
      </div>
    </div>
  );
}

function ToggleGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: string[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-terminal-muted">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
              active.includes(opt)
                ? "bg-terminal-accent/20 text-terminal-accent border-terminal-accent/40"
                : "bg-terminal-surface text-terminal-muted border-terminal-border"
            }`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilteredSummary({
  filtered,
  total,
}: {
  filtered: CascadeSnapshotResponse;
  total: CascadeSnapshotResponse;
}) {
  const items = [
    { label: "Trade Nodes", val: filtered.nodes.length, total: total.nodes.length },
    { label: "Trade Routes", val: filtered.edges.length, total: total.edges.length },
    { label: "Active Disruptions", val: filtered.disruptions.length, total: total.disruptions.length },
    { label: "Critical Paths", val: filtered.critical_paths.length, total: total.critical_paths.length },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((i) => (
        <div key={i.label} className="terminal-card p-3 space-y-1">
          <p className="text-xs font-mono text-terminal-muted">{i.label}</p>
          <p className="text-lg font-mono text-terminal-text">
            {i.val}
            {i.val !== i.total && <span className="text-terminal-accent text-xs"> / {i.total}</span>}
          </p>
        </div>
      ))}
      <div className="terminal-card p-3 space-y-1">
        <p className="text-xs font-mono text-terminal-muted">Updated</p>
        <p className="text-xs font-mono text-terminal-text">
          {new Date(total.as_of || Date.parse(total.as_of || new Date().toISOString())).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
const severityColor = (sev?: string) => {
  switch (sev?.toLowerCase()) {
    case "critical": return "#f97316";
    case "high": return "#facc15";
    case "medium": return "#22d3ee";
    default: return "#10b981";
  }
};
