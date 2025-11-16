import { useEffect, useState } from 'react';
import { semanticColors } from '../lib/theme';
import type { NewsletterStatusResponse } from '../lib/api';

interface NewsletterSubscription {
  email?: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  preferences: {
    daily_brief: boolean;
    weekly_analysis: boolean;
    anomaly_alerts: boolean;
    regime_shifts: boolean;
  };
  last_sent?: string;
  next_schedule?: string;
}

interface Props {
  subscription?: NewsletterSubscription;
  statusData?: NewsletterStatusResponse;
  onSubscribe?: (email: string, preferences: any) => void;
  onUnsubscribe?: () => void;
}

const defaultSubscription: NewsletterSubscription = {
  status: 'unsubscribed',
  preferences: {
    daily_brief: false,
    weekly_analysis: false,
    anomaly_alerts: false,
    regime_shifts: false
  }
};

export default function NewsletterStatus({ 
  subscription = defaultSubscription,
  statusData,
  onSubscribe,
  onUnsubscribe 
}: Props) {
  const derivedSubscription: NewsletterSubscription = statusData
    ? {
        status: 'subscribed',
        email: 'intel@risksx.org',
        preferences: {
          daily_brief: statusData.daily_flash.automation?.enabled ?? true,
          weekly_analysis: statusData.weekly_wrap.automation?.enabled ?? true,
          anomaly_alerts: true,
          regime_shifts: true
        },
        last_sent: statusData.daily_flash.last_published,
        next_schedule: statusData.daily_flash.next_scheduled
      }
    : subscription;

  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState(derivedSubscription.preferences);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPreferences(derivedSubscription.preferences);
  }, [statusData, subscription]);

  const getStatusColor = () => {
    switch (derivedSubscription.status) {
      case 'subscribed': return semanticColors.minimalRisk;
      case 'pending': return semanticColors.moderateRisk;
      case 'unsubscribed': return '#64748b';
    }
  };

  const getStatusText = () => {
    switch (derivedSubscription.status) {
      case 'subscribed': return 'Active Subscription';
      case 'pending': return 'Confirmation Pending';
      case 'unsubscribed': return 'Not Subscribed';
    }
  };

  const handleSubscribe = () => {
    if (email && onSubscribe) {
      onSubscribe(email, preferences);
      setIsEditing(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          RRIO Intelligence Brief
        </h3>
        <span 
          className="text-xs px-2 py-1 rounded font-medium"
          style={{ 
            backgroundColor: getStatusColor() + '20',
            color: getStatusColor()
          }}
        >
          {statusData?.subscription_metrics
            ? `${statusData.subscription_metrics.total_subscribers} Subscribers`
            : getStatusText()}
        </span>
      </div>

      {statusData && (
        <div className="grid gap-3 mb-4 md:grid-cols-2">
          <div className="rounded border border-[#e2e8f0] p-3">
            <p className="text-xs uppercase text-[#64748b] mb-1">Daily Flash</p>
            <p className="text-sm font-semibold text-[#0f172a]">{statusData.daily_flash.draft_preview.headline}</p>
            <p className="text-xs text-[#94a3b8] mt-1">
              Next send: {new Date(statusData.daily_flash.next_scheduled).toLocaleString()}
            </p>
          </div>
          <div className="rounded border border-[#e2e8f0] p-3">
            <p className="text-xs uppercase text-[#64748b] mb-1">Weekly Wrap</p>
            <p className="text-sm font-semibold text-[#0f172a]">{statusData.weekly_wrap.draft_preview.headline}</p>
            <p className="text-xs text-[#94a3b8] mt-1">
              Next send: {new Date(statusData.weekly_wrap.next_scheduled).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {derivedSubscription.status === 'subscribed' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#475569]">
              {derivedSubscription.email || 'subscribed'}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs underline hover:no-underline text-[#1e3a8a]"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing && (
            <div className="space-y-3 border-t border-[#e2e8f0] pt-3">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#475569]">Preferences</h4>
                {Object.entries(preferences).map(([key, enabled]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handlePreferenceChange(key as keyof typeof preferences)}
                      className="rounded"
                    />
                    <span className="text-[#64748b]">
                      {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
              onClick={() => onSubscribe?.(derivedSubscription.email || '', preferences)}
              className="px-3 py-1 text-xs rounded bg-[#1e3a8a] text-white hover:bg-[#1e40af]"
            >
              Update
            </button>
                <button
                  onClick={onUnsubscribe}
                  className="px-3 py-1 text-xs rounded border border-[#d1d5db] hover:bg-[#f9fafb]"
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          )}

          {derivedSubscription.last_sent && (
            <p className="text-xs text-[#94a3b8]">
              Last brief sent: {new Date(derivedSubscription.last_sent).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#475569]">
            Get Bloomberg-grade GRII analysis delivered to your inbox. 
            Daily briefs, anomaly alerts, and regime shift notifications.
          </p>

          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />

            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[#475569]">Subscribe to:</h4>
              {Object.entries(preferences).map(([key, enabled]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handlePreferenceChange(key as keyof typeof preferences)}
                    className="rounded"
                  />
                  <span className="text-[#64748b]">
                    {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubscribe}
              disabled={!email}
              className="w-full px-3 py-2 text-sm rounded bg-[#1e3a8a] text-white hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subscribe to RRIO Intelligence
            </button>
          </div>

          <p className="text-xs text-[#94a3b8]">
            Privacy-first • No spam • Unsubscribe anytime | 
            Powered by GERI v1 methodology
          </p>
        </div>
      )}
    </div>
  );
}
