import { useState } from 'react';
import { semanticColors } from '../lib/theme';
import useSWR from 'swr';
import { api } from '../lib/api';

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
}

// Backend API interfaces
interface BackendNewsletterStatus {
  daily_flash: {
    status: string;
    last_published: string;
    next_scheduled: string;
    draft_preview: {
      headline: string;
      geri_score: number;
      risk_band: string;
      key_drivers: string[];
      confidence: number;
    };
  };
  weekly_brief: {
    status: string;
    last_published: string;
    next_scheduled: string;
    draft_topics: string[];
  };
  subscription_stats: {
    total_subscribers: number;
    weekly_growth: string;
    engagement_rate: number;
  };
  automation_status: {
    daily_automation: boolean;
    weekly_automation: boolean;
    last_automation_run: string;
  };
  generated_at: string;
}

interface Props {
  subscription?: NewsletterSubscription;
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
  onSubscribe,
  onUnsubscribe 
}: Props) {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState(subscription.preferences);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch newsletter status from backend
  const { data: newsletterData, error } = useSWR<BackendNewsletterStatus>(
    'newsletter-status',
    () => api.getNewsletterStatus(),
    { refreshInterval: 300000 } // Refresh every 5 minutes
  );

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'subscribed': return semanticColors.minimalRisk;
      case 'pending': return semanticColors.moderateRisk;
      case 'unsubscribed': return '#64748b';
    }
  };

  const getStatusText = () => {
    switch (subscription.status) {
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
          {newsletterData ? `${newsletterData.subscription_stats.total_subscribers} Subscribers` : getStatusText()}
        </span>
      </div>

      {/* Newsletter Preview Section */}
      {newsletterData && (
        <div className="mb-4 p-3 bg-[#f8fafc] rounded border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-[#475569]">Latest Daily Flash</h4>
            <span className="text-xs text-[#64748b]">
              Next: {new Date(newsletterData.daily_flash.next_scheduled).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-medium text-[#0f172a] mb-1">
            {newsletterData.daily_flash.draft_preview.headline}
          </p>
          <p className="text-xs text-[#64748b]">
            GERI: {newsletterData.daily_flash.draft_preview.geri_score} ({newsletterData.daily_flash.draft_preview.risk_band})
            • Confidence: {Math.round(newsletterData.daily_flash.draft_preview.confidence * 100)}%
          </p>
        </div>
      )}

      {subscription.status === 'subscribed' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#475569]">
              {subscription.email || 'subscribed'}
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
                  onClick={() => onSubscribe?.(subscription.email || '', preferences)}
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

          {subscription.last_sent && (
            <p className="text-xs text-[#94a3b8]">
              Last brief sent: {new Date(subscription.last_sent).toLocaleDateString()}
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