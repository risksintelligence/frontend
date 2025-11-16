'use client';

import { useMemo, useState } from 'react';
import { Users, Award, FileText, TrendingUp } from 'lucide-react';
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
    <main className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              COMMUNITY HUB
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              Collaborative research, analysis submissions, and peer review
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          Community: <span className="text-emerald-600">ACTIVE</span>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Total Submissions
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {metrics.total}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            All time
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Approved
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 mb-1">
            {metrics.approved}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Published
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Review Queue
          </div>
          <div className="text-2xl font-mono font-bold text-amber-600 mb-1">
            {metrics.total - metrics.approved}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Pending
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Approval Rate
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}%
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Quality
          </div>
        </div>
      </div>

      {/* Community content */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-mono font-semibold text-slate-900 mb-1">
              SUBMIT ANALYSIS
            </h3>
            <p className="text-sm font-mono text-slate-500">
              Contribute research and analysis to the community
            </p>
          </div>
          <form onSubmit={submitForm} className="p-4 space-y-4" aria-label="Submission Form">
            <input 
              className="w-full rounded border border-slate-200 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              placeholder="Title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
            />
            <input 
              className="w-full rounded border border-slate-200 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              placeholder="Author" 
              value={form.author} 
              onChange={(e) => setForm({ ...form, author: e.target.value })} 
              required 
            />
            <input 
              className="w-full rounded border border-slate-200 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              placeholder="Mission" 
              value={form.mission} 
              onChange={(e) => setForm({ ...form, mission: e.target.value })} 
              required 
            />
            <input 
              className="w-full rounded border border-slate-200 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              placeholder="Link" 
              type="url" 
              value={form.link} 
              onChange={(e) => setForm({ ...form, link: e.target.value })} 
              required 
            />
            <button 
              type="submit" 
              className="w-full bg-pink-600 text-white px-4 py-2 rounded font-mono text-sm hover:bg-pink-700 transition-colors"
            >
              Submit Mission Artifact
            </button>
            {status && <p className="text-xs font-mono text-slate-500">{status}</p>}
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-mono font-semibold text-slate-900 mb-1">
              RECENT SUBMISSIONS
            </h3>
            <p className="text-sm font-mono text-slate-500">
              Community research and analysis contributions
            </p>
          </div>
          <div className="divide-y divide-slate-200">
            {(data?.entries || []).slice(0, 5).map((entry: any) => (
              <article key={entry.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono font-semibold text-slate-900">{entry.title}</h4>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full border uppercase ${
                    entry.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    entry.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {entry.status}
                  </span>
                </div>
                <p className="text-sm font-mono text-slate-600">By {entry.author}</p>
                {entry.mission && (
                  <p className="text-xs font-mono text-slate-500 mt-1">Mission: {entry.mission}</p>
                )}
                {entry.link && (
                  <a href={entry.link} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-600 hover:text-blue-800 underline hover:no-underline mt-2 inline-block transition-colors">
                    View submission
                  </a>
                )}
              </article>
            ))}
            {(!data?.entries || data.entries.length === 0) && (
              <div className="p-4 text-center text-slate-500 font-mono text-sm">
                No submissions yet. Be the first to contribute!
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
