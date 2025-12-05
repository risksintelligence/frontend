/* 
 * Better World Map Implementation using React Simple Maps
 * This provides accurate, real-world geography data
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// First install these packages:
// npm install react-simple-maps
// npm install world-atlas

/*
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  Line,
  Sphere,
  Graticule
} from "react-simple-maps";
*/

// For now, here's the structure you'll use once packages are installed:

interface WorldMapProps {
  data: unknown; // Your supply chain data
  width?: number;
  height?: number;
}

const WorldMapWithRealGeography: React.FC<WorldMapProps> = ({ 
  data, 
  width = 1000, 
  height = 500 
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Once react-simple-maps is installed, replace this placeholder:
  return (
    <div className="w-full h-full bg-blue-50">
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Real World Map Implementation
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>To use accurate world geography, install these packages:</p>
          <div className="bg-gray-100 p-3 rounded font-mono text-xs">
            <div>npm install react-simple-maps</div>
            <div>npm install world-atlas</div>
            <div>npm install topojson-client</div>
          </div>
          
          <p className="mt-4 font-semibold">Benefits of using React Simple Maps:</p>
          <ul className="text-left max-w-md mx-auto space-y-1">
            <li>✅ Accurate Natural Earth geographic data</li>
            <li>✅ Multiple detail levels (110m, 50m, 10m)</li>
            <li>✅ Proper map projections (Mercator, Robinson, etc.)</li>
            <li>✅ Country boundaries and coastlines</li>
            <li>✅ Built-in zoom and pan functionality</li>
            <li>✅ Customizable styling and interactions</li>
          </ul>
        </div>
      </div>

      {/* Placeholder showing what the real implementation will look like */}
      <div className="mt-8 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded">
        <h4 className="font-bold mb-2">Implementation Preview:</h4>
        <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`<ComposableMap
  projection="geoMercator"
  projectionConfig={{
    scale: 140,
    center: [0, 20]
  }}
>
  <Sphere stroke="#E4E5E7" strokeWidth={0.5} />
  <Graticule stroke="#E4E5E7" strokeWidth={0.5} />
  
  <Geographies geography="/world-110m.json">
    {({ geographies }) =>
      geographies.map((geo) => (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill="#D6D6DA"
          stroke="#FFFFFF"
          strokeWidth={0.5}
          style={{
            default: { fill: "#D6D6DA" },
            hover: { fill: "#F53E3E" },
            pressed: { fill: "#E42" }
          }}
          onClick={() => setSelectedCountry(geo.properties.NAME)}
        />
      ))
    }
  </Geographies>
  
  {/* Your supply chain nodes */}
  {data.nodes.map((node) => (
    <Marker key={node.id} coordinates={[node.lng, node.lat]}>
      <circle r={4} fill="#F53E3E" />
    </Marker>
  ))}
  
  {/* Your trade routes */}
  {data.edges.map((edge) => {
    const fromNode = data.nodes.find(n => n.id === edge.from);
    const toNode = data.nodes.find(n => n.id === edge.to);
    return (
      <Line
        key={edge.id}
        from={[fromNode.lng, fromNode.lat]}
        to={[toNode.lng, toNode.lat]}
        stroke="#FF6B6B"
        strokeWidth={2}
        strokeLinecap="round"
      />
    );
  })}
</ComposableMap>`}
        </pre>
      </div>
    </div>
  );

  // Here's what the real implementation would look like:
  /*
  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{
        scale: 140,
        center: [0, 20]
      }}
      width={width}
      height={height}
    >
      <Sphere stroke="#E4E5E7" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E7" strokeWidth={0.5} />
      
      <Geographies geography="https://unpkg.com/world-atlas@3.0.0/world/110m.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
              strokeWidth={0.5}
              style={{
                default: { 
                  fill: "#EAEAEC",
                  outline: "none" 
                },
                hover: { 
                  fill: "#F53E3E",
                  outline: "none" 
                },
                pressed: { 
                  fill: "#E42",
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
      
      // Add your supply chain visualizations here
      {data.nodes.map((node) => (
        <Marker key={node.id} coordinates={[node.lng, node.lat]}>
          <circle r={6} fill="#F53E3E" stroke="#FFFFFF" strokeWidth={2} />
        </Marker>
      ))}
      
      {data.edges.map((edge, i) => {
        const fromNode = data.nodes.find(n => n.id === edge.from);
        const toNode = data.nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        
        return (
          <Line
            key={i}
            from={[fromNode.lng, fromNode.lat]}
            to={[toNode.lng, toNode.lat]}
            stroke="#FF6B6B"
            strokeWidth={Math.max(1, edge.flow * 3)}
            strokeLinecap="round"
            strokeDasharray={edge.congestion > 0.5 ? "5,5" : "none"}
          />
        );
      })}
    </ComposableMap>
  );
  */
};

export default WorldMapWithRealGeography;
