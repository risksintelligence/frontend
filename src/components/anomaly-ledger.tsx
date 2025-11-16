interface AnomalyProps {
  anomaly: { score?: number; classification?: string } | undefined;
}

export default function AnomalyLedger({ anomaly }: AnomalyProps) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">Anomaly Feed</h3>
      <p className="text-3xl font-bold">{anomaly?.score ?? '--'}</p>
      <p className="text-sm text-[#475569]">{anomaly?.classification ?? 'stable'}</p>
      <p className="mt-2 text-xs text-[#94a3b8]">
        Prompt analysts to explain anomalies via Scenario Studio when score &gt; 0.5.
      </p>
    </div>
  );
}
