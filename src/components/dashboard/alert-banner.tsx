import { useMemo } from 'react';
import { GeriResponse } from '../../lib/api';

export default function AlertBanner({ geri }: { geri: GeriResponse | undefined }) {
  const alert = useMemo(() => {
    if (!geri) return null;
    if (geri.band === 'critical') return 'Critical alert: escalate to risk committee';
    if (geri.band === 'high') return 'High risk: monitor alerts and issue RRIO daily note';
    return null;
  }, [geri]);

  if (!alert) return null;
  return (
    <div className="rounded-xl border border-[#FFC400] bg-[#FFF8E1] p-4 text-sm" aria-label="Alert">
      {alert}
    </div>
  );
}
