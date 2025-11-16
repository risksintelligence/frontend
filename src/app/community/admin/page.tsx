'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000/api/v1';
const reviewerKey = process.env.NEXT_PUBLIC_REVIEWER_API_KEY || '';

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
      <h1 className="text-2xl font-bold">Reviewer Dashboard</h1>
      <p className="text-sm text-[#475569]">Approve or reject community submissions.</p>
      {status && <p className="text-xs text-[#94a3b8]">{status}</p>}
      <section className="mt-4 space-y-4">
        {data?.entries?.map((entry: any) => (
          <article key={entry.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <h2 className="text-lg font-bold">{entry.title}</h2>
            <p className="text-sm text-[#475569]">
              By {entry.author} · {entry.mission} · <span className="uppercase text-xs">{entry.status}</span>
            </p>
            <div className="mt-2 space-x-2 text-xs">
              <button className="rounded bg-[#16a34a] px-3 py-1 text-white" onClick={() => updateStatus(entry.id, 'approved')}>
                Approve
              </button>
              <button className="rounded bg-[#dc2626] px-3 py-1 text-white" onClick={() => updateStatus(entry.id, 'rejected')}>
                Reject
              </button>
            </div>
          </article>
        )) || <p>No submissions.</p>}
      </section>
    </main>
  );
}
