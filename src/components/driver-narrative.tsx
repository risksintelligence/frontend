import { Driver } from '../lib/api';

function generateRichNarrative(drivers: Driver[]): string {
  if (!drivers?.length) return 'No driver data available for analysis.';
  
  const topDriver = drivers[0];
  const secondDriver = drivers[1];
  const totalDrivers = drivers.length;
  
  // Bloomberg-style financial language
  const verbMap: Record<string, string> = {
    'Credit Spreads': 'widened',
    'VIX': 'spiked',
    'Supply Chain': 'congested',
    'Yield Curve': 'inverted',
    'Energy': 'surged',
    'Currency': 'volatility intensified',
    'Commodity Prices': 'rallied',
    'Transport': 'disrupted'
  };
  
  const verb = verbMap[topDriver.component] || 'shifted';
  const impact = Math.abs(topDriver.impact || topDriver.contribution || 0);
  const direction = (topDriver.impact || topDriver.contribution || 0) > 0 ? 'pressuring' : 'supporting';
  
  let narrative = `${topDriver.component} ${verb}, ${direction} GRII by ${impact.toFixed(1)}bp amid`;
  
  if (secondDriver) {
    const secondVerb = verbMap[secondDriver.component] || 'moved';
    const secondImpact = Math.abs(secondDriver.impact || secondDriver.contribution || 0);
    narrative += ` ${secondDriver.component} ${secondVerb} (${secondImpact.toFixed(1)}bp).`;
  } else {
    narrative += ' mixed secondary signals.';
  }
  
  // Add context based on driver composition
  const financialDrivers = drivers.filter(d => 
    ['Credit Spreads', 'VIX', 'Yield Curve', 'Currency'].includes(d.component)
  ).length;
  
  const supplyDrivers = drivers.filter(d => 
    ['Supply Chain', 'Energy', 'Commodity Prices', 'Transport'].includes(d.component)
  ).length;
  
  if (financialDrivers > supplyDrivers) {
    narrative += ' Financial stress dominates current risk environment.';
  } else if (supplyDrivers > financialDrivers) {
    narrative += ' Supply-chain disruptions anchor risk dynamics.';
  } else {
    narrative += ' Balanced stress across financial and supply-chain vectors.';
  }
  
  narrative += ` Monitor ${totalDrivers > 3 ? 'multi-component' : 'concentrated'} risk topology for regime transitions.`;
  
  return narrative;
}

export default function DriverNarrative({ drivers }: { drivers: Driver[] | undefined }) {
  if (!drivers?.length) return null;

  const narrative = generateRichNarrative(drivers);

  return (
    <div className="mt-3 p-3 bg-[#f8fafc] rounded border-l-4" style={{ borderLeftColor: 'var(--terminal-accent)' }}>
      <h5 className="text-xs uppercase font-semibold text-[#64748b] mb-1">Driver Analysis</h5>
      <p className="text-sm text-[#475569] leading-relaxed">{narrative}</p>
      <p className="text-xs text-[#94a3b8] mt-2">
        RRIO Analyst Brief | Source: GERI v1 component attribution | {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
