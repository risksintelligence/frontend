#!/bin/bash

echo "🗺️  Installing Real World Map Packages..."

# Option 1: React Simple Maps (Recommended)
echo "📦 Installing react-simple-maps..."
npm install react-simple-maps

# Geographic data
echo "🌍 Installing world-atlas for geographic data..."
npm install world-atlas

# TopoJSON utilities
echo "🔧 Installing topojson-client..."
npm install topojson-client

# Optional: D3 for advanced geo projections
echo "📐 Installing d3-geo for projections..."
npm install d3-geo d3-scale

# Optional: Types for TypeScript
echo "🔷 Installing TypeScript types..."
npm install --save-dev @types/topojson-client @types/d3-geo

echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run this script: chmod +x install-map-packages.sh && ./install-map-packages.sh"
echo "2. Replace the hardcoded SVG paths with the WorldMapWithRealGeography component"
echo "3. Download world geography data from: https://unpkg.com/world-atlas@3.0.0/world/110m.json"
echo ""
echo "🌟 Benefits of using real geographic data:"
echo "   • Accurate country shapes and coastlines"
echo "   • Multiple resolution levels (110m, 50m, 10m)"
echo "   • Proper map projections"
echo "   • Interactive zoom and pan"
echo "   • Easy to customize and style"