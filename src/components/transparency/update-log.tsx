interface UpdateLogEntry {
  date: string;
  description: string;
}

export default function UpdateLog({ entries }: { entries: UpdateLogEntry[] }) {
  if (!entries?.length) return null;
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <h3 className="text-sm uppercase text-[#64748b]">Update Log</h3>
      <ul className="mt-2 text-sm text-[#475569]">
        {entries.map((entry) => (
          <li key={entry.date} className="border-b border-[#e2e8f0] py-2">
            <p className="text-xs text-[#94a3b8]">{entry.date}</p>
            <p>{entry.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
