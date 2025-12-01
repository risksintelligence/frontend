 "use client";

import MainLayout from "@/components/layout/MainLayout";
import RasWidget from "@/components/product/RasWidget";
import { useMissionHighlights } from "@/hooks/useMissionHighlights";
import { useRasSummary } from "@/hooks/useRasSummary";

export default function MissionsPage() {
  const { data } = useMissionHighlights();
  const { data: rasData } = useRasSummary();

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Missions & Partners
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Activation Dashboard
          </h1>
          <p className="text-sm text-terminal-muted">
            RAS metrics, mission highlights, and partner timelines from `/api/v1/missions/highlights`.
          </p>
        </header>
        <RasWidget />
        <section className="terminal-card space-y-3">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Mission Highlights
          </p>
          {data?.map((mission) => (
            <article key={mission.id} className="rounded border border-terminal-border bg-terminal-bg p-3">
              <p className="text-sm font-semibold text-terminal-text">
                {mission.title}
              </p>
              <p className="text-xs text-terminal-muted">
                Status: {mission.status.toUpperCase()} · {mission.metric}
              </p>
              <p className="text-[11px] text-terminal-muted">
                Updated {new Date(mission.updatedAt).toLocaleString()}
              </p>
            </article>
          ))}
          {!data?.length && (
            <p className="text-xs text-terminal-muted">
              Connect `/api/v1/missions/highlights` for mission timelines.
            </p>
          )}
        </section>

        <section className="terminal-card space-y-3">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Partner Timeline
          </p>
          {rasData?.partners ? (
            <ul className="space-y-2 text-xs text-terminal-text">
              {rasData.partners.map((partner) => (
                <li key={partner} className="rounded border border-terminal-border bg-terminal-bg px-3 py-2">
                  {partner} — aligned to next activation milestone.
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-terminal-muted">
              Partners populate from RAS summary once backend is connected.
            </p>
          )}
        </section>
      </main>
    </MainLayout>
  );
}
