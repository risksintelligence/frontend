# RiskX Frontend

Professional risk intelligence observatory frontend built with Next.js and TypeScript.

## Overview

RiskX Frontend is a comprehensive web application providing real-time risk intelligence, advanced analytics, and system monitoring capabilities. Built as a professional Bloomberg Terminal-inspired interface for financial institutions and supply chain operators.

## Features

- **Real-time Risk Dashboard** - Live risk monitoring and analytics
- **Network Analysis** - Centrality, vulnerability, and critical path analysis  
- **ML Explainability** - SHAP analysis and model transparency
- **Policy Simulation** - Monte Carlo and scenario modeling
- **System Monitoring** - Health diagnostics and performance tracking
- **Advanced Analytics** - Economic indicators and forecasting

## Technology Stack

- **Framework**: Next.js 14.2.33 with TypeScript
- **Styling**: Tailwind CSS with professional color scheme
- **Charts**: Chart.js, Recharts, D3.js
- **Icons**: Lucide React
- **Build**: Static export for CDN deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## Production Deployment

Configured for static site deployment on Render:

```bash
# Build command
npm ci && npm run build && npm run export

# Publish directory
./out
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://backend-1-il1e.onrender.com
NEXT_PUBLIC_APP_NAME=RiskX
NODE_ENV=production
```

## Architecture

- **19 Static Pages** - Pre-rendered for optimal performance
- **50+ Components** - Modular React architecture
- **15+ Hooks** - Comprehensive API integration
- **Real-time WebSocket** - Live data streaming
- **Type Safety** - Full TypeScript coverage

## Professional Standards

- Bloomberg Terminal-inspired design
- Navy blue (#1e3a8a) and charcoal gray (#374151) color scheme
- Financial industry terminology
- Enterprise-grade architecture
- No placeholder code - all functionality is complete

## License

MIT License