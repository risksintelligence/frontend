import { Driver } from '../../lib/api';
import { semanticColors } from '../../lib/theme';

interface PillarProps {
  title: string;
  drivers: Driver[];
}

export default function ComponentPillar({ title, drivers }: PillarProps) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label={`${title} pillar`}>
      <h4 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>{title}</h4>
      <ul className="mt-2 text-sm">
        {drivers.map((driver) => (
          <li key={driver.component} className="flex justify-between text-[#475569]">
            <span>{driver.component}</span>
            <span>{driver.contribution}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[#94a3b8]">Source: /api/v1/analytics/geri · Updated snapshot</p>
    </div>
  );
}
