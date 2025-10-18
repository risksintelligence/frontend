export interface PolicyParameter {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  category: 'monetary' | 'fiscal' | 'regulatory' | 'trade';
  defaultValue: number;
  lastModified?: string;
}

export interface SimulationResult {
  policyId: string;
  originalValue: number;
  simulatedValue: number;
  impact: {
    gdpChange: number;
    inflationChange: number;
    unemploymentChange: number;
    marketStabilityChange: number;
  };
  riskFactors: {
    category: string;
    change: number;
    significance: 'low' | 'medium' | 'high';
  }[];
  timestamp: string;
}

export interface MonteCarloConfig {
  iterations: number;
  confidenceLevel: number;
  timeHorizon: number;
  shockType: 'economic' | 'financial' | 'supply_chain' | 'geopolitical';
  shockMagnitude: number;
  correlationMatrix?: number[][];
}

export interface MonteCarloResult {
  simulationId: string;
  config: MonteCarloConfig;
  results: {
    percentile_5: number;
    percentile_25: number;
    percentile_50: number;
    percentile_75: number;
    percentile_95: number;
    mean: number;
    stdDev: number;
    worstCase: number;
    bestCase: number;
  };
  iterations: Array<{
    iteration: number;
    riskScore: number;
    gdpImpact: number;
    inflationImpact: number;
    unemploymentImpact: number;
  }>;
  convergenceAnalysis: {
    converged: boolean;
    convergenceIteration: number;
    stabilityScore: number;
  };
  timestamp: string;
  executionTime: number;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'crisis_response' | 'growth_stimulus' | 'inflation_control' | 'stability_measures';
  parameters: PolicyParameter[];
  expectedOutcomes: string[];
  historicalUsage: Array<{
    date: string;
    context: string;
    effectiveness: number;
  }>;
  tags: string[];
}

export interface SimulationHistory {
  id: string;
  name: string;
  type: 'policy' | 'monte_carlo';
  parameters: any;
  results: SimulationResult[] | MonteCarloResult;
  createdAt: string;
  status: 'completed' | 'running' | 'failed';
  executionTime?: number;
  notes?: string;
}

export interface SimulationComparison {
  baselineId: string;
  comparisonIds: string[];
  metrics: Array<{
    name: string;
    baseline: number;
    comparisons: Array<{
      id: string;
      value: number;
      difference: number;
      percentageChange: number;
    }>;
  }>;
  summary: {
    bestPerforming: string;
    worstPerforming: string;
    recommendations: string[];
  };
}

export interface UseSimulationOptions {
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface UseSimulationResult {
  // State
  loading: boolean;
  error: string | null;
  
  // Data
  policyTemplates: PolicyTemplate[];
  simulationHistory: SimulationHistory[];
  monteCarloResults: MonteCarloResult | null;
  
  // Actions
  runPolicySimulation: (parameters: PolicyParameter[]) => Promise<SimulationResult[]>;
  runMonteCarloSimulation: (config: MonteCarloConfig) => Promise<MonteCarloResult>;
  loadPolicyTemplates: () => Promise<PolicyTemplate[]>;
  getSimulation: (simulationId: string) => Promise<SimulationHistory>;
  saveSimulation: (name: string, simulation: any) => Promise<string>;
  deleteSimulation: (simulationId: string) => Promise<void>;
  compareSimulations: (simulationIds: string[]) => Promise<SimulationComparison>;
  exportSimulation: (simulationId: string, format: 'json' | 'csv' | 'xlsx') => Promise<void>;
  clearError: () => void;
}