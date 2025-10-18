import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  category: 'financial' | 'supply_chain' | 'economic' | 'government';
  riskLevel: number; // 0-100
  systemicImportance: number;
  description: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  strength: number; // Connection strength 0-1
  riskPropagation: number; // Risk propagation factor 0-1
  type: 'trade' | 'financial' | 'supply' | 'regulatory';
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  timestamp: string;
}

interface NetworkGraphProps {
  data?: NetworkData;
  width?: number;
  height?: number;
  onNodeClick?: (node: NetworkNode) => void;
  onLinkClick?: (link: NetworkLink) => void;
}

export default function NetworkGraph({
  data,
  width = 800,
  height = 600,
  onNodeClick,
  onLinkClick
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // No default data - component must receive real data from API

  // Component requires real data - no fallback to sample data
  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No network data available</div>
          <div className="text-sm text-gray-400">Please ensure backend API is connected</div>
        </div>
      </div>
    );
  }
  
  const networkData = data;

  const getNodeColor = (category: string, riskLevel: number): string => {
    const baseColors = {
      financial: '#1e40af', // blue
      supply_chain: '#059669', // green
      economic: '#dc2626', // red
      government: '#7c2d12' // brown
    };

    const baseColor = baseColors[category as keyof typeof baseColors] || '#6b7280';
    
    // Adjust opacity based on risk level
    const opacity = 0.4 + (riskLevel / 100) * 0.6;
    const colorWithOpacity = d3.color(baseColor)?.copy({ opacity });
    return colorWithOpacity?.toString() || baseColor;
  };

  const getLinkColor = (type: string, riskPropagation: number): string => {
    const baseColors = {
      trade: '#10b981',
      financial: '#3b82f6',
      supply: '#f59e0b',
      regulatory: '#8b5cf6'
    };

    const baseColor = baseColors[type as keyof typeof baseColors] || '#6b7280';
    const opacity = 0.3 + riskPropagation * 0.7;
    const colorWithOpacity = d3.color(baseColor)?.copy({ opacity });
    return colorWithOpacity?.toString() || baseColor;
  };

  const getRiskIcon = (riskLevel: number) => {
    if (riskLevel < 30) return Activity;
    if (riskLevel < 60) return TrendingUp;
    if (riskLevel < 80) return TrendingDown;
    return AlertTriangle;
  };


  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create container groups
    const g = svg.append('g');
    const linkGroup = g.append('g').attr('class', 'links');
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation<NetworkNode>(networkData.nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(networkData.links)
        .id(d => d.id)
        .distance(d => 80 + (1 - d.strength) * 120)
        .strength(d => d.strength * 0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Create links
    const links = linkGroup
      .selectAll('line')
      .data(networkData.links)
      .enter()
      .append('line')
      .attr('stroke', d => getLinkColor(d.type, d.riskPropagation))
      .attr('stroke-width', d => 1 + d.strength * 4)
      .attr('stroke-dasharray', d => d.type === 'regulatory' ? '5,5' : null)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onLinkClick?.(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', (1 + d.strength * 4) * 1.5);
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .html(`
            <div><strong>${d.type}</strong></div>
            <div>Strength: ${(d.strength * 100).toFixed(0)}%</div>
            <div>Risk Propagation: ${(d.riskPropagation * 100).toFixed(0)}%</div>
          `);

        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', function(_, d) {
        d3.select(this).attr('stroke-width', 1 + d.strength * 4);
        d3.selectAll('.tooltip').remove();
      });

    // Create nodes
    const nodes = nodeGroup
      .selectAll('circle')
      .data(networkData.nodes)
      .enter()
      .append('circle')
      .attr('r', d => 15 + (d.riskLevel / 100) * 15)
      .attr('fill', d => getNodeColor(d.category, d.riskLevel))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('data-risk-level', d => d.riskLevel) // Store risk level for icon selection
      .call(d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
          setSimulationRunning(true);
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          setSimulationRunning(false);
        }))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        onNodeClick?.(d);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 4);
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .html(`
            <div><strong>${d.name}</strong></div>
            <div>Category: ${d.category.replace('_', ' ')}</div>
            <div>Risk Level: ${d.riskLevel}%</div>
          `);

        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 2);
        d3.selectAll('.tooltip').remove();
      });

    // Add risk icons using foreignObject to embed Lucide icons
    const riskIcons = nodeGroup
      .selectAll('foreignObject')
      .data(networkData.nodes)
      .enter()
      .append('foreignObject')
      .attr('width', 16)
      .attr('height', 16)
      .attr('x', -8)
      .attr('y', -8)
      .style('pointer-events', 'none')
      .html(d => {
        const IconComponent = getRiskIcon(d.riskLevel);
        const iconColor = d.riskLevel < 30 ? '#10b981' : 
                         d.riskLevel < 60 ? '#f59e0b' : 
                         d.riskLevel < 80 ? '#ef4444' : '#dc2626';
        
        // Get the appropriate SVG path based on the icon component
        let iconPath = '';
        if (IconComponent === Activity) {
          iconPath = '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>';
        } else if (IconComponent === TrendingUp) {
          iconPath = '<polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>';
        } else if (IconComponent === TrendingDown) {
          iconPath = '<polyline points="23,6 13.5,15.5 8.5,8.5 1,18"/>';
        } else if (IconComponent === AlertTriangle) {
          iconPath = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
        }
        
        return `<div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${iconPath}
                  </svg>
                </div>`;
      });

    // Add labels
    const labels = nodeGroup
      .selectAll('text.node-label')
      .data(networkData.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-weight', '500')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#374151')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as NetworkNode).x || 0)
        .attr('y1', d => (d.source as NetworkNode).y || 0)
        .attr('x2', d => (d.target as NetworkNode).x || 0)
        .attr('y2', d => (d.target as NetworkNode).y || 0);

      nodes
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      riskIcons
        .attr('x', d => (d.x || 0) - 8)
        .attr('y', d => (d.y || 0) - 8);

      labels
        .attr('x', d => d.x || 0)
        .attr('y', d => (d.y || 0) + 30);
    });

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [networkData, width, height, onNodeClick, onLinkClick]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Systemic Risk Network
          </h3>
          <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
            simulationRunning ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'
          }`}>
            <Activity className="w-3 h-3" />
            <span>{simulationRunning ? 'Simulating' : 'Static'}</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span>Financial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Supply Chain</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Economic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span>Government</span>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-auto"
          style={{ background: '#fafafa' }}
        />
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{selectedNode.name}</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div>Category: {selectedNode.category.replace('_', ' ')}</div>
            <div>Risk Level: {selectedNode.riskLevel}%</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    selectedNode.riskLevel < 30 ? 'bg-green-500' :
                    selectedNode.riskLevel < 60 ? 'bg-yellow-500' :
                    selectedNode.riskLevel < 80 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedNode.riskLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-white border rounded-lg">
          <div className="text-lg font-semibold text-gray-900">{networkData.nodes.length}</div>
          <div className="text-xs text-gray-600">Entities</div>
        </div>
        <div className="p-3 bg-white border rounded-lg">
          <div className="text-lg font-semibold text-gray-900">{networkData.links.length}</div>
          <div className="text-xs text-gray-600">Connections</div>
        </div>
        <div className="p-3 bg-white border rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {networkData.nodes.length > 0 
              ? Math.round(networkData.nodes.reduce((sum, n) => sum + n.riskLevel, 0) / networkData.nodes.length)
              : 0}%
          </div>
          <div className="text-xs text-gray-600">Avg Risk</div>
        </div>
      </div>
    </div>
  );
}