interface MetricsProps {
  total: number;
  approved: number;
}

export default function CommunityMetrics({ total, approved }: MetricsProps) {
  return (
    <div className="panel" aria-label="Community Metrics">
      <h3 className="section-label">Submission Metrics</h3>
      <dl className="mt-2 text-sm text-terminal-muted space-y-2">
        <div className="flex justify-between">
          <dt>Total submissions</dt>
          <dd className="font-semibold text-terminal-text">{total}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Approved</dt>
          <dd className="font-semibold text-risk-minimal">{approved}</dd>
        </div>
      </dl>
    </div>
  );
}
