import { GeriResponse } from '../../lib/api';
import GERICard from './geri-card';
import RegimeCard from '../regime-card';
import AlertBanner from './alert-banner';

export default function OverviewSection({ geri, narrative, regime }: { geri: GeriResponse | undefined; narrative: string; regime: any }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <GERICard data={geri} narrative={narrative} />
      <RegimeCard regime={regime} />
      <AlertBanner geri={geri} />
    </section>
  );
}
