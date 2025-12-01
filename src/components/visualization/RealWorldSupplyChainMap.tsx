"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Search,
  X,
  SlidersHorizontal,
  Download,
  Monitor,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

// Use Natural Earth data - accurate world geography
const geoUrl = "https://unpkg.com/world-atlas@3.0.0/world/110m.json";

// Type definitions (same as before)
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
}

interface RealWorldSupplyChainMapProps {
  data: SupplyChainData;
  className?: string;
}

const SEVERITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b', 
  high: '#ef4444',
  critical: '#dc2626'
};

export default function RealWorldSupplyChainMap({ data, className = "" }: RealWorldSupplyChainMapProps) {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SupplyChainNode | null>(null);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
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
    geographicFilter: 'all'
  });

  // Calculate risk level
  const calculateRiskLevel = (operational: number, financial: number, policy: number): string => {
    const avgRisk = (operational + financial + policy) / 3;
    if (avgRisk >= 0.8) return 'critical';
    if (avgRisk >= 0.6) return 'high';
    if (avgRisk >= 0.3) return 'medium';
    return 'low';
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    const filteredNodes = data.nodes.filter(node => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = node.name.toLowerCase().includes(query);
        const matchesType = node.type.toLowerCase().includes(query);
        const matchesId = node.id.toLowerCase().includes(query);
        if (!matchesName && !matchesType && !matchesId) return false;
      }

      if (!filters.nodeTypeFilter.includes(node.type)) return false;

      const riskLevel = calculateRiskLevel(node.risk_operational, node.risk_financial, node.risk_policy);
      if (!filters.riskLevelFilter.includes(riskLevel)) return false;

      return true;
    });

    const filteredDisruptions = data.disruptions.filter(disruption => {
      if (!filters.severityFilter.includes(disruption.severity)) return false;
      if (!filters.sourceFilter.some(source => disruption.source.includes(source))) return false;

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesType = disruption.type.toLowerCase().includes(query);
        const matchesDescription = disruption.description.toLowerCase().includes(query);
        const matchesSource = disruption.source.toLowerCase().includes(query);
        if (!matchesType && !matchesDescription && !matchesSource) return false;
      }

      return true;
    });

    const filteredEdges = data.edges.filter(edge => {
      if ((edge.trade_value_usd || 0) < filters.minTradeValue) return false;

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

  // Format trade value
  const formatTradeValue = (value?: number): string => {
    if (!value) return 'N/A';
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  // Export functionality
  const exportMap = useCallback((format: 'png' | 'svg') => {
    const svgElement = document.querySelector('#real-world-map svg') as SVGElement;
    if (!svgElement) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-world-map-${new Date().toISOString().split('T')[0]}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <div 
      id="real-world-map"
      className={`relative bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 border border-slate-700/50 rounded-xl shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-blue-800/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Real World Supply Chain Map
            </h3>
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Accurate geographic data • {filteredData.nodes.length} nodes • {filteredData.edges.length} routes
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportMap('svg')}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 transition-all duration-200 border border-slate-600/50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: '70vh', minHeight: '500px', maxHeight: '800px' }}>
        {/* Map Visualization with Real World Geography */}
        <div className="flex-1 relative overflow-hidden">
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{
              scale: 140,
              center: [0, 20]
            }}
            width={1000}
            height={500}
            className="w-full h-full"
          >
            {/* Ocean sphere background */}
            <Sphere 
              stroke="#1e40af" 
              strokeWidth={0.5} 
              fill="#0ea5e9"
              fillOpacity={0.1}
            />
            
            {/* Graticule (lat/lng grid) */}
            <Graticule 
              stroke="#64748b" 
              strokeWidth={0.3} 
              strokeOpacity={0.2}
            />
            
            {/* Real world countries using Natural Earth data */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#22c55e"
                    stroke="#16a34a"
                    strokeWidth={0.3}
                    style={{
                      default: { 
                        fill: "#22c55e",
                        stroke: "#16a34a",
                        strokeWidth: 0.3,
                        outline: "none" 
                      },
                      hover: { 
                        fill: "#16a34a",
                        stroke: "#15803d",
                        strokeWidth: 0.5,
                        outline: "none" 
                      },
                      pressed: { 
                        fill: "#15803d",
                        stroke: "#166534",
                        strokeWidth: 0.7,
                        outline: "none" 
                      }
                    }}
                    onClick={() => {
                      setSelectedCountry(geo.properties.NAME);
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Supply Chain Trade Routes */}
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

            {/* Supply Chain Nodes */}
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
                  onClick={() => setSelectedNode(node)}
                  style={{ cursor: 'pointer' }}
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

            {/* Disruption Markers */}
            {filters.showDisruptions && filteredData.disruptions.map((disruption) => (
              <Marker 
                key={disruption.id} 
                coordinates={[disruption.location[1], disruption.location[0]]}
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
        </div>

        {/* Collapsible Side Panel */}
        <div className={`${isFiltersCollapsed ? 'w-12' : 'w-80'} border-l border-slate-600 bg-slate-800 overflow-y-auto transition-all duration-300`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                {!isFiltersCollapsed && <h4 className="font-bold text-white">Filters</h4>}
              </div>
              <button
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className={`w-4 h-4 text-slate-400 transition-transform ${isFiltersCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {!isFiltersCollapsed && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search nodes, disruptions..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Display toggles */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.showNodes}
                      onChange={(e) => setFilters(f => ({ ...f, showNodes: e.target.checked }))}
                      className="rounded"
                    />
                    Trade Nodes
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.showEdges}
                      onChange={(e) => setFilters(f => ({ ...f, showEdges: e.target.checked }))}
                      className="rounded"
                    />
                    Trade Routes
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.showDisruptions}
                      onChange={(e) => setFilters(f => ({ ...f, showDisruptions: e.target.checked }))}
                      className="rounded"
                    />
                    Disruptions
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Selected Details */}
          {selectedNode && (
            <div className="p-4 border-t border-slate-600">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-white">Node Details</h4>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <div><span className="font-semibold">Name:</span> {selectedNode.name}</div>
                <div><span className="font-semibold">Type:</span> {selectedNode.type}</div>
                <div><span className="font-semibold">Location:</span> {selectedNode.lat.toFixed(4)}, {selectedNode.lng.toFixed(4)}</div>
                <div>
                  <span className="font-semibold">Risk Level:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    calculateRiskLevel(selectedNode.risk_operational, selectedNode.risk_financial, selectedNode.risk_policy) === 'critical' ? 'bg-red-900 text-red-200' :
                    calculateRiskLevel(selectedNode.risk_operational, selectedNode.risk_financial, selectedNode.risk_policy) === 'high' ? 'bg-orange-900 text-orange-200' :
                    calculateRiskLevel(selectedNode.risk_operational, selectedNode.risk_financial, selectedNode.risk_policy) === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {calculateRiskLevel(selectedNode.risk_operational, selectedNode.risk_financial, selectedNode.risk_policy).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedCountry && (
            <div className="p-4 border-t border-slate-600">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-white">Country Selected</h4>
              </div>
              <div className="text-sm text-slate-300">
                <div><span className="font-semibold">Country:</span> {selectedCountry}</div>
                <div><span className="font-semibold">Nodes in region:</span> {filteredData.nodes.length}</div>
                <div><span className="font-semibold">Active routes:</span> {filteredData.edges.length}</div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 border-t border-slate-600 bg-slate-900/50">
            <h4 className="font-bold text-white mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-400">Nodes</div>
                <div className="text-lg font-bold text-white">{filteredData.nodes.length}</div>
              </div>
              <div>
                <div className="text-slate-400">Routes</div>
                <div className="text-lg font-bold text-white">{filteredData.edges.length}</div>
              </div>
              <div>
                <div className="text-slate-400">Disruptions</div>
                <div className="text-lg font-bold text-red-400">{filteredData.disruptions.length}</div>
              </div>
              <div>
                <div className="text-slate-400">Countries</div>
                <div className="text-lg font-bold text-green-400">195+</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Real geographic data • Natural Earth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}