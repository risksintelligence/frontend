# Frontend TODO — Audit Remediation

## 1. Semantic Color System (Critical)
- [ ] Add `src/lib/theme.ts` with documented semantic colors
- [ ] Update Tailwind/global CSS to use semantic variables
- [ ] Apply semantic colors to GRII cards, drivers, anomaly, mission components

## 2. Dashboard Spec Compliance (Critical)
- [ ] Restructure dashboard cards per spec (top row: GRII + freshness + alerts)
- [ ] Implement pillar grouping (Finance/Supply Chain/Macro) with z-scores
- [ ] Add forecast panel with confidence bands & sparkline
- [ ] Enhance anomaly ledger with severity sorting + classification tags
- [ ] Add data freshness meter card referencing `/transparency/data-freshness`

## 3. Editorial / Bloomberg Style (Critical)
- [ ] Generate narrative text blocks with professional tone (GRII lead, drivers, regime summary)
- [ ] Embed timestamp/source attribution lines on each card
- [ ] Add callouts for regime transitions and anomalies using financial verbs

## 4. Authentication & Security
- [ ] Implement auth context for reviewer/admin routes (JWT handling)
- [ ] Support API key/JWT headers in `api.ts`
- [ ] Gate `/community/admin` route behind auth

## 5. Error Handling & Loading States
- [ ] Create skeleton/loading components for all cards
- [ ] Add error boundary + ErrorMessage component with retry options
- [ ] Implement SWR error UI and offline awareness

## 6. Accessibility & Typography
- [ ] Define Bloomberg terminal typography scale in `globals.css`
- [ ] Add ARIA labels, roles, and focus states to cards/nav
- [ ] Ensure color contrast meets WCAG AA (update text colors)
- [ ] Add keyboard navigation/focus management in nav and cards

## 7. Performance Enhancements
- [ ] Lazy-load heavy components (charts, mission highlight)
- [ ] Add React memoization(useMemo/useCallback) to prevent rerenders
- [ ] Integrate Next.js image optimization where applicable

## 8. Testing & Monitoring
- [ ] Add unit tests (Jest) for components and hooks
- [ ] Extend Playwright coverage (error states, auth, submissions)
- [ ] Add accessibility testing (axe) and performance monitoring hooks

## 9. SEO & Meta
- [ ] Add dynamic meta tags per page (Open Graph, JSON-LD)
- [ ] Configure Next.js Head metadata per spec

## 10. Newsletter/Senario Integration UI
- [ ] Add newsletter status widget showing last draft status
- [ ] Hook scenario prompts into UI (optional)
