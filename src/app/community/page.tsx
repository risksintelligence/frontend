'use client';

import { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import CommunityMetrics from '../../components/community/metrics';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load submissions');
  return res.json();
};

export default function CommunityPage() {
  const { data } = useSWR(`${BASE_URL}/community/submissions`, fetcher);
  const [form, setForm] = useState({ title: '', author: '', mission: '', link: '' });
  const [status, setStatus] = useState<string | null>(null);
  const metrics = useMemo(() => {
    const entries = data?.entries || [];
    return {
      total: entries.length,
      approved: entries.filter((entry: any) => entry.status === 'approved').length,
    };
  }, [data]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/community/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setStatus('Submission failed');
      return;
    }
    setStatus('Submission received');
    setForm({ title: '', author: '', mission: '', link: '' });
    mutate('submissions');
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="RRIO Community Hub">
        <div>
          <p className="hero-eyebrow">RRIO Community Missions</p>
          <h1 className="hero-title">Sector Missions & Insight Fellows</h1>
          <p className="hero-subtitle">Award-grade submissions curated with semantic color cues and provenance metadata.</p>
          <ul className="hero-bullets">
            <li>Submit AI transparency analyses and mission outputs</li>
            <li>Track reviewer queue, approvals, and provenance logs</li>
            <li>Public templates aligned to `SEMANTIC_COLOR_SYSTEM.md`</li>
          </ul>
        </div>
        <CommunityMetrics total={metrics.total} approved={metrics.approved} />
      </header>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <form onSubmit={submitForm} className="panel space-y-3" aria-label="Submission Form">
          <h2 className="section-label">Submit Analysis</h2>
          <p className="text-sm text-terminal-muted">All submissions inherit semantic risk references and provenance footers.</p>
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Mission" value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Link" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required />
          <button type="submit" className="btn-primary">Submit Mission Artifact</button>
          {status && <p className="text-xs text-[#94a3b8]">{status}</p>}
        </form>

        <div className="space-y-4">
          {(data?.entries || []).map((entry: any) => (
            <article key={entry.id} className="panel">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{entry.title}</h2>
                <span className="text-xs uppercase px-2 py-1 rounded border text-terminal-muted">
                  {entry.status}
                </span>
              </div>
              <p className="text-sm text-[#475569] mt-1">
                By {entry.author} · {entry.mission}
              </p>
              <a href={entry.link} target="_blank" rel="noreferrer" className="text-xs text-[#1e3a8a] underline mt-2 inline-block">View submission</a>
              <p className="mt-2 text-xs text-[#94a3b8]">Submitted at {entry.submitted_at}</p>
            </article>
          ))}
          {(data?.entries?.length ?? 0) === 0 && (
            <div className="panel text-sm text-terminal-muted">
              No submissions yet. Submitters should reference semantic color tokens and provenance footers per docs/style.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
