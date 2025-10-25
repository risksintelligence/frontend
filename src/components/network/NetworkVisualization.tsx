'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Settings
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  group: string;
  centrality: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  connections: number;
  weight?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  weight: number;
  type: string;
  strength: number;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  metrics: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    clustering: number;
  };
}

interface NetworkVisualizationProps {
  data: NetworkData;
  width?: number;
  height?: number;
  interactive?: boolean;
  showLabels?: boolean;
  onNodeClick?: (node: NetworkNode) => void;
  onLinkClick?: (link: NetworkLink) => void;
}

export default function NetworkVisualization({
  data,
  width = 800,
  height = 600,
  interactive = true,
  showLabels = true,
  onNodeClick,
  onLinkClick
}: NetworkVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g').attr('class', 'network-container');

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Color scales for different node types and risk levels
    const colorScale = d3.scaleOrdinal()
      .domain(['financial', 'infrastructure', 'supply_chain', 'government', 'technology'])
      .range(['#1e40af', '#059669', '#d97706', '#7c3aed', '#dc2626']);

    const riskColorScale = d3.scaleOrdinal()
      .domain(['low', 'medium', 'high', 'critical'])
      .range(['#10b981', '#f59e0b', '#f97316', '#ef4444']);

    // Size scale based on centrality
    const nodeSize = d3.scaleLinear()
      .domain(d3.extent(data.nodes, d => d.centrality) as [number, number])
      .range([4, 20]);

    // Link thickness scale
    const linkWidth = d3.scaleLinear()
      .domain(d3.extent(data.links, d => d.weight) as [number, number])
      .range([1, 6]);

    // Create force simulation
    const simulation = d3.forceSimulation<NetworkNode>(data.nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(data.links)
        .id(d => d.id)
        .distance(d => 50 + (1 - d.strength) * 100)
        .strength(d => d.strength))
      .force('charge', d3.forceManyBody()
        .strength(d => -300 - (d as NetworkNode).centrality * 100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => nodeSize((d as NetworkNode).centrality) + 2));

    simulationRef.current = simulation;

    // Create arrow markers for directed links
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xOverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#6b7280')
      .style('stroke', 'none');

    // Create links
    const links = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#6b7280')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => linkWidth(d.weight))
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', interactive ? 'pointer' : 'default');

    // Create nodes
    const nodes = container.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', d => nodeSize(d.centrality))
      .attr('fill', d => colorScale(d.type) as string)
      .attr('stroke', d => riskColorScale(d.riskLevel) as string)
      .attr('stroke-width', 2)
      .style('cursor', interactive ? 'pointer' : 'default');

    // Create labels
    let labels: d3.Selection<SVGTextElement, NetworkNode, SVGGElement, unknown> | null = null;
    if (showLabels) {
      labels = container.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(data.nodes)
        .enter().append('text')
        .text(d => d.name)
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('fill', '#374151')
        .attr('text-anchor', 'middle')
        .attr('dy', d => nodeSize(d.centrality) + 12)
        .style('pointer-events', 'none');
    }

    // Add interactivity
    if (interactive) {
      // Node interactions
      nodes
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedNode(d);
          onNodeClick?.(d);
        })
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('stroke-width', 4)
            .attr('r', nodeSize(d.centrality) * 1.2);
          
          // Highlight connected links
          links
            .attr('stroke-opacity', link => 
              (link.source as NetworkNode).id === d.id || (link.target as NetworkNode).id === d.id ? 0.8 : 0.2)
            .attr('stroke-width', link => 
              (link.source as NetworkNode).id === d.id || (link.target as NetworkNode).id === d.id 
                ? linkWidth(link.weight) * 1.5 : linkWidth(link.weight));
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('stroke-width', 2)
            .attr('r', nodeSize(d.centrality));
          
          // Reset link highlighting
          links
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => linkWidth(d.weight));
        });

      // Link interactions
      links
        .on('click', (event, d) => {
          event.stopPropagation();
          onLinkClick?.(d);
        })
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('stroke-opacity', 1)
            .attr('stroke-width', linkWidth(d.weight) * 2);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', linkWidth(d.weight));
        });

      // Drag behavior
      const drag = d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });

      nodes.call(drag);
    }

    // Update positions on tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!);

      nodes
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      if (labels) {
        labels
          .attr('x', d => d.x!)
          .attr('y', d => d.y!);
      }
    });

    // Auto-stop simulation after initial settling
    setTimeout(() => {
      simulation.stop();
      setIsPlaying(false);
    }, 3000);

    return () => {
      simulation.stop();
    };
  }, [data, width, height, interactive, showLabels, onNodeClick, onLinkClick]);

  const handlePlayPause = () => {
    if (!simulationRef.current) return;

    if (isPlaying) {
      simulationRef.current.stop();
      setIsPlaying(false);
    } else {
      simulationRef.current.alpha(0.3).restart();
      setIsPlaying(true);
      setTimeout(() => {
        simulationRef.current?.stop();
        setIsPlaying(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    if (!simulationRef.current) return;
    
    // Reset node positions
    data.nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });
    
    simulationRef.current.alpha(1).restart();
    setIsPlaying(true);
    setSelectedNode(null);
    
    setTimeout(() => {
      simulationRef.current?.stop();
      setIsPlaying(false);
    }, 3000);
  };

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1 / 1.5
    );
  };

  const handleFitToScreen = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-terminal-text">
            NETWORK TOPOLOGY
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="text-xs font-mono text-terminal-muted">
              Zoom: {(zoomLevel * 100).toFixed(0)}%
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="h-7 w-7 p-0"
              >
                {isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-7 w-7 p-0"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="h-7 w-7 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-7 w-7 p-0"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFitToScreen}
                className="h-7 w-7 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-mono text-terminal-muted">
          <div>Nodes: {data.nodes.length}</div>
          <div>Edges: {data.links.length}</div>
          <div>Density: {(data.metrics.density * 100).toFixed(1)}%</div>
          <div>Clustering: {(data.metrics.clustering * 100).toFixed(1)}%</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="border border-terminal-border bg-terminal-bg"
          />
          
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-white border border-slate-200 rounded p-3 text-xs">
            <div className="font-semibold mb-2">Node Types</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                <span>Financial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span>Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span>Supply Chain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span>Government</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>Technology</span>
              </div>
            </div>
            
            <div className="font-semibold mt-3 mb-2">Risk Levels</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-emerald-500"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-yellow-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-orange-500"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-red-500"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>
          
          {/* Selected node info */}
          {selectedNode && (
            <div className="absolute top-4 right-4 bg-white border border-slate-200 rounded p-3 text-xs min-w-48">
              <div className="font-semibold mb-2">{selectedNode.name}</div>
              <div className="space-y-1">
                <div>Type: {selectedNode.type}</div>
                <div>Risk Level: {selectedNode.riskLevel}</div>
                <div>Centrality: {selectedNode.centrality.toFixed(3)}</div>
                <div>Connections: {selectedNode.connections}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}