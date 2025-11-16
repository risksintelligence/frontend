'use client';

import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';

export default function CommunicationPage() {
  const { data: newsletterStatus } = useMemoizedApi('newsletter-status', () => api.getNewsletterStatus());
  const { data: publishingCalendar } = useMemoizedApi('publishing-calendar', () => api.getPublishingCalendar());

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 font-mono text-[#0f172a]">
      <header className="hero-panel" aria-label="Communication Automation">
        <div>
          <p className="hero-eyebrow">RRIO Communications</p>
          <h1 className="hero-title">Daily Flash, Weekly Wrap, Special Reports</h1>
          <p className="hero-subtitle">Bloomberg-grade narrative engine with semantic colors, provenance, and automation logs.</p>
          <ul className="hero-bullets">
            <li>Daily Flash automation from `/communication/newsletter-status`</li>
            <li>Publishing calendar synced with Transparency Portal</li>
            <li>API endpoints available for Slack/email integrations</li>
          </ul>
        </div>
        <div className="hero-metric-card">
          <p className="hero-metric-label">Subscribers</p>
          <p className="hero-metric-value">{newsletterStatus?.subscription_metrics?.total_subscribers ?? '--'}</p>
          <p className="hero-metric-footnote">Active RRIO Intelligence Brief recipients</p>
        </div>
      </header>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="section-label">Daily Flash</h2>
          <p className="text-sm text-terminal-muted">Next send: {newsletterStatus?.daily_flash?.next_scheduled ?? 'pending'}</p>
        </div>
        <div className="panel">
          <h2 className="section-label">Weekly Wrap</h2>
          <p className="text-sm text-terminal-muted">Next send: {newsletterStatus?.weekly_wrap?.next_scheduled ?? 'pending'}</p>
        </div>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label">Publishing Calendar</h2>
        <p className="text-sm text-terminal-muted">Future events will be listed here once `/communication/publishing-calendar` provides data.</p>
      </section>

      <section className="mt-8 panel">
        <h2 className="section-label">API Endpoints</h2>
        <ul className="text-sm text-terminal-muted space-y-1">
          <li>`GET /communication/newsletter-status`</li>
          <li>`GET /communication/publishing-calendar`</li>
          <li>`POST /communication/newsletter/preview`</li>
        </ul>
      </section>
    </main>
  );
}
