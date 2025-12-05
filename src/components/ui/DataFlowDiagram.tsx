"use client";

import { useState } from "react";
import { Database, BarChart3, TrendingUp, Network, Target, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

export interface DataNode {
  id: string;
  label: string;
  type: "source" | "process" | "output" | "model";
  status: "active" | "warning" | "error" | "pending";
  latency?: string;
  quality?: number;
  description?: string;
  endpoint?: string;
}

export interface DataFlow {
  from: string;
  to: string;
  label?: string;
  type?: "real-time" | "batch" | "on-demand";
  volume?: string;
}

export interface DataFlowDiagramProps {
  title: string;
  nodes: DataNode[];
  flows: DataFlow[];
  onNodeClick?: (node: DataNode) => void;
  className?: string;
}

function getNodeIcon(type: string) {
  switch (type) {
    case "source":
      return <Database className="h-4 w-4" />;
    case "process":
      return <BarChart3 className="h-4 w-4" />;
    case "output":
      return <TrendingUp className="h-4 w-4" />;
    case "model":
      return <Target className="h-4 w-4" />;
    default:
      return <Network className="h-4 w-4" />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <CheckCircle className="h-3 w-3 text-terminal-green" />;
    case "warning":
      return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
    case "error":
      return <AlertTriangle className="h-3 w-3 text-red-600" />;
    case "pending":
      return <Clock className="h-3 w-3 text-terminal-muted" />;
    default:
      return null;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "border-terminal-green bg-terminal-green/10";
    case "warning":
      return "border-yellow-600 bg-yellow-600/10";
    case "error":
      return "border-red-600 bg-red-600/10";
    case "pending":
      return "border-terminal-muted bg-terminal-muted/10";
    default:
      return "border-terminal-border bg-terminal-surface";
  }
}

function getFlowLineColor(type?: string) {
  switch (type) {
    case "real-time":
      return "text-terminal-green";
    case "batch":
      return "text-cyan-600";
    case "on-demand":
      return "text-yellow-600";
    default:
      return "text-terminal-muted";
  }
}

function DataNodeComponent({ node, onClick, position }: { 
  node: DataNode; 
  onClick?: (node: DataNode) => void;
  position: { x: number; y: number; };
}) {
  return (
    <div
      className={`absolute flex flex-col items-center cursor-pointer group transition-all duration-200 hover:scale-105 ${
        onClick ? 'hover:shadow-lg' : ''
      }`}
      style={{ left: position.x, top: position.y }}
      onClick={() => onClick?.(node)}
    >
      <div
        className={`p-3 rounded-lg border-2 ${getStatusColor(node.status)} transition-colors group-hover:border-terminal-text/30`}
      >
        <div className="flex items-center gap-2">
          {getNodeIcon(node.type)}
          <span className="text-xs font-mono font-semibold text-terminal-text">
            {node.label}
          </span>
          {getStatusIcon(node.status)}
        </div>
        {(node.latency || node.quality) && (
          <div className="flex items-center gap-3 mt-1">
            {node.latency && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-terminal-muted" />
                <span className="text-xs text-terminal-muted font-mono">{node.latency}</span>
              </div>
            )}
            {node.quality && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-terminal-muted" />
                <span className="text-xs text-terminal-muted font-mono">{node.quality}%</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="invisible group-hover:visible absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-terminal-bg border border-terminal-border rounded p-2 shadow-lg z-10 w-48">
        <p className="text-xs font-mono text-terminal-text mb-1">{node.label}</p>
        {node.description && (
          <p className="text-xs text-terminal-muted mb-2">{node.description}</p>
        )}
        {node.endpoint && (
          <p className="text-xs text-terminal-muted font-mono">{node.endpoint}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-mono ${
            node.status === 'active' ? 'text-terminal-green' :
            node.status === 'warning' ? 'text-yellow-600' :
            node.status === 'error' ? 'text-red-600' :
            'text-terminal-muted'
          }`}>
            {node.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ 
  flow, 
  fromPos, 
  toPos 
}: { 
  flow: DataFlow; 
  fromPos: { x: number; y: number }; 
  toPos: { x: number; y: number };
}) {
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  
  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${flow.from}-${flow.to}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            className={getFlowLineColor(flow.type)}
            fill="currentColor"
          />
        </marker>
      </defs>
      
      <line
        x1={fromPos.x + 50}
        y1={fromPos.y + 25}
        x2={toPos.x - 50}
        y2={toPos.y + 25}
        className={`${getFlowLineColor(flow.type)} transition-all duration-200 hover:stroke-2`}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={flow.type === "batch" ? "5,5" : flow.type === "on-demand" ? "10,3,3,3" : "none"}
        markerEnd={`url(#arrowhead-${flow.from}-${flow.to})`}
      />
      
      {flow.label && (
        <text
          x={midX}
          y={midY - 5}
          textAnchor="middle"
          className="text-xs font-mono fill-terminal-muted"
        >
          {flow.label}
        </text>
      )}
      
      {flow.volume && (
        <text
          x={midX}
          y={midY + 12}
          textAnchor="middle"
          className="text-xs font-mono fill-terminal-muted opacity-70"
        >
          {flow.volume}
        </text>
      )}
    </g>
  );
}

export default function DataFlowDiagram({ 
  title, 
  nodes, 
  flows, 
  onNodeClick, 
  className = "" 
}: DataFlowDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (node: DataNode) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
    onNodeClick?.(node);
  };

  // Calculate positions for nodes in a flow-like layout
  const getNodePosition = (node: DataNode, index: number) => {
    const sources = nodes.filter(n => n.type === "source");
    const processes = nodes.filter(n => n.type === "process");
    const models = nodes.filter(n => n.type === "model");
    const outputs = nodes.filter(n => n.type === "output");
    
    if (node.type === "source") {
      const sourceIndex = sources.indexOf(node);
      return { x: 50, y: 80 + sourceIndex * 120 };
    } else if (node.type === "process") {
      const processIndex = processes.indexOf(node);
      return { x: 250, y: 80 + processIndex * 120 };
    } else if (node.type === "model") {
      const modelIndex = models.indexOf(node);
      return { x: 450, y: 80 + modelIndex * 120 };
    } else if (node.type === "output") {
      const outputIndex = outputs.indexOf(node);
      return { x: 650, y: 80 + outputIndex * 120 };
    }
    
    return { x: 50 + index * 150, y: 80 };
  };

  const nodePositions = nodes.reduce((acc, node, index) => {
    acc[node.id] = getNodePosition(node, index);
    return acc;
  }, {} as Record<string, { x: number; y: number }>);

  const maxHeight = Math.max(...Object.values(nodePositions).map(pos => pos.y)) + 100;

  return (
    <div className={`bg-terminal-surface border border-terminal-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
            {title}
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Real-time data flow and processing pipeline
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-terminal-green"></div>
            <span className="text-terminal-muted">Real-time</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-cyan-600" style={{ backgroundImage: "repeating-linear-gradient(to right, transparent, transparent 2px, cyan 2px, cyan 4px)" }}></div>
            <span className="text-terminal-muted">Batch</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-yellow-600" style={{ backgroundImage: "repeating-linear-gradient(to right, transparent, transparent 1px, #d97706 1px, #d97706 2px)" }}></div>
            <span className="text-terminal-muted">On-demand</span>
          </div>
        </div>
      </div>
      
      <div className="relative overflow-x-auto">
        <div 
          className="relative min-w-[800px] bg-terminal-bg border border-terminal-border rounded"
          style={{ height: `${maxHeight}px` }}
        >
          {/* SVG for flow lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {flows.map((flow, index) => {
              const fromPos = nodePositions[flow.from];
              const toPos = nodePositions[flow.to];
              if (!fromPos || !toPos) return null;
              
              return (
                <FlowArrow 
                  key={`${flow.from}-${flow.to}-${index}`}
                  flow={flow}
                  fromPos={fromPos}
                  toPos={toPos}
                />
              );
            })}
          </svg>
          
          {/* Nodes */}
          {nodes.map((node) => {
            const position = nodePositions[node.id];
            if (!position) return null;
            
            return (
              <DataNodeComponent
                key={node.id}
                node={node}
                onClick={handleNodeClick}
                position={position}
              />
            );
          })}
        </div>
      </div>
      
      {selectedNode && (
        <div className="mt-4 p-3 bg-terminal-bg border border-terminal-border rounded">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div>
                <h4 className="font-semibold text-terminal-text font-mono text-sm mb-2">
                  {node.label} Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-terminal-muted">Type:</span>
                    <span className="ml-2 text-terminal-text">{node.type}</span>
                  </div>
                  <div>
                    <span className="text-terminal-muted">Status:</span>
                    <span className={`ml-2 ${
                      node.status === 'active' ? 'text-terminal-green' :
                      node.status === 'warning' ? 'text-yellow-600' :
                      node.status === 'error' ? 'text-red-600' :
                      'text-terminal-muted'
                    }`}>
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                  {node.latency && (
                    <div>
                      <span className="text-terminal-muted">Latency:</span>
                      <span className="ml-2 text-terminal-text">{node.latency}</span>
                    </div>
                  )}
                  {node.quality && (
                    <div>
                      <span className="text-terminal-muted">Quality:</span>
                      <span className="ml-2 text-terminal-text">{node.quality}%</span>
                    </div>
                  )}
                </div>
                {node.description && (
                  <p className="text-xs text-terminal-muted mt-2">{node.description}</p>
                )}
                {node.endpoint && (
                  <p className="text-xs text-terminal-muted font-mono mt-1">
                    Endpoint: {node.endpoint}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
