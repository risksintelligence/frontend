'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const reviewerKey = process.env.NEXT_PUBLIC_REVIEWER_API_KEY!;

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load submissions');
  return res.json();
};

export default function AdminPage() {
  const { data } = useSWR(`${BASE_URL}/community/submissions`, fetcher);
  const [status, setStatus] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`${BASE_URL}/community/submissions/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RRIO-REVIEWER': reviewerKey,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setStatus('Failed to update');
      return;
    }
    mutate(`${BASE_URL}/community/submissions`);
    setStatus(`Submission ${id} marked ${newStatus}`);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Reviewer Control Center">
        <div>
          <p className="hero-eyebrow">RRIO Reviewer Panel</p>
          <h1 className="hero-title">Approve mission deliverables with semantic cues</h1>
          <p className="hero-subtitle">
            Each decision logs provenance and semantic risk references for award submissions and compliance.
          </p>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Queue Status</p>
          <p className="hero-metric-value">{data?.entries?.length ?? 0}</p>
          <p className="hero-metric-footnote">Submissions awaiting review</p>
        </div>
      </header>

      {status && <p className="text-xs text-[#94a3b8] mt-2">{status}</p>}

      <section className="mt-6 space-y-4">
        {data?.entries?.map((entry: any) => (
          <article key={entry.id} className="panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{entry.title}</h2>
                <p className="text-sm text-[#475569]">
                  By {entry.author} · {entry.mission}
                </p>
              </div>
              <span className="text-xs uppercase px-2 py-1 rounded border text-terminal-muted">{entry.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-terminal-muted">
              <span>Submitted {entry.submitted_at}</span>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <button className="btn-primary" onClick={() => updateStatus(entry.id, 'approved')}>
                Approve
              </button>
              <button className="btn-secondary" onClick={() => updateStatus(entry.id, 'rejected')}>
                Reject
              </button>
            </div>
          </article>
        ))}
        {(data?.entries?.length ?? 0) === 0 && (
          <p className="panel text-sm text-terminal-muted">No submissions.</p>
        )}
      </section>
    </main>
  );
}
