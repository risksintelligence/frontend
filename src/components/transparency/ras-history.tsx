interface HistoryPoint {
  date: string;
  value: number;
}

export default function RASHistory({ history }: { history: HistoryPoint[] }) {
  if (!history?.length) return null;
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">RAS Trend</h3>
      <ul className="mt-2 text-sm">
        {history.map((point) => (
          <li key={point.date} className="flex justify-between border-b border-[#e2e8f0] py-1">
            <span>{point.date}</span>
            <span>{point.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[#94a3b8]">Future enhancement: sparkline chart.</p>
    </div>
  );
}
