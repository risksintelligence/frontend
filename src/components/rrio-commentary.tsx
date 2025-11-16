import { GeriResponse } from '../lib/api';
import { getRiskStyling } from '../lib/theme';

interface Props {
  geri: GeriResponse | undefined;
  regime: any;
  forecast: any;
}

function generateRRIOCommentary(geri: GeriResponse, regime: any, forecast: any): string {
  if (!geri) return 'Loading resilience intelligence...';
  
  const score = parseFloat(geri.score?.toString() || '0');
  const riskStyling = getRiskStyling(score);
  const band = geri.band?.toUpperCase() || 'MODERATE';
  const change = geri.change_24h || 0;
  const changeDirection = change >= 0 ? 'advanced' : 'declined';
  const changeAmount = Math.abs(change).toFixed(1);
  
  // Professional Bloomberg-style opening
  const opening = `Global Economic Resilience Index ${changeDirection} ${changeAmount} basis points to ${score.toFixed(1)} (${band} risk territory) during the current session`;
  
  // Enhanced driver analysis with financial terminology
  const topDrivers = geri.drivers?.slice(0, 3) || [];
  const driverAnalysis = topDrivers.length 
    ? topDrivers.map((driver, index) => {
        const component = driver.component.replace(/_/g, '-').toLowerCase();
        const impact = Math.abs(driver.impact || 0);
        const direction = (driver.impact || 0) > 0 ? 'pressuring' : 'supporting';
        const intensity = impact > 0.5 ? 'significantly' : impact > 0.2 ? 'moderately' : 'marginally';
        
        return `${component} ${direction} ${intensity} (${impact.toFixed(2)}bp impact)`;
      }).join(', with ')
    : 'mixed signals across risk pillars';

  // Regime-specific context
  const regimeAnalysis = regime?.regime 
    ? ` Market regime classifier indicates ${regime.regime.replace('_', ' ').toLowerCase()} conditions prevailing, with ${(regime.confidence * 100).toFixed(0)}% conviction.`
    : ' Current regime classification remains indeterminate.';

  // Forward-looking assessment
  const forecastGuidance = forecast?.direction === 'rising'
    ? 'Near-term indicators suggest continued upward pressure on systemic stress metrics.'
    : forecast?.direction === 'falling'
    ? 'Forward-looking models project easing stress conditions over the 24-48 hour horizon.'
    : 'Mixed cross-asset signals suggest range-bound resilience indicators ahead.';

  // Professional action guidance based on risk level
  const actionGuidance = getActionGuidance(score);
  
  const timeStamp = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'EST'
  });

  return `${opening}, driven by ${driverAnalysis}.${regimeAnalysis} ${forecastGuidance} ${actionGuidance} (Updated ${timeStamp} EST)`;
}

function getActionGuidance(score: number): string {
  if (score >= 80) return 'Risk managers should implement defensive positioning across portfolios immediately.';
  if (score >= 60) return 'Heightened monitoring of cross-asset correlations and liquidity conditions recommended.';
  if (score >= 40) return 'Portfolio stress-testing and scenario analysis warranted for emerging vulnerabilities.';
  if (score >= 20) return 'Standard risk protocols remain appropriate under current conditions.';
  return 'Favorable environment for selective risk-taking in targeted asset classes.';
}

export default function RRIOCommentary({ geri, regime, forecast }: Props) {
  if (!geri) return null;
  
  const commentary = generateRRIOCommentary(geri, regime, forecast);
  const riskStyling = getRiskStyling(parseFloat(geri.score?.toString() || '0'));
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Bloomberg-style header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 border border-white rounded-sm"></div>
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold text-slate-900 uppercase tracking-wide">
                RRIO INTELLIGENCE BRIEF
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Real-time economic resilience analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              LIVE
            </span>
            <span className={`text-xs font-mono px-2 py-1 rounded-full border ${riskStyling.bgColor} ${riskStyling.textColor} ${riskStyling.borderColor}`}>
              {riskStyling.level}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main commentary */}
      <div className="p-4">
        <p className="text-sm font-mono leading-relaxed text-slate-900 mb-4">
          {commentary}
        </p>
        
        {/* Key metrics summary */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 rounded border border-slate-200 mb-4">
          <div className="text-center">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
              Current Score
            </div>
            <div className={`text-lg font-mono font-bold ${riskStyling.textColor}`}>
              {parseFloat(geri.score?.toString() || '0').toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
              Confidence
            </div>
            <div className="text-lg font-mono font-bold text-slate-900">
              {Math.round(geri.confidence || 85)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-1">
              24H Change
            </div>
            <div className={`text-lg font-mono font-bold ${(geri.change_24h || 0) >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {(geri.change_24h || 0) >= 0 ? '+' : ''}{(geri.change_24h || 0).toFixed(1)}bp
            </div>
          </div>
        </div>
      </div>
      
      {/* Bloomberg-style footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="text-slate-600">
            <span className="text-slate-500">Source:</span> GRII v1 Analytics Engine
            <span className="mx-2 text-slate-400">•</span>
            <span className="text-slate-500">Updated:</span> {new Date().toLocaleString('en-US', { timeZone: 'EST' })} EST
          </div>
          <div className="flex gap-3">
            <button 
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
              onClick={() => window.open('/transparency', '_blank')}
            >
              Methodology
            </button>
            <button 
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
              onClick={() => window.open('/community', '_blank')}
            >
              Submit Analysis
            </button>
            <button 
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
              onClick={() => window.open('/api/v1/analytics/geri', '_blank')}
            >
              Raw Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}