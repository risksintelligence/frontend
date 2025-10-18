/**
 * Risk Heatmap component for RiskX application
 * Professional risk visualization with sector and geographic breakdown
 */
import React, { useState, useEffect } from 'react';
import { ComponentErrorBoundary } from '../common/ErrorBoundary';
import { Loading } from '../common/Loading';

interface RiskData {
  sector: string;
  region: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
  lastUpdate: string;
}

interface RiskHeatmapProps {
  className?: string;
  viewMode?: 'sector' | 'geographic' | 'combined';
  onCellClick?: (data: RiskData) => void;
  apiUrl?: string;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  className = '',
  viewMode = 'sector',
  onCellClick,
  apiUrl = 'https://backend-1-il1e.onrender.com'
}) => {
  const [heatmapData, setHeatmapData] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<RiskData | null>(null);

  // Fetch real data from risk factors API
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        
        // Fetch risk factors from real API
        const response = await fetch(`${apiUrl}/api/v1/risk/factors`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch risk data');
        }
        
        const data = await response.json();
        
        // Transform risk factors into heatmap format
        const transformedData: RiskData[] = data.factors.map((factor: any, index: number) => {
          const sectors = ['Banking', 'Manufacturing', 'Technology', 'Energy', 'Healthcare', 'Retail'];
          const regions = ['Northeast', 'Midwest', 'West', 'South', 'Southeast', 'Southwest'];
          
          return {
            sector: sectors[index % sectors.length],
            region: regions[index % regions.length],
            riskScore: Math.round(factor.risk_contribution),
            riskLevel: factor.risk_level,
            factors: [factor.factor_name],
            lastUpdate: data.timestamp
          };
        });
        
        setHeatmapData(transformedData);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setHeatmapData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [apiUrl]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIntensity = (riskScore: number) => {
    const opacity = Math.min(Math.max(riskScore / 100, 0.1), 0.9);
    return { opacity };
  };

  const handleCellClick = (data: RiskData) => {
    setSelectedCell(data);
    onCellClick?.(data);
  };

  const sectors = [...new Set(heatmapData.map(d => d.sector))];
  const regions = [...new Set(heatmapData.map(d => d.region))];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-charcoal-gray">Risk Heatmap</h3>
        </div>
        <Loading variant="skeleton" />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-charcoal-gray">
              Risk Heatmap - {viewMode === 'sector' ? 'By Sector' : 'Geographic'}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Risk Level:</span>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 gap-1 min-w-max">
              {/* Header Row */}
              <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${regions.length}, 120px)` }}>
                <div className="p-2 text-xs font-medium text-gray-500 text-right">Sector</div>
                {regions.map(region => (
                  <div key={region} className="p-2 text-xs font-medium text-gray-500 text-center">
                    {region}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {sectors.map(sector => (
                <div key={sector} className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${regions.length}, 120px)` }}>
                  <div className="p-2 text-xs font-medium text-gray-700 text-right flex items-center justify-end">
                    {sector}
                  </div>
                  {regions.map(region => {
                    const cellData = heatmapData.find(d => d.sector === sector && d.region === region);
                    
                    if (!cellData) {
                      return (
                        <div key={`${sector}-${region}`} className="p-2 border border-gray-100 bg-gray-50 rounded text-center">
                          <span className="text-xs text-gray-400">N/A</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${sector}-${region}`}
                        className={`p-2 border cursor-pointer hover:shadow-md transition-all duration-200 rounded ${getRiskColor(cellData.riskLevel)} ${
                          selectedCell === cellData ? 'ring-2 ring-navy-blue' : ''
                        }`}
                        style={getRiskIntensity(cellData.riskScore)}
                        onClick={() => handleCellClick(cellData)}
                      >
                        <div className="text-center">
                          <div className="text-sm font-semibold">
                            {cellData.riskScore}
                          </div>
                          <div className="text-xs capitalize">
                            {cellData.riskLevel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Cell Details */}
        {selectedCell && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-charcoal-gray mb-3">
              {selectedCell.sector} - {selectedCell.region}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Risk Score:</span>
                <div className="mt-1">
                  <span className="text-lg font-semibold text-charcoal-gray">
                    {selectedCell.riskScore}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs capitalize ${getRiskColor(selectedCell.riskLevel)}`}>
                    {selectedCell.riskLevel}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Key Risk Factors:</span>
                <div className="mt-1">
                  {selectedCell.factors.map((factor, index) => (
                    <span key={index} className="inline-block bg-white px-2 py-1 rounded text-xs border mr-1 mb-1">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <div className="mt-1 text-gray-500">
                  {new Date(selectedCell.lastUpdate).toLocaleString()}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedCell(null)}
              className="mt-3 text-xs text-navy-blue hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-800">
              {heatmapData.filter(d => d.riskLevel === 'low').length}
            </div>
            <div className="text-xs text-green-600">Low Risk</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-800">
              {heatmapData.filter(d => d.riskLevel === 'moderate').length}
            </div>
            <div className="text-xs text-yellow-600">Moderate Risk</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-800">
              {heatmapData.filter(d => d.riskLevel === 'high').length}
            </div>
            <div className="text-xs text-orange-600">High Risk</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-800">
              {heatmapData.filter(d => d.riskLevel === 'critical').length}
            </div>
            <div className="text-xs text-red-600">Critical Risk</div>
          </div>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default RiskHeatmap;