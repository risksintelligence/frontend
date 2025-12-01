## RRIO Frontend Blueprint

Bloomberg-grade dashboard scaffold for the RiskX Resilience Intelligence Observatory (RRIO). Built with Next.js 14 App Router, Tailwind, JetBrains Mono typography, and `@tanstack/react-query`. Every card pulls data through a centralized real-time service so backend + ML outputs remain authoritative.

### Key Features
- Semantic color + typography tokens (`src/app/globals.css`, `src/lib/risk-colors.ts`).
- Shared data service in `src/services/realTimeDataService.ts` with fallbacks that mirror RRIO API endpoints (`/api/v1/analytics/geri`, `/api/v1/ai/regime/current`, `/api/v1/ai/forecast`, `/api/v1/network/topology`, `/api/v1/missions/highlights`, `/api/v1/newsroom/headlines`).
- Hooks (`src/hooks`) expose 30–60s polling for risk overview, economics, alerts, mission/newsroom, regime, forecast, and network data.
- Modular components for layout (nav/header/right rail), metrics, alerts, economic dashboards, explainability, regime probabilities, forecast panels, and network snapshots.

### Environment Setup
1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to your backend URL (e.g., `https://api.rrix.backend`).
2. Verify the backend returns payloads that match `src/lib/types.ts` (GRII overview, regime data, forecast data, RAS summary, transparency status, etc.). The UI surfaces warnings in the console if fallbacks are used.
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Lint: `npm run lint`

### Folder Structure Highlights
```
src/
  app/           # App Router + global providers
  components/
    layout/      # Navigation, header, right rail
    ui/          # MetricCard, StatusBadge, SkeletonLoader
    risk/        # GRII, alerts, regime panels
    analytics/   # Economic + forecast modules
    explainability/ # SHAP previews
    network/     # Network stress cards
  hooks/         # React Query hooks for each endpoint
  lib/           # Types + semantic color helpers
  services/      # Real-time data service with fallbacks
```

Wire this scaffold to the real RRIO backend, expand modules per `docs/architecture/frontend_architecture.md`, and the UI will remain synchronized with every ML + API surface.
