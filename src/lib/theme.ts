/**
 * RiskX Platform Semantic Color Theme System
 * 
 * This module provides the centralized color system for the RRIO platform,
 * implementing Bloomberg Terminal-inspired professional aesthetics with
 * semantic risk-based coloring throughout the application.
 */

// ========================
// CORE RISK LEVEL SYSTEM
// ========================

export interface RiskLevel {
  level: string;
  scoreRange: [number, number];
  color: 'green' | 'amber' | 'red';
  meaning: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  pattern?: string;
}

export const RISK_LEVELS: Record<string, RiskLevel> = {
  CRITICAL: { 
    level: 'CRITICAL', 
    scoreRange: [80, 100], 
    color: 'red', 
    meaning: 'Immediate action required',
    urgency: 'HIGH',
    pattern: '🔴'
  },
  HIGH: { 
    level: 'HIGH', 
    scoreRange: [60, 79], 
    color: 'red', 
    meaning: 'High attention needed',
    urgency: 'HIGH',
    pattern: '🔴'
  },
  MODERATE: { 
    level: 'MODERATE', 
    scoreRange: [40, 59], 
    color: 'amber', 
    meaning: 'Monitor closely',
    urgency: 'MEDIUM',
    pattern: '🟡'
  },
  LOW: { 
    level: 'LOW', 
    scoreRange: [20, 39], 
    color: 'green', 
    meaning: 'Acceptable risk',
    urgency: 'LOW',
    pattern: '🟢'
  },
  MINIMAL: { 
    level: 'MINIMAL', 
    scoreRange: [0, 19], 
    color: 'green', 
    meaning: 'Negligible risk',
    urgency: 'LOW',
    pattern: '🟢'
  }
};

// Legacy semantic colors for backward compatibility
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

// ========================
// SEMANTIC COLOR FUNCTIONS
// ========================

/**
 * Get risk level object from score
 */
export function getRiskLevel(score: number | null | undefined): RiskLevel {
  if (score === null || score === undefined || isNaN(score)) {
    return RISK_LEVELS.MODERATE;
  }
  
  for (const level of Object.values(RISK_LEVELS)) {
    if (score >= level.scoreRange[0] && score <= level.scoreRange[1]) {
      return level;
    }
  }
  
  return RISK_LEVELS.MODERATE;
}

/**
 * Get semantic text color class for risk scores
 */
export function getRiskTextColor(score: number | null | undefined): string {
  const riskLevel = getRiskLevel(score);
  switch (riskLevel.color) {
    case 'red': return 'text-red-600';
    case 'amber': return 'text-amber-600';
    case 'green': return 'text-emerald-600';
    default: return 'text-gray-500';
  }
}

/**
 * Get semantic background color class for risk scores
 */
export function getRiskBgColor(score: number | null | undefined): string {
  const riskLevel = getRiskLevel(score);
  switch (riskLevel.color) {
    case 'red': return 'bg-red-50';
    case 'amber': return 'bg-amber-50';
    case 'green': return 'bg-emerald-50';
    default: return 'bg-gray-50';
  }
}

/**
 * Get semantic border color class for risk scores
 */
export function getRiskBorderColor(score: number | null | undefined): string {
  const riskLevel = getRiskLevel(score);
  switch (riskLevel.color) {
    case 'red': return 'border-red-200';
    case 'amber': return 'border-amber-200';
    case 'green': return 'border-emerald-200';
    default: return 'border-gray-200';
  }
}

/**
 * Get hex color for charts and visualizations
 */
export function getRiskHexColor(score: number | null | undefined): string {
  const riskLevel = getRiskLevel(score);
  switch (riskLevel.color) {
    case 'red': return '#dc2626';
    case 'amber': return '#f59e0b';
    case 'green': return '#10b981';
    default: return '#6b7280';
  }
}

/**
 * Get progress bar color class for risk scores
 */
export function getRiskProgressColor(score: number | null | undefined): string {
  const riskLevel = getRiskLevel(score);
  switch (riskLevel.color) {
    case 'red': return 'bg-red-500';
    case 'amber': return 'bg-amber-500';
    case 'green': return 'bg-emerald-500';
    default: return 'bg-gray-400';
  }
}

// Legacy risk band functions for backward compatibility
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
  
  return semanticColors.moderateRisk;
};

export const getRiskBandClass = (band: string): string => {
  const normalizedBand = band.toLowerCase();
  
  if (normalizedBand.includes('minimal') || normalizedBand === 'minimal') {
    return 'text-emerald-600';
  }
  if (normalizedBand.includes('low') || normalizedBand === 'low') {
    return 'text-emerald-600';
  }
  if (normalizedBand.includes('moderate') || normalizedBand === 'moderate') {
    return 'text-amber-600';
  }
  if (normalizedBand.includes('high') || normalizedBand === 'high') {
    return 'text-red-600';
  }
  if (normalizedBand.includes('critical') || normalizedBand === 'critical') {
    return 'text-red-600';
  }
  
  return 'text-amber-600';
};

export const getRiskBandBgClass = (band: string): string => {
  return getRiskBandClass(band).replace('text-', 'bg-').replace('-600', '-50');
};

// ========================
// UTILITY FUNCTIONS
// ========================

/**
 * Format numbers with consistent decimal places
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Get complete risk styling for components
 */
export function getRiskStyling(score: number | null | undefined) {
  const level = getRiskLevel(score);
  
  return {
    level: level.level,
    textColor: getRiskTextColor(score),
    bgColor: getRiskBgColor(score),
    borderColor: getRiskBorderColor(score),
    progressColor: getRiskProgressColor(score),
    hexColor: getRiskHexColor(score),
    pattern: level.pattern,
    meaning: level.meaning,
    urgency: level.urgency
  };
}
