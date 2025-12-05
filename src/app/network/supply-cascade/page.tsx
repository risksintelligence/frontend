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
