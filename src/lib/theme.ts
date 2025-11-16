export const semanticColors = {
  minimalRisk: '#00C853',
  lowRisk: '#64DD17', 
  moderateRisk: '#FFD600',
  highRisk: '#FFAB00',
  criticalRisk: '#D50000',
  anomaly: '#6200EA',
  supplyChainStress: '#0277BD',
  financialStress: '#1B5E20',
  macroPressure: '#BF360C',
} as const;

// Risk band mapping per GERI methodology
export const getRiskBandColor = (band: string): string => {
  const normalizedBand = band.toLowerCase();
  
  if (normalizedBand.includes('minimal') || normalizedBand === 'minimal') {
    return semanticColors.minimalRisk;
  }
  if (normalizedBand.includes('low') || normalizedBand === 'low') {
    return semanticColors.lowRisk;
  }
  if (normalizedBand.includes('moderate') || normalizedBand === 'moderate') {
    return semanticColors.moderateRisk;
  }
  if (normalizedBand.includes('high') || normalizedBand === 'high') {
    return semanticColors.highRisk;
  }
  if (normalizedBand.includes('critical') || normalizedBand === 'critical') {
    return semanticColors.criticalRisk;
  }
  
  // Default to moderate for unknown bands
  return semanticColors.moderateRisk;
};

// Tailwind class mapping
export const getRiskBandClass = (band: string): string => {
  const normalizedBand = band.toLowerCase();
  
  if (normalizedBand.includes('minimal') || normalizedBand === 'minimal') {
    return 'text-risk-minimal';
  }
  if (normalizedBand.includes('low') || normalizedBand === 'low') {
    return 'text-risk-low';
  }
  if (normalizedBand.includes('moderate') || normalizedBand === 'moderate') {
    return 'text-risk-moderate';
  }
  if (normalizedBand.includes('high') || normalizedBand === 'high') {
    return 'text-risk-high';
  }
  if (normalizedBand.includes('critical') || normalizedBand === 'critical') {
    return 'text-risk-critical';
  }
  
  return 'text-risk-moderate';
};

// Background class mapping
export const getRiskBandBgClass = (band: string): string => {
  return getRiskBandClass(band).replace('text-', 'bg-');
};
