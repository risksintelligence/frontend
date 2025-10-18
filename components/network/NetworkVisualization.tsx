import React, { useState, useEffect, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Settings, Info } from 'lucide-react';
import { useNetworkAnalysis } from '../../hooks/useNetworkAnalysis';

interface NetworkVisualizationProps {
  apiUrl: string;
  height?: number;
  showControls?: boolean;
}

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  apiUrl,
  height = 400,
  showControls = true
}) => {
  const { networkAnalysis, loading, error, fetchNetworkAnalysis } = useNetworkAnalysis(apiUrl);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewSettings, setViewSettings] = useState({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    showLabels: true,
    showConnections: true,
    nodeSize: 8,
    highlightCentrality: false
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworkAnalysis();
  }, [fetchNetworkAnalysis]);

  useEffect(() => {
    if (networkAnalysis && canvasRef.current) {
      drawNetwork();
    }
  }, [networkAnalysis, viewSettings]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas || !networkAnalysis) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system
    ctx.save();
    ctx.translate(canvas.width / 2 + viewSettings.offsetX, canvas.height / 2 + viewSettings.offsetY);
    ctx.scale(viewSettings.zoom, viewSettings.zoom);

    // Draw connections (edges) first
    if (viewSettings.showConnections && networkAnalysis.edges) {
      networkAnalysis.edges.forEach(edge => {
        const sourceNode = networkAnalysis.nodes.find(n => n.id === edge.source);
        const targetNode = networkAnalysis.nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.position.x, sourceNode.position.y);
          ctx.lineTo(targetNode.position.x, targetNode.position.y);
          
          // Style based on edge strength
          const opacity = Math.max(0.1, edge.weight || 0.5);
          ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;
          ctx.lineWidth = Math.max(0.5, (edge.strength || 0.5) * 2);
          ctx.stroke();

          // Draw arrow for directed edges
          if (edge.direction === 'source_to_target') {
            drawArrow(ctx, sourceNode.position, targetNode.position, 5);
          }
        }
      });
    }

    // Draw nodes
    networkAnalysis.nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const radius = viewSettings.nodeSize * (node.size || 1);

      // Node styling based on type and centrality
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      // Color based on node type and centrality
      let fillColor = getNodeColor(node, viewSettings.highlightCentrality);
      if (selectedNode === node.id) {
        fillColor = '#3B82F6'; // Blue for selected
      }

      ctx.fillStyle = fillColor;
      ctx.fill();

      // Border
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = selectedNode === node.id ? 2 : 0.5;
      ctx.stroke();

      // Draw labels if enabled
      if (viewSettings.showLabels && viewSettings.zoom > 0.5) {
        ctx.fillStyle = '#1F2937';
        ctx.font = `${Math.max(8, 10 / viewSettings.zoom)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name,
          x,
          y + radius + 12
        );
      }
    });

    ctx.restore();
  };

  const getNodeColor = (node: any, highlightCentrality: boolean) => {
    if (highlightCentrality) {
      // Color based on centrality scores
      const maxCentrality = Math.max(
        node.centrality_scores?.betweenness || 0,
        node.centrality_scores?.closeness || 0,
        node.centrality_scores?.degree || 0,
        node.centrality_scores?.eigenvector || 0
      );
      
      if (maxCentrality > 0.8) return '#EF4444'; // Red for high centrality
      if (maxCentrality > 0.6) return '#F97316'; // Orange
      if (maxCentrality > 0.4) return '#EAB308'; // Yellow
      return '#10B981'; // Green for low centrality
    }

    // Color based on node type
    switch (node.type) {
      case 'economic': return '#3B82F6'; // Blue
      case 'financial': return '#8B5CF6'; // Purple
      case 'supply_chain': return '#10B981'; // Green
      case 'infrastructure': return '#F97316'; // Orange
      case 'regulatory': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, from: any, to: any, size: number) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    
    const arrowX = to.x - Math.cos(angle) * viewSettings.nodeSize;
    const arrowY = to.y - Math.sin(angle) * viewSettings.nodeSize;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - size * Math.cos(angle - Math.PI / 6),
      arrowY - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - size * Math.cos(angle + Math.PI / 6),
      arrowY - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !networkAnalysis) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left - canvas.width / 2 - viewSettings.offsetX;
    const clickY = event.clientY - rect.top - canvas.height / 2 - viewSettings.offsetY;

    // Adjust for zoom
    const scaledX = clickX / viewSettings.zoom;
    const scaledY = clickY / viewSettings.zoom;

    // Find clicked node
    const clickedNode = networkAnalysis.nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(scaledX - node.position.x, 2) + 
        Math.pow(scaledY - node.position.y, 2)
      );
      return distance <= viewSettings.nodeSize * (node.size || 1);
    });

    setSelectedNode(clickedNode ? clickedNode.id : null);
  };

  const handleZoomIn = () => {
    setViewSettings(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 5) }));
  };

  const handleZoomOut = () => {
    setViewSettings(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.2) }));
  };

  const handleReset = () => {
    setViewSettings(prev => ({ ...prev, zoom: 1, offsetX: 0, offsetY: 0 }));
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading network visualization...</span>
        </div>
      </div>
    );
  }

  if (error || !networkAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm" style={{ height }}>
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600">Network visualization unavailable</div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  const selectedNodeData = selectedNode ? 
    networkAnalysis.nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Network Visualization</h3>
              <p className="text-sm text-gray-600">
                Interactive network graph with {networkAnalysis.nodes?.length || 0} nodes
              </p>
            </div>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Canvas */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={height - 80}
            onClick={handleCanvasClick}
            className="cursor-pointer"
            style={{ width: '100%', height: height - 80 }}
          />
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="w-64 border-l border-gray-200 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Display Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={viewSettings.showLabels}
                      onChange={(e) => setViewSettings(prev => ({ ...prev, showLabels: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Show Labels</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={viewSettings.showConnections}
                      onChange={(e) => setViewSettings(prev => ({ ...prev, showConnections: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Show Connections</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={viewSettings.highlightCentrality}
                      onChange={(e) => setViewSettings(prev => ({ ...prev, highlightCentrality: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Highlight Centrality</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Size
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={viewSettings.nodeSize}
                  onChange={(e) => setViewSettings(prev => ({ ...prev, nodeSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Selected Node Info */}
              {selectedNodeData && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Node</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedNodeData.name}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedNodeData.type}
                    </div>
                    <div>
                      <span className="font-medium">Risk Level:</span> {selectedNodeData.risk_level?.toFixed(1)}%
                    </div>
                    {selectedNodeData.metadata && (
                      <>
                        <div>
                          <span className="font-medium">Importance:</span> {selectedNodeData.metadata.importance?.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Description:</span>
                          <div className="text-xs text-gray-600 mt-1">
                            {selectedNodeData.metadata.description}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Node Types</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Economic</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>Financial</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Supply Chain</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>Infrastructure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Regulatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Click nodes to select | Scroll to zoom | Drag to pan</span>
          </div>
          <div>
            Zoom: {(viewSettings.zoom * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};