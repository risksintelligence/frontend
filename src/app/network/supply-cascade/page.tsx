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
        arcColor={(d: any) => d.color}
        arcDashLength={0.3}
        arcDashGap={0.9}
        arcDashAnimateTime={4000}
        pointsData={pointsData}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointAltitude={(d: any) => 0.02 + d.risk * 0.05}
        pointColor={(d: any) => (d.risk > 0.6 ? "#f87171" : d.risk > 0.4 ? "#fbbf24" : "#34d399")}
        pointRadius={0.8}
        enablePointerInteraction
      />
      <div className="absolute right-3 bottom-3 text-xs font-mono text-terminal-muted">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
const severityColor = (severity?: string) => {
  switch (severity?.toLowerCase()) {
    case "critical": return "#f97316";
    case "high": return "#facc15";
    case "medium": return "#22d3ee";
    default: return "#10b981";
  }
};

function SimpleMapSection({ data }: { data: CascadeSnapshotResponse }) {
  const [visibility, setVisibility] = useState<MapVisibility>({
    showRoutes: true,
    showCritical: true,
    showDisruptions: true,
  });
  const [position, setPosition] = useState<MapPosition>({ center: [0, 10], scale: 150 });
  const [mapMode, setMapMode] = useState<"globe" | "map">("globe");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string[]>(["critical", "high", "medium", "low"]);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const nodes = data.nodes?.filter((n) => {
      if (!term) return true;
      return (
        n.name.toLowerCase().includes(term) ||
        n.type.toLowerCase().includes(term) ||
        (n.region && n.region.toLowerCase().includes(term))
      );
    }) || [];
    const nodeIds = new Set(nodes.map((n) => n.id));

    const disruptions = data.disruptions?.filter((d) => {
      if (!severityFilter.includes((d.severity || "").toLowerCase())) return false;
      if (!term) return true;
      return (
        d.type.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.source.toLowerCase().includes(term)
      );
    }) || [];

    const edges = (data.edges || []).filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
    const critical_paths = (data.critical_paths || []).map((path) => path.filter((id) => nodeIds.has(id))).filter((p) => p.length >= 2);

    return { ...data, nodes, disruptions, edges, critical_paths };
  }, [data, searchTerm, severityFilter]);

  return (
    <>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-mono uppercase text-terminal-muted">Live Atlas</p>
          <h3 className="text-lg font-bold text-terminal-text">
            Real-World Supply Chain Network
          </h3>
          <p className="text-sm text-terminal-muted">
            Clean world map with animated risk nodes, trade flows, and disruptions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SimpleMapToggles visibility={visibility} onChange={setVisibility} />
          <RegionPills onFocus={setPosition} />
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
        </div>
      </div>
      <div className="terminal-card p-4">
        {mapMode === "globe" ? (
          <GlobeMap data={filteredData} visibility={visibility} />
        ) : (
          <RealWorldMap data={filteredData} visibility={visibility} position={position} onMove={setPosition} />
        )}
      </div>
      <MapFiltersInline
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        onReset={() => {
          setSearchTerm("");
          setSeverityFilter(["critical", "high", "medium", "low"]);
        }}
      />
    </>
  );
}

function SimpleMapToggles({
  visibility,
  onChange,
}: {
  visibility: MapVisibility;
  onChange: (next: MapVisibility) => void;
}) {
  const toggle = (key: keyof MapVisibility) =>
    onChange({ ...visibility, [key]: !visibility[key] });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {[
        { key: "showRoutes", label: "Trade Flows" },
        { key: "showCritical", label: "Critical Paths" },
        { key: "showDisruptions", label: "Disruptions" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => toggle(item.key as keyof MapVisibility)}
          className={`px-3 py-1.5 text-xs rounded border transition-colors font-mono ${
            visibility[item.key as keyof MapVisibility]
              ? "bg-terminal-accent/20 text-terminal-accent border-terminal-accent/40"
              : "bg-terminal-surface text-terminal-muted border-terminal-border"
          }`}
        >
          {visibility[item.key as keyof MapVisibility] ? "Hide" : "Show"} {item.label}
        </button>
      ))}
    </div>
  );
}

function RealWorldMap({
  data,
  visibility,
  position,
  onMove,
}: {
  data: CascadeSnapshotResponse;
  visibility: MapVisibility;
  position: MapPosition;
  onMove: (pos: MapPosition) => void;
}) {
  const [hoveredNode, setHoveredNode] = useState<SnapshotNode | null>(null);
  const [hoveredDisruption, setHoveredDisruption] = useState<SnapshotDisruption | null>(null);

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
    return edges.slice(0, 150).map((edge) => {
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
      <div className="absolute right-3 top-3 text-xs text-terminal-muted font-mono">
        Updated {new Date(data.as_of || Date.now()).toLocaleTimeString()}
      </div>
      <ComposableMap projection="geoNaturalEarth1" height={420} className="w-full">
        <ZoomableGroup
          center={position.center}
          zoom={position.scale / 150}
          onMoveEnd={({ coordinates, zoom }) =>
            onMove({ center: [coordinates[0], coordinates[1]], scale: zoom * 150 })
          }
        >
          <Sphere stroke="#0b1220" strokeWidth={0.6} fill="url(#oceanGradient)" />
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
            />
          ))}

          {criticalPaths.map((path) => (
            path.coords.length > 1 && (
              <Line
                key={path.id}
                from={path.coords[0]}
                to={path.coords[path.coords.length - 1]}
                stroke="#f97316"
                strokeWidth={2.4}
                strokeOpacity={0.8}
                strokeDasharray="4 3"
              />
            )
          ))}

          {visibility.showDisruptions &&
            data.disruptions?.map((d) => (
              <Marker
                key={d.id}
                coordinates={[d.location[1], d.location[0]]}
                onMouseEnter={() => setHoveredDisruption(d)}
                onMouseLeave={() => setHoveredDisruption(null)}
              >
                <g className="animate-pulse">
                  <circle r={4} fill={severityColor(d.severity)} opacity={0.85} />
                  <circle r={8} fill={severityColor(d.severity)} opacity={0.15} />
                </g>
              </Marker>
            ))}

          {nodes.map((node) => {
            const risk = (node.risk_operational + node.risk_financial + node.risk_policy) / 3;
            return (
              <Marker
                key={node.id}
                coordinates={[node.lng, node.lat]}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
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

      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-terminal-muted">
        <LegendSwatch color="#34d399" label="Low Risk Node" />
        <LegendSwatch color="#fbbf24" label="Medium Risk Node" />
        <LegendSwatch color="#f87171" label="High Risk Node" />
        <LegendSwatch color="#f97316" label="Critical Path" dashed />
      </div>

      {(hoveredNode || hoveredDisruption) && (
        <div className="mt-3 text-xs font-mono p-3 border border-terminal-border bg-terminal-surface rounded">
          {hoveredNode && (
            <div className="space-y-1">
              <p className="text-terminal-text font-semibold">Node: {hoveredNode.name}</p>
              <p className="text-terminal-muted capitalize">Type: {hoveredNode.type}</p>
              <p className="text-terminal-muted">
                Risk {Math.round(((hoveredNode.risk_operational + hoveredNode.risk_financial + hoveredNode.risk_policy) / 3) * 100)}%
              </p>
            </div>
          )}
          {hoveredDisruption && (
            <div className="space-y-1">
              <p className="text-terminal-text font-semibold">
                Disruption: {hoveredDisruption.type}
              </p>
              <p className="text-terminal-muted">Severity: {hoveredDisruption.severity}</p>
              <p className="text-terminal-muted line-clamp-2">{hoveredDisruption.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LegendSwatch({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-1 rounded-full"
        style={{ background: color, borderStyle: dashed ? "dashed" : "solid", borderWidth: dashed ? 1 : 0 }}
      />
      <span>{label}</span>
    </div>
  );
}

function RegionPills({
  onFocus,
}: {
  onFocus: (pos: MapPosition) => void;
}) {
  const presets: Record<string, MapPosition> = {
    World: { center: [0, 10], scale: 150 },
    Americas: { center: [-90, 10], scale: 220 },
    EMEA: { center: [15, 25], scale: 230 },
    APAC: { center: [110, 5], scale: 230 },
  };

  return (
    <div className="flex items-center gap-1 border border-terminal-border rounded-lg overflow-hidden">
      {Object.entries(presets).map(([label, pos]) => (
        <button
          key={label}
          onClick={() => onFocus(pos)}
          className="px-3 py-1.5 text-xs font-mono bg-terminal-surface hover:bg-terminal-bg transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MapFiltersInline({
  searchTerm,
  onSearch,
  severityFilter,
  onSeverityChange,
  onReset,
}: {
  searchTerm: string;
  onSearch: (term: string) => void;
  severityFilter: string[];
  onSeverityChange: (next: string[]) => void;
  onReset: () => void;
}) {
  const severities: string[] = ["critical", "high", "medium", "low"];
  const toggleSeverity = (sev: string) => {
    if (severityFilter.includes(sev)) {
      onSeverityChange(severityFilter.filter((s) => s !== sev));
    } else {
      onSeverityChange([...severityFilter, sev]);
    }
  };

  return (
    <div className="mt-4 terminal-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-mono uppercase text-terminal-muted">Filters</p>
          <p className="text-sm text-terminal-text font-semibold">Search & Focus</p>
        </div>
        <Button size="sm" variant="outline" onClick={onReset} className="font-mono text-xs">
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search nodes or disruptions..."
            className="w-full px-3 py-2 rounded border border-terminal-border bg-terminal-bg text-terminal-text text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {severities.map((sev) => (
            <button
              key={sev}
              onClick={() => toggleSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                severityFilter.includes(sev)
                  ? "bg-terminal-accent/20 text-terminal-accent border-terminal-accent/40"
                  : "bg-terminal-surface text-terminal-muted border-terminal-border"
              }`}
            >
              {sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataQualityStrip({ data }: { data: CascadeSnapshotResponse }) {
  const meta = data.metadata || {};
  const totals = {
    nodes: meta.total_nodes ?? data.nodes?.length ?? 0,
    edges: meta.total_edges ?? data.edges?.length ?? 0,
    disruptions: meta.active_disruptions ?? data.disruptions?.length ?? 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="terminal-card p-3 space-y-1">
        <p className="text-xs text-terminal-muted font-mono uppercase">Coverage</p>
        <p className="text-sm text-terminal-text font-mono">
          {totals.nodes} nodes • {totals.edges} routes
        </p>
      </div>
      <div className="terminal-card p-3 space-y-1">
        <p className="text-xs text-terminal-muted font-mono uppercase">Active Disruptions</p>
        <p className="text-sm text-terminal-text font-mono">{totals.disruptions}</p>
      </div>
      <div className="terminal-card p-3 space-y-1">
        <p className="text-xs text-terminal-muted font-mono uppercase">Refresh</p>
        <p className="text-sm text-terminal-text font-mono">
          {(meta.refresh_interval_seconds ?? 30)}s interval
        </p>
      </div>
      <div className="terminal-card p-3 space-y-1">
        <p className="text-xs text-terminal-muted font-mono uppercase">Sources</p>
        <p className="text-xs text-terminal-text font-mono">
          {(meta.data_sources || ["ACLED", "UN Comtrade", "MarineTraffic"]).join(", ")}
        </p>
      </div>
    </div>
  );
}

function CommodityImpactTable({
  commodities,
}: {
  commodities: Record<string, { delta_pct: number; disruption_count?: number; reason?: string }>;
}) {
  const rows = useMemo(
    () =>
      Object.entries(commodities || {}).sort((a, b) => (b[1].delta_pct || 0) - (a[1].delta_pct || 0)),
    [commodities]
  );

  return (
    <div className="overflow-hidden border border-terminal-border rounded-lg">
      <div className="grid grid-cols-4 bg-terminal-surface text-xs font-mono text-terminal-muted px-3 py-2">
        <span>Commodity</span>
        <span>Delta %</span>
        <span>Disruptions</span>
        <span>Reason</span>
      </div>
      <div className="divide-y divide-terminal-border">
        {rows.map(([name, data]) => (
          <div key={name} className="grid grid-cols-4 px-3 py-2 text-xs items-center">
            <span className="font-mono text-terminal-text capitalize">{name.replace(/_/g, " ")}</span>
            <span className={`font-mono ${data.delta_pct > 0 ? "text-terminal-red" : "text-terminal-green"}`}>
              {data.delta_pct > 0 ? "+" : ""}
              {data.delta_pct}%
            </span>
            <span className="font-mono text-terminal-text">{data.disruption_count ?? 0}</span>
            <span className="text-terminal-muted line-clamp-2">{data.reason || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCriticalPaths({ data }: { data: CascadeSnapshotResponse }) {
  const nodesById = useMemo(() => {
    const map = new Map<string, SnapshotNode>();
    (data.nodes || []).forEach((n) => map.set(n.id, n));
    return map;
  }, [data.nodes]);

  const paths = useMemo(() => {
    return (data.critical_paths || []).slice(0, 3).map((path, idx) => {
      const nodeObjs = path.map((id) => nodesById.get(id)).filter(Boolean) as SnapshotNode[];
      const avgRisk =
        nodeObjs.reduce((sum, n) => sum + (n.risk_operational + n.risk_financial + n.risk_policy) / 3, 0) /
        (nodeObjs.length || 1);
      return { id: idx, avgRisk, names: nodeObjs.map((n) => n.name) };
    });
  }, [data.critical_paths, nodesById]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
        Critical Paths Snapshot
      </h4>
      <div className="space-y-2">
        {paths.map((p) => (
          <div key={p.id} className="terminal-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-terminal-muted">Path {p.id + 1}</span>
              <StatusBadge variant={p.avgRisk > 0.7 ? "critical" : p.avgRisk > 0.4 ? "warning" : "good"}>
                {Math.round(p.avgRisk * 100)}% risk
              </StatusBadge>
            </div>
            <p className="text-sm text-terminal-text font-mono">{p.names.join(" → ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupplyCascadePage() {
  const [refreshing, setRefreshing] = useState(false);

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
    data: impactData,
    isLoading: impactLoading,
    error: impactError,
    refetch: refetchImpacts
  } = useQuery({
    queryKey: ["cascade-impacts"],
    queryFn: getCascadeImpacts,
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

  const isLoading = cascadeLoading || impactLoading || historyLoading;
  const error = cascadeError || impactError || historyError;

  // Real-time updates hook
  const {
    status: refreshServiceStatus,
    connectionStatus,
    lastUpdate,
    forceRefresh,
    refreshStatus
  } = useRealTimeUpdates({
    dataSources: ['supply_cascade', 'cascade_impacts'],
    autoRefresh: true,
    refreshInterval: 30000,
    onUpdate: (update) => {
      console.log('Real-time update received:', update);
      if (update.change_detected) {
        refetchAll();
      }
    },
    onError: (error) => {
      console.error('Real-time update error:', error);
    }
  });

  const refetchAll = () => {
    refetchCascade();
    refetchImpacts();
    refetchHistory();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setRefreshing(false);
  };

  const getRiskColor = (risk: number) => getRiskTextColor(risk * 100);
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "critical";
      case "high": return "warning"; 
      case "medium": return "warning";
      default: return "good";
    }
  };

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Supply Chain Intelligence
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Cascade Analysis & Disruption Monitoring
          </h1>
          <p className="text-sm text-terminal-muted">
            Real-time supply chain disruption monitoring and cascade impact assessment.
          </p>
        </header>

        <PagePrimer
          kicker="Primer"
          title="Supply Chain Cascade Intelligence"
          description="Advanced cascade modeling with real-time disruption monitoring, world map visualization, and predictive impact analysis."
          expandable={true}
          showDataFlow={true}
          items={[
            {
              title: "Data Sources",
              content: "Global trade flows, geopolitical events, port congestion, weather disruptions.",
              tooltip: "Real-time disruption feeds from multiple intelligence sources",
              expandedContent: "UN Comtrade global trade statistics, ACLED geopolitical event monitoring, MarineTraffic port congestion data, weather intelligence feeds, supply chain topology mapping from graph analysis. Data fusion occurs in real-time with 30-second refresh cycles."
            },
            {
              title: "Cascade Modeling", 
              content: "Network topology analysis, failure propagation simulation, impact scoring.",
              tooltip: "Advanced graph algorithms for cascade prediction and impact assessment",
              expandedContent: "Monte Carlo simulation for failure propagation modeling, graph centrality analysis for critical node identification, weighted impact scoring using economic and operational factors, cascade timeline prediction with confidence intervals."
            },
            {
              title: "Impact Analysis",
              content: "Economic impact quantification, commodity price effects, policy implications.",
              tooltip: "Professional-grade impact assessment with institutional metrics",
              expandedContent: "Real-time economic impact calculation in USD, commodity price volatility analysis, policy risk assessment, lead time impact modeling across industry sectors, trade route disruption analysis with alternative routing recommendations."
            }
          ]}
          dataFlowNodes={[
            {
              id: "disruption-feeds",
              label: "Disruption Feeds",
              type: "source",
              status: "active",
              latency: "< 45s",
              quality: 95,
              description: "Multi-source disruption intelligence",
              endpoint: "/api/v1/intel/disruptions"
            },
            {
              id: "cascade-engine",
              label: "Cascade Engine", 
              type: "model",
              status: "active",
              latency: "< 3s",
              quality: 92,
              description: "Network cascade simulation and modeling"
            },
            {
              id: "impact-calculator",
              label: "Impact Calculator",
              type: "model", 
              status: "active",
              latency: "< 2s",
              quality: 94,
              description: "Economic and operational impact quantification"
            },
            {
              id: "world-map-viz",
              label: "World Map Viz",
              type: "output",
              status: "active", 
              latency: "< 500ms",
              quality: 97,
              description: "Interactive cascade visualization"
            }
          ]}
          dataFlowConnections={[
            { from: "disruption-feeds", to: "cascade-engine", type: "real-time", volume: "~150 events/min" },
            { from: "cascade-engine", to: "impact-calculator", type: "real-time", volume: "~100 updates/min" },
            { from: "impact-calculator", to: "world-map-viz", type: "real-time" },
            { from: "cascade-engine", to: "world-map-viz", type: "real-time" }
          ]}
        />

        {/* Status and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi className="w-4 h-4 text-terminal-green" />
                  <span className="text-xs font-mono text-terminal-green">LIVE</span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <RotateCcw className="w-4 h-4 text-terminal-orange animate-spin" />
                  <span className="text-xs font-mono text-terminal-orange">CONNECTING</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-terminal-red" />
                  <span className="text-xs font-mono text-terminal-red">OFFLINE</span>
                </>
              )}
            </div>
            {cascadeData && (
              <span className="text-xs font-mono text-terminal-muted">
                Last updated: {new Date(cascadeData.as_of).toLocaleString()}
              </span>
            )}
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing || isLoading}
            size="sm"
            variant="outline"
            className="font-mono text-xs"
          >
            <Clock className="w-4 h-4 mr-1" />
            {refreshing ? "Refreshing..." : "Refresh Data"}
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
                Error loading cascade data: {error?.message || 'Unknown error'}
              </p>
              <Button onClick={handleRefresh} size="sm" variant="outline">
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Overview */}
            {impactData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Economic Impact"
                  value={(impactData.financial.total_disruption_impact_usd / 1_000_000).toFixed(1)}
                  unit="M USD"
                  change={0}
                  status="amber"
                  updatedAt={cascadeData?.as_of || new Date().toISOString()}
                  icon={<DollarSign className="h-5 w-5" />}
                />

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Active Disruptions</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {impactData.financial.active_disruptions}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Live geo/policy events
                  </p>
                </div>

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Supply Capacity</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {(impactData.industry.capacity.global_supply_chain * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Global chain capacity
                  </p>
                </div>

                <div className="terminal-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-terminal-muted" />
                    <span className="text-xs uppercase tracking-wide text-terminal-muted font-mono">Policy Risk</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-terminal-text">
                    {(impactData.policy.overall_policy_risk * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Risk scoring
                  </p>
                </div>
              </div>
            )}

            {/* Interactive World Map */}
            {cascadeData && (
              <div className="space-y-3">
                <SimpleMapSection data={cascadeData} />
                <DataQualityStrip data={cascadeData} />
              </div>
            )}

            {/* Detailed Analysis Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Disruptions */}
              {cascadeData && cascadeData.disruptions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                    Active Disruptions ({cascadeData.disruptions.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cascadeData.disruptions.slice(0, 10).map((disruption) => (
                    <div key={disruption.id} className="terminal-card p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <StatusBadge variant={getSeverityBadge(disruption.severity)}>
                          {disruption.severity?.toUpperCase()}
                        </StatusBadge>
                        <span className="text-xs font-mono text-terminal-muted">{disruption.source}</span>
                      </div>
                      <p className="text-sm text-terminal-text">{disruption.description}</p>
                      {disruption.economic_impact_usd && (
                        <p className="text-xs font-mono text-terminal-green">
                          Impact: ${(disruption.economic_impact_usd / 1_000_000).toFixed(1)}M
                        </p>
                      )}
                      {typeof disruption.vessels_impacted === "number" && (
                        <p className="text-xs font-mono text-terminal-muted">
                          Vessels impacted: {disruption.vessels_impacted}
                        </p>
                      )}
                      {disruption.affected_commodities && disruption.affected_commodities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {disruption.affected_commodities.slice(0, 3).map((commodity) => (
                            <span key={commodity} className="inline-block text-xs font-mono bg-terminal-surface px-2 py-1 rounded">
                              {commodity}
                            </span>
                          ))}
                        </div>
                      )}
                      {disruption.affected_trade_routes && disruption.affected_trade_routes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {disruption.affected_trade_routes.slice(0, 3).map((route) => (
                            <span key={route} className="inline-block text-xs font-mono bg-terminal-accent/10 text-terminal-accent px-2 py-1 rounded">
                              {route}
                            </span>
                          ))}
                        </div>
                      )}
                      {disruption.mitigation_strategies && disruption.mitigation_strategies.length > 0 && (
                        <p className="text-xs font-mono text-terminal-muted">
                          Mitigations: {disruption.mitigation_strategies.length}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

              {/* Commodity Impact Analysis */}
              {impactData && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                    Commodity Price Impacts
                  </h4>
                  <CommodityImpactTable commodities={impactData.financial.commodities} />
                </div>
              )}

              {/* Policy & Trade Route Risk */}
              {impactData && impactData.policy?.trade_routes && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                    Trade Route Risk
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(impactData.policy.trade_routes).map(([route, stats]) => (
                      <div key={route} className="terminal-card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-terminal-text capitalize">
                            {route.replace('_', ' ')}
                          </span>
                          <StatusBadge variant={stats.risk_score > 0.6 ? "critical" : stats.risk_score > 0.4 ? "warning" : "good"}>
                            {Math.round((stats.risk_score || 0) * 100)}%
                          </StatusBadge>
                        </div>
                        <p className="text-xs text-terminal-muted font-mono">
                          Disruptions: {stats.disruption_count ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Paths (summary) */}
              {cascadeData && cascadeData.critical_paths?.length > 0 && (
                <TopCriticalPaths data={cascadeData} />
              )}

            </div>

            {/* History Chart */}
            {historyData && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-terminal-text font-mono uppercase">
                  Cascade Historical Analysis
                </h4>
                <CascadeHistoryChart history={historyData} />
              </div>
            )}
          </>
        )}
      </main>
    </MainLayout>
  );
}
