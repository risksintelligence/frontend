"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  Line,
  Sphere,
  Graticule
} from "react-simple-maps";
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Ship, 
  Zap,
  Filter,
  RotateCcw,
  Maximize2,
  Play,
  Pause,
  Search,
  X,
  SlidersHorizontal,
  Download,
  Monitor
} from 'lucide-react';

// Real world geography data URL
const geoUrl = "https://unpkg.com/world-atlas@3.0.0/world/110m.json";

// Type definitions for our supply chain data
interface SupplyChainNode {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  risk_operational: number;
  risk_financial: number;
  risk_policy: number;
  industry_impacts: Record<string, number>;
}

interface SupplyChainEdge {
  from: string;
  to: string;
  mode: string;
  flow: number;
  congestion: number;
  eta_delay_hours: number;
  criticality: number;
  trade_value_usd?: number;
}

interface SupplyChainDisruption {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: [number, number];
  description: string;
  source: string;
  economic_impact_usd?: number;
  affected_commodities?: string[];
  affected_trade_routes?: string[];
  vessels_impacted?: number;
  mitigation_strategies?: string[];
}

interface SupplyChainData {
  as_of: string;
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  critical_paths: string[][];
  disruptions: SupplyChainDisruption[];
}

interface MapFilters {
  showNodes: boolean;
  showEdges: boolean;
  showDisruptions: boolean;
  showCriticalPaths: boolean;
  showAnimation: boolean;
  severityFilter: string[];
  sourceFilter: string[];
  minTradeValue: number;
  nodeTypeFilter: string[];
  searchQuery: string;
  riskLevelFilter: string[];
  geographicFilter: string;
  timeRangeFilter: string;
}

interface FlowParticle {
  id: string;
  edgeIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

interface SupplyChainWorldMapProps {
  data: SupplyChainData;
  className?: string;
}

const SEVERITY_COLORS = {
  low: '#22c55e',      // green-500
  medium: '#f59e0b',   // amber-500  
  high: '#ef4444',     // red-500
  critical: '#dc2626'  // red-600
};

// Removed RISK_COLORS - now using enhanced risk colors in component

export default function SupplyChainWorldMap({ data, className = "" }: SupplyChainWorldMapProps) {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [selectedDisruption, setSelectedDisruption] = useState<SupplyChainDisruption | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30, 0]); // World center
  const [zoomLevel, setZoomLevel] = useState(2);
  const [targetZoom, setTargetZoom] = useState(2);
  const [targetCenter, setTargetCenter] = useState<[number, number]>([30, 0]);
  const [flowParticles, setFlowParticles] = useState<FlowParticle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<[number, number] | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SupplyChainNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const smoothAnimationRef = useRef<number>(0);
  const [filters, setFilters] = useState<MapFilters>({
    showNodes: true,
    showEdges: true,
    showDisruptions: true,
    showCriticalPaths: true,
    showAnimation: true,
    severityFilter: ['low', 'medium', 'high', 'critical'],
    sourceFilter: ['ACLED', 'MarineTraffic', 'UN_Comtrade'],
    minTradeValue: 0,
    nodeTypeFilter: ['port', 'manufacturer', 'supplier', 'distributor', 'retailer'],
    searchQuery: '',
    riskLevelFilter: ['low', 'medium', 'high', 'critical'],
    geographicFilter: 'all',
    timeRangeFilter: 'all'
  });

  const [contextLayers, setContextLayers] = useState({
    showWeather: false,
    showPoliticalBoundaries: false,
    showOceanCurrents: false,
    showShippingLanes: false
  });

  const [performanceMode, setPerformanceMode] = useState<'svg' | 'canvas'>('svg');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);

  // Note: SVG projection functions removed - now using React Simple Maps projections

  // Calculate risk level from risk scores
  const calculateRiskLevel = (operational: number, financial: number, policy: number): string => {
    const avgRisk = (operational + financial + policy) / 3;
    if (avgRisk >= 0.8) return 'critical';
    if (avgRisk >= 0.6) return 'high';
    if (avgRisk >= 0.3) return 'medium';
    return 'low';
  };

  // Enhanced filtering with search functionality
  const filteredData = useMemo(() => {
    // Filter nodes
    const filteredNodes = data.nodes.filter(node => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = node.name.toLowerCase().includes(query);
        const matchesType = node.type.toLowerCase().includes(query);
        const matchesId = node.id.toLowerCase().includes(query);
        if (!matchesName && !matchesType && !matchesId) return false;
      }

      // Node type filter
      if (!filters.nodeTypeFilter.includes(node.type)) return false;

      // Risk level filter
      const riskLevel = calculateRiskLevel(node.risk_operational, node.risk_financial, node.risk_policy);
      if (!filters.riskLevelFilter.includes(riskLevel)) return false;

      // Geographic filter
      if (filters.geographicFilter !== 'all') {
        const region = getGeographicRegion(node.lat, node.lng);
        if (region !== filters.geographicFilter) return false;
      }

      return true;
    });

    // Filter disruptions
    const filteredDisruptions = data.disruptions.filter(disruption => {
      // Existing filters
      if (!filters.severityFilter.includes(disruption.severity)) return false;
      if (!filters.sourceFilter.some(source => disruption.source.includes(source))) return false;

      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesType = disruption.type.toLowerCase().includes(query);
        const matchesDescription = disruption.description.toLowerCase().includes(query);
        const matchesSource = disruption.source.toLowerCase().includes(query);
        if (!matchesType && !matchesDescription && !matchesSource) return false;
      }

      // Geographic filter
      if (filters.geographicFilter !== 'all') {
        const region = getGeographicRegion(disruption.location[0], disruption.location[1]);
        if (region !== filters.geographicFilter) return false;
      }

      return true;
    });

    // Filter edges
    const filteredEdges = data.edges.filter(edge => {
      // Existing trade value filter
      if ((edge.trade_value_usd || 0) < filters.minTradeValue) return false;

      // Only show edges between filtered nodes
      const fromNodeExists = filteredNodes.some(n => n.id === edge.from);
      const toNodeExists = filteredNodes.some(n => n.id === edge.to);
      if (!fromNodeExists || !toNodeExists) return false;

      return true;
    });

    return {
      ...data,
      nodes: filteredNodes,
      disruptions: filteredDisruptions,
      edges: filteredEdges
    };
  }, [data, filters]);

  // Helper function to determine geographic region
  const getGeographicRegion = (lat: number, lng: number): string => {
    // North America
    if (lat >= 15 && lat <= 80 && lng >= -170 && lng <= -30) return 'north_america';
    // Europe
    if (lat >= 35 && lat <= 75 && lng >= -15 && lng <= 40) return 'europe';
    // Asia
    if (lat >= -10 && lat <= 80 && lng >= 40 && lng <= 180) return 'asia';
    // Africa
    if (lat >= -35 && lat <= 40 && lng >= -20 && lng <= 60) return 'africa';
    // South America
    if (lat >= -60 && lat <= 15 && lng >= -90 && lng <= -30) return 'south_america';
    // Oceania
    if (lat >= -50 && lat <= -5 && lng >= 110 && lng <= 180) return 'oceania';
    return 'other';
  };

  // Smooth zoom and pan animation
  const smoothTransition = useCallback(() => {
    const step = () => {
      const zoomDiff = targetZoom - zoomLevel;
      const centerDiffLat = targetCenter[0] - mapCenter[0];
      const centerDiffLng = targetCenter[1] - mapCenter[1];
      
      // Smooth interpolation with easing
      const easing = 0.1;
      const threshold = 0.01;
      
      if (Math.abs(zoomDiff) > threshold || Math.abs(centerDiffLat) > threshold || Math.abs(centerDiffLng) > threshold) {
        setZoomLevel(prev => prev + zoomDiff * easing);
        setMapCenter(prev => [
          prev[0] + centerDiffLat * easing,
          prev[1] + centerDiffLng * easing
        ]);
        smoothAnimationRef.current = requestAnimationFrame(step);
      }
    };
    step();
  }, [targetZoom, targetCenter, zoomLevel, mapCenter]);

  // Handle smooth zoom
  const handleSmoothZoom = useCallback((newZoom: number, centerLat?: number, centerLng?: number) => {
    setTargetZoom(Math.max(1, Math.min(10, newZoom)));
    if (centerLat !== undefined && centerLng !== undefined) {
      setTargetCenter([centerLat, centerLng]);
    }
  }, []);

  // Handle node click with smooth transition
  const handleNodeClick = (node: SupplyChainNode) => {
    setSelectedNode(node);
    setSelectedDisruption(null);
    setHoveredNode(null);
    handleSmoothZoom(5, node.lat, node.lng);
  };

  // Handle mouse wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.5 : 0.5;
    handleSmoothZoom(targetZoom + delta);
  }, [targetZoom, handleSmoothZoom]);

  // Handle mouse pan
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsPanning(true);
    setLastPanPoint([event.clientX, event.clientY]);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isPanning && lastPanPoint) {
      const dx = event.clientX - lastPanPoint[0];
      const dy = event.clientY - lastPanPoint[1];
      
      // Convert screen movement to map coordinates
      const sensitivity = 0.5 / zoomLevel;
      const newCenterLat = targetCenter[0] - dy * sensitivity;
      const newCenterLng = targetCenter[1] + dx * sensitivity;
      
      // Constrain to world bounds
      const constrainedLat = Math.max(-85, Math.min(85, newCenterLat));
      const constrainedLng = Math.max(-180, Math.min(180, newCenterLng));
      
      setTargetCenter([constrainedLat, constrainedLng]);
      setLastPanPoint([event.clientX, event.clientY]);
    }
  }, [isPanning, lastPanPoint, zoomLevel, targetCenter]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback((node: SupplyChainNode | null) => {
    setHoveredNode(node);
  }, []);


  // Initialize flow particles
  const initializeFlowParticles = useCallback(() => {
    const particles: FlowParticle[] = [];
    
    filteredData.edges.forEach((edge, edgeIndex) => {
      const particleCount = Math.max(1, Math.floor(edge.flow * 5)); // More particles for higher flow
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: `particle-${edgeIndex}-${i}`,
          edgeIndex,
          progress: Math.random(), // Random starting position
          speed: 0.005 + (edge.flow * 0.01), // Speed based on flow rate
          size: 2 + (edge.criticality * 3), // Size based on criticality
          color: edge.congestion > 0.6 ? SEVERITY_COLORS.high : '#60a5fa'
        });
      }
    });
    
    setFlowParticles(particles);
  }, [filteredData.edges]);

  // Animation loop for flow particles
  const animateFlowParticles = useCallback(() => {
    const step = () => {
      if (!isAnimating || !filters.showAnimation) return;
      
      setFlowParticles(prevParticles => 
        prevParticles.map(particle => {
          const newProgress = particle.progress + particle.speed;
          return {
            ...particle,
            progress: newProgress > 1 ? 0 : newProgress // Reset to start when reaching end
          };
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(step);
    };
    step();
  }, [isAnimating, filters.showAnimation]);

  // Start smooth transitions when targets change
  useEffect(() => {
    smoothTransition();
    return () => {
      if (smoothAnimationRef.current) {
        cancelAnimationFrame(smoothAnimationRef.current);
      }
    };
  }, [smoothTransition]);

  // Initialize particles when data changes
  useEffect(() => {
    requestAnimationFrame(() => initializeFlowParticles());
  }, [initializeFlowParticles]);

  // Start/stop animation
  useEffect(() => {
    if (isAnimating && filters.showAnimation) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      animationFrameRef.current = requestAnimationFrame(animateFlowParticles);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, filters.showAnimation, animateFlowParticles]);

  const handleDisruptionClick = (disruption: SupplyChainDisruption) => {
    setSelectedDisruption(disruption);
    setSelectedNode(null);
    const [lat, lng] = disruption.location;
    setMapCenter([lat, lng]);
    setZoomLevel(5);
  };

  // Reset map view with smooth transition
  const resetMapView = () => {
    setTargetCenter([30, 0]);
    setTargetZoom(2);
    setSelectedNode(null);
    setSelectedDisruption(null);
    setHoveredNode(null);
  };

  // Format trade value (for optional values)
  const formatTradeValueOptional = (value?: number): string => {
    if (!value) return 'N/A';
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
    } else if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Export functionality
  const exportMapAsImage = useCallback(async (format: 'png' | 'svg') => {
    const svgElement = document.querySelector('#supply-chain-map svg') as SVGElement;
    if (!svgElement) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-map-${new Date().toISOString().split('T')[0]}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 1920;
      canvas.height = 960;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `supply-chain-map-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
            URL.revokeObjectURL(downloadUrl);
          }
        });
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
  }, []);

  // Export data as JSON/CSV
  const exportData = useCallback((format: 'json' | 'csv') => {
    const exportData = {
      timestamp: new Date().toISOString(),
      nodes: filteredData.nodes,
      edges: filteredData.edges,
      disruptions: filteredData.disruptions,
      filters: filters
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Convert to CSV
      const csvRows = [];
      csvRows.push('Type,ID,Name,Latitude,Longitude,Risk_Operational,Risk_Financial,Risk_Policy');
      
      filteredData.nodes.forEach(node => {
        csvRows.push(`Node,${node.id},${node.name},${node.lat},${node.lng},${node.risk_operational},${node.risk_financial},${node.risk_policy}`);
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-data-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [filteredData, filters]);

  // Performance optimization: automatically switch to canvas for large datasets
  useEffect(() => {
    const totalElements = filteredData.nodes.length + filteredData.edges.length + filteredData.disruptions.length;
    if (totalElements > 500 && performanceMode === 'svg') {
      setPerformanceMode('canvas');
    }
  }, [filteredData, performanceMode]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    const mapContainer = document.querySelector('#supply-chain-map') as HTMLElement;
    if (!mapContainer) return;

    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  return (
    <div 
      id="supply-chain-map"
      className={`relative bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 border border-slate-700/50 rounded-xl shadow-2xl ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Bloomberg-style Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-blue-800/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Global Supply Chain Intelligence
            </h3>
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Real-time network analysis • {data.nodes.length} nodes • {data.edges.length} trade routes
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetMapView}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 border ${
                isAnimating 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' 
                  : 'bg-slate-700/80 text-slate-200 border-slate-600/50 hover:bg-slate-600/80'
              }`}
            >
              {isAnimating ? '⏸' : '▶'} {isAnimating ? 'Live' : 'Paused'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50">
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </button>
          </div>
        </div>
      </div>

      {/* Main content area with proper spacing */}
      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Map Visualization - Takes most of the space */}
          <div className="xl:col-span-4">
            <div className="bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-xl">
              <div className="bg-terminal-surface/50 border-b border-terminal-border p-6">
                <h3 className="text-2xl font-bold text-terminal-text flex items-center gap-3">
                  🌍 GLOBAL SUPPLY CHAIN RISK MAP
                  <span className="text-sm font-normal text-terminal-muted">
                    Real-time visualization with {filteredData.nodes.length} nodes
                  </span>
                </h3>
              </div>
              
              <div className="relative" style={{ height: '700px' }}>
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{
              scale: 150,
              center: [0, 0]
            }}
            width={1000}
            height={500}
            className="w-full h-full"
          >
            {/* Ocean sphere background */}
            <Sphere 
              id="ocean-sphere"
              stroke="#1e40af" 
              strokeWidth={0.5} 
              fill="#0ea5e9"
              fillOpacity={0.2}
            />
            
            {/* Graticule (lat/lng grid) */}
            <Graticule 
              stroke="#64748b" 
              strokeWidth={0.3} 
              strokeOpacity={0.3}
            />
            
            {/* Real world countries using Natural Earth data */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth={0.5}
                    style={{
                      default: { 
                        fill: "#10b981",
                        stroke: "#059669",
                        strokeWidth: 0.5,
                        outline: "none" 
                      },
                      hover: { 
                        fill: "#065f46",
                        stroke: "#064e3b",
                        strokeWidth: 0.7,
                        outline: "none" 
                      },
                      pressed: { 
                        fill: "#064e3b",
                        stroke: "#022c22",
                        strokeWidth: 0.7,
                        outline: "none" 
                      }
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Political Boundaries */}
            {contextLayers.showPoliticalBoundaries && (
              <g className="political-boundaries opacity-40">
                {/* Major political boundaries as lines */}
                <g stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" fill="none">
                  {/* US-Canada border */}
                  <line x1="80" y1="140" x2="220" y2="130" />
                  {/* US-Mexico border */}
                  <line x1="140" y1="200" x2="200" y2="195" />
                  {/* European borders (simplified) */}
                  <line x1="450" y1="140" x2="480" y2="145" />
                  <line x1="480" y1="145" x2="500" y2="150" />
                  {/* China-India border */}
                  <line x1="650" y1="180" x2="680" y2="200" />
                </g>
              </g>
            )}

            {/* Weather Layer */}
            {contextLayers.showWeather && (
              <g className="weather-layer opacity-30">
                {/* Storm systems */}
                <g>
                  {/* Hurricane in Atlantic */}
                  <circle cx="300" cy="200" r="25" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7">
                    <animate attributeName="r" values="20;35;20" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="200" r="15" fill="#dc2626" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Monsoon over Southeast Asia */}
                  <ellipse cx="750" cy="220" rx="60" ry="30" fill="#3b82f6" opacity="0.2" />
                  <ellipse cx="750" cy="220" rx="40" ry="20" fill="#2563eb" opacity="0.3" />
                </g>
              </g>
            )}

            {/* Ocean Currents */}
            {contextLayers.showOceanCurrents && (
              <g className="ocean-currents opacity-40">
                <g stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="10,5">
                  {/* Gulf Stream */}
                  <path d="M 200 200 Q 300 180 400 160" />
                  {/* Kuroshio Current */}
                  <path d="M 860 250 Q 820 220 780 200" />
                  {/* Antarctic Circumpolar Current */}
                  <path d="M 100 450 Q 500 430 900 450" />
                </g>
              </g>
            )}

            {/* Major Shipping Lanes */}
            {contextLayers.showShippingLanes && (
              <g className="shipping-lanes opacity-30">
                <g stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3" fill="none">
                  {/* Trans-Pacific Route */}
                  <path d="M 150 180 Q 500 160 850 200" />
                  {/* Trans-Atlantic Route */}
                  <path d="M 220 170 Q 350 160 450 150" />
                  {/* Suez Canal Route */}
                  <path d="M 520 220 Q 600 200 700 180" />
                  {/* Panama Canal Route */}
                  <path d="M 200 240 Q 250 220 300 200" />
                </g>
              </g>
            )}
            
            {/* Graticule (lat/lng grid lines) */}
            <g className="opacity-10 stroke-gray-400 fill-none stroke-0.25">
              {/* Longitude lines */}
              {Array.from({length: 9}, (_, i) => (
                <line key={`lng-${i}`} x1={i * 125} y1={0} x2={i * 125} y2={500} />
              ))}
              {/* Latitude lines */}
              {Array.from({length: 5}, (_, i) => (
                <line key={`lat-${i}`} x1={0} y1={i * 125} x2={1000} y2={i * 125} />
              ))}
            </g>

            {/* Supply Chain Trade Routes with React Simple Maps */}
            {filters.showEdges && filteredData.edges.map((edge, index) => {
              const fromNode = data.nodes.find(n => n.id === edge.from);
              const toNode = data.nodes.find(n => n.id === edge.to);
              
              if (!fromNode || !toNode) return null;
              
              const strokeWidth = Math.max(1, edge.flow * 4);
              const opacity = 0.4 + (edge.criticality * 0.6);
              
              const getRouteColor = () => {
                if (edge.congestion > 0.7) return '#ef4444';
                if (edge.congestion > 0.4) return '#f59e0b';
                if (edge.criticality > 0.6) return '#3b82f6';
                return '#10b981';
              };
              
              return (
                <Line
                  key={`edge-${index}`}
                  from={[fromNode.lng, fromNode.lat]}
                  to={[toNode.lng, toNode.lat]}
                  stroke={getRouteColor()}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                  strokeDasharray={edge.congestion > 0.5 ? "5,3" : "none"}
                />
              );
            })}

            {/* Note: Animation particles removed for React Simple Maps implementation */}

            {/* Critical paths with React Simple Maps */}
            {filters.showCriticalPaths && data.critical_paths.map((path, pathIndex) => (
              path.slice(0, -1).map((nodeId, index) => {
                const currentNode = data.nodes.find(n => n.id === nodeId);
                const nextNode = data.nodes.find(n => n.id === path[index + 1]);
                
                if (!currentNode || !nextNode) return null;
                
                return (
                  <Line
                    key={`critical-${pathIndex}-${index}`}
                    from={[currentNode.lng, currentNode.lat]}
                    to={[nextNode.lng, nextNode.lat]}
                    stroke="#fbbf24"
                    strokeWidth={3}
                    strokeOpacity={0.7}
                    strokeDasharray="10,5"
                  />
                );
              })
            ))}

            {/* Supply Chain Nodes with React Simple Maps */}
            {filters.showNodes && filteredData.nodes.map((node) => {
              const riskLevel = calculateRiskLevel(node.risk_operational, node.risk_financial, node.risk_policy);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              
              const riskColors = {
                low: { primary: '#10b981', secondary: '#6ee7b7' },
                medium: { primary: '#f59e0b', secondary: '#fcd34d' },
                high: { primary: '#ef4444', secondary: '#f87171' },
                critical: { primary: '#dc2626', secondary: '#ef4444' }
              };
              
              const colors = riskColors[riskLevel as keyof typeof riskColors];
              const size = isSelected ? 8 : isHovered ? 6 : 5;
              
              return (
                <Marker 
                  key={node.id} 
                  coordinates={[node.lng, node.lat]}
                  onClick={() => handleNodeClick(node)}
                >
                  <circle
                    r={size}
                    fill={colors.primary}
                    stroke={isSelected ? '#fbbf24' : colors.secondary}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isSelected ? 1 : 0.9}
                    className="transition-all duration-200"
                  />
                  <circle
                    r={size * 0.4}
                    fill="rgba(255, 255, 255, 0.4)"
                    cx={-size * 0.2}
                    cy={-size * 0.2}
                  />
                </Marker>
              );
            })}

            {/* Disruption Markers with React Simple Maps */}
            {filters.showDisruptions && filteredData.disruptions.map((disruption) => (
              <Marker 
                key={disruption.id} 
                coordinates={[disruption.location[1], disruption.location[0]]}
                onClick={() => handleDisruptionClick(disruption)}
              >
                <polygon
                  points="0,-6 -5,4 5,4"
                  fill={SEVERITY_COLORS[disruption.severity]}
                  stroke="#374151"
                  strokeWidth={1}
                  opacity={0.9}
                />
                <text
                  textAnchor="middle"
                  y={1}
                  fontSize="6"
                  fill="white"
                  fontWeight="bold"
                >
                  ⚠
                </text>
              </Marker>
            ))}
          </ComposableMap>

          {/* Animation controls */}
          <div className="absolute top-4 left-4 bg-terminal-bg/90 backdrop-blur-sm border border-terminal-border rounded p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-terminal-accent/20 text-terminal-accent rounded hover:bg-terminal-accent/30 transition-colors"
              >
                {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isAnimating ? 'Pause' : 'Play'} Animation
              </button>
              <button
                onClick={initializeFlowParticles}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-terminal-surface border border-terminal-border rounded hover:bg-terminal-bg transition-colors"
                title="Reset particle positions"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-terminal-bg/90 backdrop-blur-sm border border-terminal-border rounded p-3">
            <h4 className="text-sm font-bold text-terminal-text mb-2">Legend</h4>
            <div className="space-y-1 text-xs text-terminal-muted">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Low Risk Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Medium Risk Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Risk Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500"></div>
                <span>Supply Chain Disruption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-yellow-400" style={{clipPath: "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)"}}></div>
                <span>Critical Trade Route</span>
              </div>
              {filters.showAnimation && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <span>Trade Flow Particles</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Side Panel */}
    <div className="xl:col-span-1">
      <div className="bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-xl h-fit sticky top-6">
          {/* Search and Filters */}
          <div className="p-4 border-b border-terminal-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-terminal-accent" />
                {!isFiltersCollapsed && <h4 className="font-bold text-terminal-text">Search & Filters</h4>}
              </div>
              <button
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className="p-1 hover:bg-terminal-bg/50 rounded transition-colors"
                title={isFiltersCollapsed ? "Expand filters" : "Collapse filters"}
              >
                <X className={`w-4 h-4 text-terminal-muted transition-transform ${isFiltersCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {!isFiltersCollapsed && (
              <div>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                  <input
                    type="text"
                    placeholder="Search nodes, disruptions, types..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-8 py-2 bg-terminal-bg border border-terminal-border rounded text-terminal-text placeholder-terminal-muted text-sm focus:outline-none focus:border-terminal-accent"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted hover:text-terminal-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <button
                    onClick={() => setFilters(f => ({ ...f, riskLevelFilter: ['high', 'critical'] }))}
                    className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
                  >
                    High Risk Only
                  </button>
                  <button
                    onClick={() => setFilters(f => ({ ...f, severityFilter: ['critical'] }))}
                    className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/30 transition-colors"
                  >
                    Critical Disruptions
                  </button>
                  <button
                    onClick={() => setFilters(f => ({ 
                      ...f, 
                      searchQuery: '',
                      nodeTypeFilter: ['port', 'manufacturer', 'supplier', 'distributor', 'retailer'],
                      riskLevelFilter: ['low', 'medium', 'high', 'critical'],
                      severityFilter: ['low', 'medium', 'high', 'critical'],
                      geographicFilter: 'all'
                    }))}
                    className="px-2 py-1 text-xs bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30 rounded hover:bg-terminal-accent/30 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
                
                {/* Display toggles */}
                <div className="space-y-2 mb-4">
                  <label className="flex items-center gap-2 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.showNodes}
                      onChange={(e) => setFilters(f => ({ ...f, showNodes: e.target.checked }))}
                      className="rounded"
                    />
                    Show Trade Nodes
                  </label>
                  <label className="flex items-center gap-2 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.showEdges}
                      onChange={(e) => setFilters(f => ({ ...f, showEdges: e.target.checked }))}
                      className="rounded"
                    />
                    Show Trade Flows
                  </label>
                  <label className="flex items-center gap-2 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.showDisruptions}
                      onChange={(e) => setFilters(f => ({ ...f, showDisruptions: e.target.checked }))}
                      className="rounded"
                    />
                    Show Disruptions
                  </label>
                  <label className="flex items-center gap-2 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.showCriticalPaths}
                      onChange={(e) => setFilters(f => ({ ...f, showCriticalPaths: e.target.checked }))}
                      className="rounded"
                    />
                    Show Critical Paths
                  </label>
                  <label className="flex items-center gap-2 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.showAnimation}
                      onChange={(e) => setFilters(f => ({ ...f, showAnimation: e.target.checked }))}
                      className="rounded"
                    />
                    Enable Animations
                  </label>
                </div>

                {/* Geographic Region Filter */}
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-terminal-text mb-2">Geographic Region</h5>
                  <select
                    value={filters.geographicFilter}
                    onChange={(e) => setFilters(f => ({ ...f, geographicFilter: e.target.value }))}
                    className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-terminal-text text-xs focus:outline-none focus:border-terminal-accent"
                  >
                    <option value="all">All Regions</option>
                    <option value="north_america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="africa">Africa</option>
                    <option value="south_america">South America</option>
                    <option value="oceania">Oceania</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Node Type Filter */}
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-terminal-text mb-2">Node Types</h5>
                  <div className="grid grid-cols-2 gap-1">
                    {(['port', 'manufacturer', 'supplier', 'distributor', 'retailer'] as const).map(type => (
                      <label key={type} className="flex items-center gap-1 text-xs text-terminal-text">
                        <input
                          type="checkbox"
                          checked={filters.nodeTypeFilter.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(f => ({ ...f, nodeTypeFilter: [...f.nodeTypeFilter, type] }));
                            } else {
                              setFilters(f => ({ ...f, nodeTypeFilter: f.nodeTypeFilter.filter(t => t !== type) }));
                            }
                          }}
                          className="rounded text-xs"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Risk Level Filter */}
                <div className="mb-4">
              <h5 className="text-xs font-bold text-terminal-text mb-2">Risk Levels</h5>
              <div className="grid grid-cols-2 gap-1">
                {(['low', 'medium', 'high', 'critical'] as const).map(risk => (
                  <label key={risk} className="flex items-center gap-1 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.riskLevelFilter.includes(risk)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(f => ({ ...f, riskLevelFilter: [...f.riskLevelFilter, risk] }));
                        } else {
                          setFilters(f => ({ ...f, riskLevelFilter: f.riskLevelFilter.filter(r => r !== risk) }));
                        }
                      }}
                      className="rounded text-xs"
                    />
                    <span className="capitalize">{risk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disruption Severity Filter */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-terminal-text mb-2">Disruption Severity</h5>
              <div className="grid grid-cols-2 gap-1">
                {(['low', 'medium', 'high', 'critical'] as const).map(severity => (
                  <label key={severity} className="flex items-center gap-1 text-xs text-terminal-text">
                    <input
                      type="checkbox"
                      checked={filters.severityFilter.includes(severity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(f => ({ ...f, severityFilter: [...f.severityFilter, severity] }));
                        } else {
                          setFilters(f => ({ ...f, severityFilter: f.severityFilter.filter(s => s !== severity) }));
                        }
                      }}
                      className="rounded text-xs"
                    />
                    <span className="capitalize">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trade Value Filter */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-terminal-text mb-2">Min Trade Value (USD)</h5>
              <input
                type="range"
                min="0"
                max="10000000000"
                step="100000000"
                value={filters.minTradeValue}
                onChange={(e) => setFilters(f => ({ ...f, minTradeValue: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-terminal-muted mt-1">
                {formatTradeValueOptional(filters.minTradeValue)}
              </div>
            </div>

            {/* Context Layers */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-terminal-text mb-2">Context Layers</h5>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-terminal-text">
                  <input
                    type="checkbox"
                    checked={contextLayers.showWeather}
                    onChange={(e) => setContextLayers(c => ({ ...c, showWeather: e.target.checked }))}
                    className="rounded text-xs"
                  />
                  Weather Systems
                </label>
                <label className="flex items-center gap-2 text-xs text-terminal-text">
                  <input
                    type="checkbox"
                    checked={contextLayers.showPoliticalBoundaries}
                    onChange={(e) => setContextLayers(c => ({ ...c, showPoliticalBoundaries: e.target.checked }))}
                    className="rounded text-xs"
                  />
                  Political Boundaries
                </label>
                <label className="flex items-center gap-2 text-xs text-terminal-text">
                  <input
                    type="checkbox"
                    checked={contextLayers.showOceanCurrents}
                    onChange={(e) => setContextLayers(c => ({ ...c, showOceanCurrents: e.target.checked }))}
                    className="rounded text-xs"
                  />
                  Ocean Currents
                </label>
                <label className="flex items-center gap-2 text-xs text-terminal-text">
                  <input
                    type="checkbox"
                    checked={contextLayers.showShippingLanes}
                    onChange={(e) => setContextLayers(c => ({ ...c, showShippingLanes: e.target.checked }))}
                    className="rounded text-xs"
                  />
                  Major Shipping Lanes
                </label>
              </div>
                
              {/* All remaining filter sections should be here but let's close this conditional for now */}
            </div>
              </div>
            )}
          </div>
        
          {/* Selected item details */}
          <div className="p-4">
            {selectedNode && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-terminal-accent" />
                  <h4 className="font-bold text-terminal-text">Trade Node Details</h4>
                </div>
                <div className="space-y-2 text-xs text-terminal-muted">
                  <div><span className="font-semibold">Name:</span> {selectedNode.name}</div>
                  <div><span className="font-semibold">Type:</span> {selectedNode.type}</div>
                  <div><span className="font-semibold">Location:</span> {selectedNode.lat.toFixed(4)}, {selectedNode.lng.toFixed(4)}</div>
                  
                  <div className="mt-3">
                    <div className="font-semibold mb-1">Risk Assessment:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div>Operational: <span className={`font-mono ${selectedNode.risk_operational > 0.6 ? 'text-red-400' : selectedNode.risk_operational > 0.3 ? 'text-amber-400' : 'text-green-400'}`}>
                          {(selectedNode.risk_operational * 100).toFixed(0)}%
                        </span></div>
                      </div>
                      <div>
                        <div>Financial: <span className={`font-mono ${selectedNode.risk_financial > 0.6 ? 'text-red-400' : selectedNode.risk_financial > 0.3 ? 'text-amber-400' : 'text-green-400'}`}>
                          {(selectedNode.risk_financial * 100).toFixed(0)}%
                        </span></div>
                      </div>
                      <div>
                        <div>Policy: <span className={`font-mono ${selectedNode.risk_policy > 0.6 ? 'text-red-400' : selectedNode.risk_policy > 0.3 ? 'text-amber-400' : 'text-green-400'}`}>
                          {(selectedNode.risk_policy * 100).toFixed(0)}%
                        </span></div>
                      </div>
                    </div>
                  </div>

                  {Object.keys(selectedNode.industry_impacts).length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Industry Impacts:</div>
                      {Object.entries(selectedNode.industry_impacts).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="capitalize">{key.replace(/_/g, ' ')}:</span> {
                            typeof value === 'number' ? (
                              key.includes('usd') ? formatTradeValueOptional(value as number | undefined) : 
                              key.includes('pct') || key.includes('score') ? `${(value * 100).toFixed(1)}%` :
                              value.toLocaleString()
                            ) : String(value)
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedDisruption && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-terminal-accent" />
                  <h4 className="font-bold text-terminal-text">Disruption Details</h4>
                </div>
                <div className="space-y-2 text-xs text-terminal-muted">
                  <div><span className="font-semibold">Type:</span> {selectedDisruption.type}</div>
                  <div>
                    <span className="font-semibold">Severity:</span> 
                    <span className={`ml-1 px-1 py-0.5 rounded text-xs font-mono bg-${selectedDisruption.severity === 'critical' ? 'red' : selectedDisruption.severity === 'high' ? 'orange' : selectedDisruption.severity === 'medium' ? 'yellow' : 'green'}-500/20 text-${selectedDisruption.severity === 'critical' ? 'red' : selectedDisruption.severity === 'high' ? 'orange' : selectedDisruption.severity === 'medium' ? 'yellow' : 'green'}-400`}>
                      {selectedDisruption.severity.toUpperCase()}
                    </span>
                  </div>
                  <div><span className="font-semibold">Source:</span> {selectedDisruption.source}</div>
                  <div><span className="font-semibold">Description:</span> {selectedDisruption.description}</div>
                  
                  {selectedDisruption.economic_impact_usd && (
                    <div><span className="font-semibold">Economic Impact:</span> {formatTradeValueOptional(selectedDisruption.economic_impact_usd)}</div>
                  )}

                  {selectedDisruption.vessels_impacted && (
                    <div><span className="font-semibold">Vessels Affected:</span> {selectedDisruption.vessels_impacted}</div>
                  )}

                  {selectedDisruption.affected_commodities && selectedDisruption.affected_commodities.length > 0 && (
                    <div>
                      <div className="font-semibold mb-1">Affected Commodities:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedDisruption.affected_commodities.map(commodity => (
                          <span key={commodity} className="px-1 py-0.5 bg-terminal-accent/20 text-terminal-accent rounded text-xs">
                            {commodity.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDisruption.mitigation_strategies && selectedDisruption.mitigation_strategies.length > 0 && (
                    <div>
                      <div className="font-semibold mb-1">Mitigation Strategies:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedDisruption.mitigation_strategies.slice(0, 3).map((strategy, index) => (
                          <li key={index} className="text-xs">{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedNode && !selectedDisruption && (
              <div className="text-center text-terminal-muted">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on a node or disruption to view details</p>
              </div>
            )}
          </div>

          {/* Summary stats */}
          <div className="p-4 border-t border-terminal-border bg-terminal-bg/50">
            <h4 className="font-bold text-terminal-text mb-3">
              {filters.searchQuery || filters.geographicFilter !== 'all' || 
               filters.nodeTypeFilter.length !== 5 || filters.riskLevelFilter.length !== 4 
               ? 'Filtered Results' : 'Summary'}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-terminal-muted">
                  Trade Nodes
                  {filteredData.nodes.length !== data.nodes.length && (
                    <span className="ml-1 text-terminal-accent">
                      ({filteredData.nodes.length}/{data.nodes.length})
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-terminal-text">{filteredData.nodes.length}</div>
              </div>
              <div>
                <div className="text-terminal-muted">
                  Trade Routes
                  {filteredData.edges.length !== data.edges.length && (
                    <span className="ml-1 text-terminal-accent">
                      ({filteredData.edges.length}/{data.edges.length})
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-terminal-text">{filteredData.edges.length}</div>
              </div>
              <div>
                <div className="text-terminal-muted">
                  Active Disruptions
                  {filteredData.disruptions.length !== data.disruptions.length && (
                    <span className="ml-1 text-terminal-accent">
                      ({filteredData.disruptions.length}/{data.disruptions.length})
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-red-400">{filteredData.disruptions.length}</div>
              </div>
              <div>
                <div className="text-terminal-muted">Critical Paths</div>
                <div className="text-lg font-bold text-yellow-400">{data.critical_paths.length}</div>
              </div>
            </div>
            
            {/* Filter Status */}
            {(filters.searchQuery || filters.geographicFilter !== 'all' || 
              filters.nodeTypeFilter.length !== 5 || filters.riskLevelFilter.length !== 4) && (
              <div className="mt-3 p-2 bg-terminal-accent/10 border border-terminal-accent/30 rounded">
                <div className="text-xs text-terminal-accent font-semibold mb-1">Active Filters:</div>
                <div className="flex flex-wrap gap-1">
                  {filters.searchQuery && (
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                      Search: "{filters.searchQuery}"
                    </span>
                  )}
                  {filters.geographicFilter !== 'all' && (
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                      {filters.geographicFilter.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                  {filters.nodeTypeFilter.length < 5 && (
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {filters.nodeTypeFilter.length} Types
                    </span>
                  )}
                  {filters.riskLevelFilter.length < 4 && (
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
                      {filters.riskLevelFilter.join(', ')} Risk
                    </span>
                  )}
                  {filters.minTradeValue > 0 && (
                    <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                      &gt;{formatTradeValueOptional(filters.minTradeValue)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 text-xs text-terminal-muted">
              Updated: {new Date(data.as_of).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}
