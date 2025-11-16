'use client';

import { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import CommunityMetrics from '../../components/community/metrics';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000/api/v1';

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
      <h1 className="text-2xl font-bold">Community Submissions</h1>
      <p className="text-sm text-[#475569]">Recent mission and fellowship contributions.</p>
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <form onSubmit={submitForm} className="space-y-3 rounded-xl border border-[#e2e8f0] bg-white p-4">
          <h2 className="text-sm uppercase text-[#64748b]">Submit Analysis</h2>
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Mission" value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} required />
          <input className="w-full rounded border border-[#e2e8f0] p-2" placeholder="Link" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required />
          <button type="submit" className="rounded bg-[#2563eb] px-3 py-2 text-white">Submit</button>
          {status && <p className="text-xs text-[#94a3b8]">{status}</p>}
        </form>
        <div className="space-y-4">
          <CommunityMetrics total={metrics.total} approved={metrics.approved} />
          {data?.entries?.map((entry: any) => (
            <article key={entry.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
              <h2 className="text-lg font-bold">{entry.title}</h2>
              <p className="text-sm text-[#475569]">
                By {entry.author} · {entry.mission} · <span className="uppercase text-xs">{entry.status}</span>
              </p>
              <a href={entry.link} target="_blank" rel="noreferrer" className="text-xs text-[#2563eb]">View submission</a>
              <p className="mt-2 text-xs text-[#94a3b8]">Submitted at {entry.submitted_at}</p>
            </article>
          )) || <p>No submissions yet.</p>}
        </div>
      </section>
    </main>
  );
}
