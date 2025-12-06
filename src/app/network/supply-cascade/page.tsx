"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupplyCascadeSnapshot, getCascadeHistory, getCascadeImpacts } from "@/services/realTimeDataService";
import { AlertTriangle, TrendingUp, Globe, Clock, DollarSign, Shield, Wifi, WifiOff, RotateCcw } from "lucide-react";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { CascadeSnapshotResponse, CascadeImpactsResponse, CascadeHistoryResponse } from "@/lib/types";
import CascadeHistoryChart from "@/components/network/CascadeHistoryChart";
import { getRiskLevel, getRiskTextColor } from "@/lib/risk-colors";
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

const Globe3D = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full flex items-center justify-center text-terminal-muted font-mono text-xs">
      Loading 3D globe...
    </div>
  ),
});

const geoUrl = "https://unpkg.com/world-atlas@3.0.0/world/110m.json";

type MapVisibility = {
  showRoutes: boolean;
  showCritical: boolean;
  showDisruptions: boolean;
};

type SnapshotNode = CascadeSnapshotResponse["nodes"][number];
type SnapshotDisruption = CascadeSnapshotResponse["disruptions"][number];

type MapPosition = {
  center: [number, number];
  scale: number;
};

function GlobeMap({
  data,
  visibility,
}: {
  data: CascadeSnapshotResponse;
  visibility: MapVisibility;
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
        arcDashLength={0.3}
        arcDashGap={0.9}
        arcDashAnimateTime={4000}
        pointsData={pointsData}
        pointLat={(d: unknown) => d.lat}
        pointLng={(d: unknown) => d.lng}
        pointAltitude={(d: unknown) => 0.02 + d.risk * 0.05}
        pointColor={(d: unknown) => (d.risk > 0.6 ? "#f87171" : d.risk > 0.4 ? "#fbbf24" : "#34d399")}
        pointRadius={0.8}
        enablePointerInteraction
      />
      <div className="absolute right-3 bottom-3 text-xs font-mono text-terminal-muted">
        Live cascade topology
      </div>
    </div>
  );
}

export default function SupplyCascadePage() {
  const [mapVisibility, setMapVisibility] = useState<MapVisibility>({
    showRoutes: true,
    showCritical: true,
    showDisruptions: true,
  });

  const [mapType, setMapType] = useState<"flat" | "globe">("flat");

  const {
    data: snapshotData,
    error: snapshotError,
    isLoading: snapshotLoading,
    refetch: refetchSnapshot,
  } = useQuery({
    queryKey: ["cascade-snapshot"],
    queryFn: getSupplyCascadeSnapshot,
    refetchInterval: 120000,
    staleTime: 60000,
    retry: 2,
  });

  const {
    data: historyData,
    error: historyError,
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ["cascade-history"],
    queryFn: getCascadeHistory,
    refetchInterval: 300000,
    staleTime: 240000,
  });

  const {
    data: impactsData,
    error: impactsError,
    isLoading: impactsLoading,
  } = useQuery({
    queryKey: ["cascade-impacts"],
    queryFn: getCascadeImpacts,
    refetchInterval: 180000,
    staleTime: 120000,
  });

  const { isOnline, lastUpdate } = useRealTimeUpdates();

  if (snapshotLoading) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <SkeletonLoader height="200px" />
          <SkeletonLoader height="400px" />
        </div>
      </MainLayout>
    );
  }

  if (snapshotError) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <div className="text-center text-red-400 p-8 border border-red-800 rounded bg-red-900/20">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">Failed to Load Supply Chain Data</h2>
            <p className="text-sm text-red-300">Unable to fetch supply cascade snapshot</p>
            <Button 
              onClick={() => refetchSnapshot()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const snapshot = snapshotData as CascadeSnapshotResponse;
  const history = historyData as CascadeHistoryResponse;
  const impacts = impactsData as CascadeImpactsResponse;

  const criticalNodes = snapshot?.nodes?.filter(n => 
    (n.risk_operational + n.risk_financial + n.risk_policy) / 3 > 0.7
  ) || [];

  const totalDisruptions = snapshot?.disruptions?.length || 0;
  const criticalDisruptions = snapshot?.disruptions?.filter(d => 
    d.severity === "critical" || d.severity === "high"
  )?.length || 0;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <PagePrimer
          title="Supply Chain Cascade Analysis"
          description="Real-time visualization of global supply chain dependencies, disruptions, and cascading effects"
          badge={
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-xs">Offline</span>
                </>
              )}
              {snapshot?.fallback_data && (
                <>
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                  <span className="text-amber-400 text-xs">Synthetic Data</span>
                </>
              )}
            </div>
          }
        />

        {/* Fallback Data Warning */}
        {snapshot?.fallback_data && (
          <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-amber-400 font-semibold text-sm">Displaying Synthetic Data</h3>
            </div>
            <p className="text-amber-200 text-sm">
              External API services are currently unavailable. The data shown is simulated for demonstration purposes.
              {snapshot?.metadata?.fallback_reason && (
                <span className="block text-xs text-amber-300 mt-1">
                  Reason: {snapshot.metadata.fallback_reason}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Nodes"
            value={snapshot?.nodes?.length?.toLocaleString() || "0"}
            icon={<Globe className="w-5 h-5 text-blue-400" />}
            change={{ value: 0, type: "neutral" }}
            description="Supply chain nodes"
          />
          
          <MetricCard
            title="Critical Nodes"
            value={criticalNodes.length.toLocaleString()}
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
            change={{ value: 0, type: "neutral" }}
            description="High-risk dependencies"
          />
          
          <MetricCard
            title="Active Disruptions"
            value={totalDisruptions.toLocaleString()}
            icon={<Shield className="w-5 h-5 text-yellow-400" />}
            change={{ value: 0, type: "neutral" }}
            description="Current supply issues"
          />
          
          <MetricCard
            title="Critical Disruptions"
            value={criticalDisruptions.toLocaleString()}
            icon={<TrendingUp className="w-5 h-5 text-red-400" />}
            change={{ value: 0, type: "neutral" }}
            description="Severe disruptions"
          />
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-terminal-card p-2 rounded">
              <Button
                size="sm"
                variant={mapType === "flat" ? "default" : "outline"}
                onClick={() => setMapType("flat")}
                className="text-xs"
              >
                Flat Map
              </Button>
              <Button
                size="sm"
                variant={mapType === "globe" ? "default" : "outline"}
                onClick={() => setMapType("globe")}
                className="text-xs"
              >
                3D Globe
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mapVisibility.showRoutes}
                onChange={(e) =>
                  setMapVisibility((prev) => ({ ...prev, showRoutes: e.target.checked }))
                }
                className="rounded border-terminal-border"
              />
              Trade Routes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mapVisibility.showCritical}
                onChange={(e) =>
                  setMapVisibility((prev) => ({ ...prev, showCritical: e.target.checked }))
                }
                className="rounded border-terminal-border"
              />
              Critical Paths
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mapVisibility.showDisruptions}
                onChange={(e) =>
                  setMapVisibility((prev) => ({ ...prev, showDisruptions: e.target.checked }))
                }
                className="rounded border-terminal-border"
              />
              Disruptions
            </label>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-terminal-card border border-terminal-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-terminal-text">
              Global Supply Chain Network
            </h3>
            {lastUpdate && (
              <div className="flex items-center gap-2 text-xs text-terminal-muted">
                <Clock className="w-3 h-3" />
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>

          {snapshot && (
            <div className="space-y-4">
              {mapType === "globe" ? (
                <GlobeMap data={snapshot} visibility={mapVisibility} />
              ) : (
                <div className="h-[420px] bg-terminal-bg rounded border border-terminal-border">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 120,
                    }}
                    width={900}
                    height={420}
                    style={{ background: "#0b1220" }}
                  >
                    <ZoomableGroup>
                      <Sphere stroke="#1e293b" strokeWidth={0.5} fill="#0f172a" />
                      <Graticule stroke="#334155" strokeWidth={0.3} />
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#1e293b"
                              stroke="#334155"
                              strokeWidth={0.5}
                            />
                          ))
                        }
                      </Geographies>
                      
                      {/* Trade Routes */}
                      {mapVisibility.showRoutes &&
                        snapshot.edges?.slice(0, 50).map((edge, idx) => {
                          const from = snapshot.nodes?.find((n) => n.id === edge.from);
                          const to = snapshot.nodes?.find((n) => n.id === edge.to);
                          if (!from || !to) return null;
                          
                          return (
                            <Line
                              key={`route-${idx}`}
                              from={[from.lng, from.lat]}
                              to={[to.lng, to.lat]}
                              stroke={edge.criticality > 0.7 ? "#f97316" : "#38bdf8"}
                              strokeWidth={edge.criticality * 2 + 0.5}
                              strokeOpacity={0.6}
                            />
                          );
                        })}

                      {/* Supply Chain Nodes */}
                      {snapshot.nodes?.map((node) => {
                        const totalRisk = (node.risk_operational + node.risk_financial + node.risk_policy) / 3;
                        const riskLevel = getRiskLevel(totalRisk);
                        const shouldShow = !mapVisibility.showCritical || totalRisk > 0.6;
                        
                        if (!shouldShow) return null;

                        return (
                          <Marker key={node.id} coordinates={[node.lng, node.lat]}>
                            <circle
                              r={Math.max(2, totalRisk * 8)}
                              fill={
                                riskLevel === "critical" ? "#ef4444" :
                                riskLevel === "high" ? "#f97316" :
                                riskLevel === "medium" ? "#eab308" : "#22c55e"
                              }
                              fillOpacity={0.8}
                              stroke="#ffffff"
                              strokeWidth={0.5}
                            />
                          </Marker>
                        );
                      })}

                      {/* Disruptions */}
                      {mapVisibility.showDisruptions &&
                        snapshot.disruptions?.map((disruption, idx) => (
                          <Marker key={`disruption-${idx}`} coordinates={disruption.location}>
                            <circle
                              r={4}
                              fill="#dc2626"
                              stroke="#fca5a5"
                              strokeWidth={1}
                              opacity={0.9}
                            />
                          </Marker>
                        ))}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
              )}
            </div>
          )}
        </div>

        {/* History Chart */}
        {history && (
          <div className="bg-terminal-card border border-terminal-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-terminal-text mb-6">
              Cascade History & Trends
            </h3>
            <CascadeHistoryChart data={history} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
