import { GeriResponse } from '../../lib/api';
import { getRiskBandClass, getRiskBandColor } from '../../lib/theme';

type HeroProps = {
  geri?: GeriResponse;
  regime?: { regime?: string };
};

const heroStatements = [
  'Ethical, explainable AI for systemic vigilance',
  'Cross-domain intelligence spanning finance + supply chain',
  'Provenance-first dashboards with semantic transparency hooks'
];

export default function HeroSection({ geri, regime }: HeroProps) {
  const bandClass = geri?.band ? getRiskBandClass(geri.band) : 'text-risk-moderate';
  const bandColor = geri?.band ? getRiskBandColor(geri.band) : '#FFD600';

  return (
    <header className="hero-panel" aria-label="RiskSX Observatory Overview">
      <div>
        <p className="hero-eyebrow">RiskSX Resilience Intelligence Observatory</p>
        <h1 className="hero-title">
          Global Resilience Intelligence Index
        </h1>
        <p className="hero-subtitle">
          Bloomberg-grade surveillance of macro, financial, and supply-chain stress with immutable semantic cues.
        </p>
        <ul className="hero-bullets">
          {heroStatements.map((statement) => (
            <li key={statement}>{statement}</li>
          ))}
        </ul>
      </div>
      <div className="hero-metrics">
        <div className="hero-score" style={{ borderColor: bandColor }}>
          <span className="hero-score-label">Current GRII</span>
          <div className="flex items-baseline gap-3">
            <span className={`hero-score-value ${bandClass}`}>{geri?.score ?? '--'}</span>
            <span className="hero-score-band capitalize">{geri?.band ?? 'loading'}</span>
          </div>
          <p className="hero-score-meta">
            {geri?.change_24h !== undefined
              ? `${geri.change_24h >= 0 ? '+' : ''}${geri.change_24h.toFixed(1)} pts | ${geri?.updated_at ? new Date(geri.updated_at).toLocaleString() : 'waiting'}`
              : 'Awaiting calculations'}
          </p>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Active Regime</p>
          <p className="hero-metric-value">{regime?.regime ?? 'Calm'}</p>
          <p className="hero-metric-footnote">Regime classifier w/ 5-year rolling training window</p>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Confidence Envelope</p>
          <p className="hero-metric-value">{geri?.confidence ? `${geri.confidence}%` : '85%'}</p>
          <p className="hero-metric-footnote text-terminal-muted">
            Semantic color indicates band thresholds & provenance
          </p>
        </div>
      </div>
    </header>
  );
}
