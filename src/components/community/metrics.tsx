interface MetricsProps {
  total: number;
  approved: number;
}

export default function CommunityMetrics({ total, approved }: MetricsProps) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 text-sm">
      <h3 className="text-sm uppercase text-[#64748b]">Submission Metrics</h3>
      <p>Total submissions: {total}</p>
      <p>Approved: {approved}</p>
    </div>
  );
}
