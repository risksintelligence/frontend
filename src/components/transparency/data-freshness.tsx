interface Props {
  freshness: { component: string; status: string; lastUpdated: string }[];
}

const statusColor: Record<string, string> = {
  fresh: '#00C853',
  warning: '#FFD600',
  stale: '#D50000',
};

export default function DataFreshness({ freshness }: Props) {
  if (!freshness?.length) return null;
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">Data Freshness</h3>
      <ul className="mt-2 text-sm">
        {freshness.map((item) => (
          <li key={item.component} className="flex justify-between border-b border-[#e2e8f0] py-2">
            <span>{item.component}</span>
            <span className="text-xs" style={{ color: statusColor[item.status] || '#0f172a' }}>
              {item.status} · {item.lastUpdated}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
