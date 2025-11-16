'use client';

import { Mail, Calendar, Send, Users } from 'lucide-react';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';

export default function CommunicationPage() {
  const { data: newsletterStatus } = useMemoizedApi('newsletter-status', () => api.getNewsletterStatus());
  const { data: publishingCalendar } = useMemoizedApi('publishing-calendar', () => api.getPublishingCalendar());

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Bloomberg-style header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              COMMUNICATION CENTER
            </h1>
            <p className="text-slate-500 font-mono text-sm">
              Automated intelligence briefings and publication management
            </p>
          </div>
        </div>
        <div className="text-slate-500 font-mono text-sm">
          Publishing: <span className="text-emerald-600">ACTIVE</span>
        </div>
      </div>

      {/* Communication metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Subscribers
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            {newsletterStatus?.subscription_metrics?.total_subscribers ?? '--'}
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Active
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Daily Flash
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 mb-1">
            AUTO
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Status
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Weekly Reports
          </div>
          <div className="text-2xl font-mono font-bold text-blue-600 mb-1">
            SCHED
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Status
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <div className="text-slate-500 font-mono text-xs mb-1 uppercase tracking-wide">
            Open Rate
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
            68.4%
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Average
          </div>
        </div>
      </div>

      {/* Publication sections */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                DAILY FLASH
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Next send: {newsletterStatus?.daily_flash?.next_scheduled ?? 'pending'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h3 className="font-mono font-semibold text-slate-900">
                WEEKLY WRAP
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-500">
              Next send: {newsletterStatus?.weekly_wrap?.next_scheduled ?? 'pending'}
            </p>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-mono font-semibold text-slate-900">
            API ENDPOINTS
          </h3>
          <p className="text-sm font-mono text-slate-500">
            Communication automation endpoints
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-2 py-1 rounded bg-slate-100 border border-slate-200">/communication/newsletter-status</code>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">GET</span>
              <code className="px-2 py-1 rounded bg-slate-100 border border-slate-200">/communication/publishing-calendar</code>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-semibold">POST</span>
              <code className="px-2 py-1 rounded bg-slate-100 border border-slate-200">/communication/newsletter/preview</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
