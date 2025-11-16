interface ForecastProps {
  forecast: { delta?: number; p_gt_5?: number; confidence_interval?: number[] } | undefined;
}

export default function ForecastPanel({ forecast }: ForecastProps) {
  if (!forecast) return null;
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="Forecast panel">
      <h3 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>
        24h Forecast
      </h3>
      <p className="text-2xl font-bold">Δ {forecast.delta ?? '--'}</p>
      <p className="text-sm text-[#475569]">p(Δ &gt;5): {(forecast.p_gt_5 ?? 0) * 100}%</p>
      <p className="text-xs text-[#94a3b8]">
        Confidence interval: {forecast.confidence_interval?.[0]} to {forecast.confidence_interval?.[1]}
      </p>
    </div>
  );
}
