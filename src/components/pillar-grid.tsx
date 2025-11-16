import { Driver } from '../lib/api';

const PILLAR_MAP: Record<string, 'Finance' | 'Supply Chain' | 'Macro'> = {
  VIX: 'Finance',
  CREDIT_SPREAD: 'Finance',
  PMI: 'Supply Chain',
  OIL: 'Macro',
};

export default function PillarGrid({ drivers }: { drivers: Driver[] | undefined }) {
  if (!drivers) return null;
  const grouped = drivers.reduce<Record<string, Driver[]>>((acc, driver) => {
    const pillar = PILLAR_MAP[driver.component] || 'Macro';
    acc[pillar] = acc[pillar] || [];
    acc[pillar].push(driver);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(grouped).map(([pillar, entries]) => (
        <div key={pillar} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h4 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>{pillar} Pillar</h4>
          <ul className="mt-2 text-sm">
            {entries.map((entry) => (
              <li key={entry.component} className="flex justify-between">
                <span>{entry.component}</span>
                <span>{entry.contribution}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
