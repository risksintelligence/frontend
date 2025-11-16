import { useState } from 'react';
import { semanticColors } from '../lib/theme';

interface Scenario {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published';
  created_at: string;
  contributor?: string;
}

interface Props {
  anomalyScore?: number;
  currentRegime?: string;
  recentScenarios?: Scenario[];
  onSubmitScenario?: (scenario: { title: string; description: string }) => void;
}

const defaultScenarios: Scenario[] = [
  {
    id: '1',
    title: 'Supply Chain Congestion Analysis',
    description: 'West Coast port delays driving logistics stress',
    status: 'published',
    created_at: '2024-11-15',
    contributor: 'Analysis Team'
  },
  {
    id: '2', 
    title: 'Credit Spread Divergence',
    description: 'IG-HY spread differential suggests regime transition',
    status: 'reviewed',
    created_at: '2024-11-14'
  }
];

export default function ScenarioStudioPrompt({ 
  anomalyScore = 0.3,
  currentRegime = 'Calm',
  recentScenarios = defaultScenarios,
  onSubmitScenario
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newScenario, setNewScenario] = useState({ title: '', description: '' });

  const shouldPromptContribution = anomalyScore > 0.5 || currentRegime !== 'Calm';

  const getStatusColor = (status: Scenario['status']) => {
    switch (status) {
      case 'published': return semanticColors.minimalRisk;
      case 'reviewed': return semanticColors.moderateRisk;
      case 'submitted': return semanticColors.highRisk;
      case 'draft': return '#64748b';
    }
  };

  const handleSubmit = () => {
    if (newScenario.title && newScenario.description) {
      onSubmitScenario?.(newScenario);
      setNewScenario({ title: '', description: '' });
      setIsCreating(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          Scenario Studio
        </h3>
        <div className="flex items-center gap-2">
          {shouldPromptContribution && (
            <span 
              className="text-xs px-2 py-1 rounded font-medium animate-pulse"
              style={{ 
                backgroundColor: semanticColors.anomaly + '20',
                color: semanticColors.anomaly
              }}
            >
              Contribution Needed
            </span>
          )}
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-xs px-2 py-1 rounded bg-[#1e3a8a] text-white hover:bg-[#1e40af]"
          >
            {isCreating ? 'Cancel' : '+ New'}
          </button>
        </div>
      </div>

      {shouldPromptContribution && !isCreating && (
        <div 
          className="mb-3 p-3 rounded border-l-4"
          style={{ 
            borderLeftColor: semanticColors.anomaly,
            backgroundColor: semanticColors.anomaly + '10'
          }}
        >
          <p className="text-sm" style={{ color: semanticColors.anomaly }}>
            <strong>High anomaly detected</strong> ({anomalyScore.toFixed(2)}) in {currentRegime} regime. 
            Community explanations help improve GRII methodology.
          </p>
        </div>
      )}

      {isCreating && (
        <div className="space-y-3 mb-4 border border-[#e2e8f0] rounded p-3">
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">
              Scenario Title
            </label>
            <input
              type="text"
              value={newScenario.title}
              onChange={(e) => setNewScenario(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 'VIX spike driven by geopolitical tensions'"
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1">
              Analysis & Explanation
            </label>
            <textarea
              value={newScenario.description}
              onChange={(e) => setNewScenario(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Explain the drivers, context, and implications for GRII components..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!newScenario.title || !newScenario.description}
              className="px-3 py-1 text-xs rounded bg-[#1e3a8a] text-white hover:bg-[#1e40af] disabled:opacity-50"
            >
              Submit Analysis
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 text-xs rounded border border-[#d1d5db] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#475569]">Recent Community Analyses</h4>
        
        <div className="space-y-2">
          {recentScenarios.slice(0, 3).map((scenario) => (
            <div 
              key={scenario.id}
              className="flex items-start justify-between p-2 rounded bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              onClick={() => window.open(`/scenario/${scenario.id}`, '_blank')}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(scenario.status) }}
                  />
                  <span className="text-sm font-medium text-[#0f172a]">
                    {scenario.title}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] mt-1">
                  {scenario.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-1">
                  <span>{new Date(scenario.created_at).toLocaleDateString()}</span>
                  {scenario.contributor && (
                    <>
                      <span>•</span>
                      <span>{scenario.contributor}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{scenario.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">
              Community-driven explanations improve GRII methodology
            </span>
            <button 
              className="underline hover:no-underline text-[#1e3a8a]"
              onClick={() => window.open('/scenarios', '_blank')}
            >
              View All →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}