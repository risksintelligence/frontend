interface AttributionEntry {
  provider: string;
  license: string;
}

export default function AttributionTable({ entries }: { entries: AttributionEntry[] }) {
  if (!entries?.length) return null;
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">Data Attribution</h3>
      <table className="mt-2 w-full text-sm">
        <thead className="text-[#64748b]">
          <tr>
            <th className="text-left">Provider</th>
            <th className="text-left">License / Notes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.provider} className="border-t border-[#e2e8f0]">
              <td>{entry.provider}</td>
              <td className="text-xs text-[#475569]">{entry.license}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
