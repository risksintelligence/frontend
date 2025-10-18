import { useState, useCallback } from 'react';

export interface NetworkNode {
  id: string;
  name: string;
  type: 'economic' | 'financial' | 'supply_chain' | 'infrastructure' | 'regulatory';
  risk_level: number;
  centrality_scores: {
    betweenness: number;
    closeness: number;
    degree: number;
    eigenvector: number;
  };
  position: { x: number; y: number };
  size: number;
  color: string;
  metadata: {
    description: string;
    category: string;
    importance: number;
    vulnerability_score: number;
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: 'dependency' | 'correlation' | 'supply_chain' | 'financial_flow';
  strength: number;
  direction: 'bidirectional' | 'source_to_target' | 'target_to_source';
  metadata: {
    description: string;
    last_updated: string;
    confidence: number;
  };
}

export interface NetworkAnalysisResult {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  metrics: {
    total_nodes: number;
    total_edges: number;
    network_density: number;
    average_clustering_coefficient: number;
    network_diameter: number;
    average_path_length: number;
    modularity: number;
  };
  communities: Array<{
    id: string;
    name: string;
    nodes: string[];
    modularity_score: number;
  }>;
  last_updated: string;
}

export interface CentralityAnalysis {
  node_rankings: Array<{
    node_id: string;
    node_name: string;
    centrality_type: 'betweenness' | 'closeness' | 'degree' | 'eigenvector';
    score: number;
    rank: number;
    interpretation: string;
  }>;
  top_influential: string[];
  top_vulnerable: string[];
  critical_connectors: string[];
  analysis_date: string;
}

export interface VulnerabilityAssessment {
  vulnerability_scores: Array<{
    node_id: string;
    node_name: string;
    vulnerability_score: number;
    current_value: number;
    critical_threshold: number;
    threshold_proximity: number;
    systemic_impact: string;
    risk_factors: string[];
    mitigation_strategies: string[];
  }>;
  overall_vulnerability_score: number;
  most_vulnerable: Array<{
    node_id: string;
    node_name: string;
    vulnerability_score: number;
    current_value: number;
    systemic_impact: string;
  }>;
  category_analysis: Record<string, {
    avgVulnerabilityScore: number;
    nodeCount: number;
    totalVulnerability: number;
  }>;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  network_metrics: {
    total_nodes: number;
    avg_vulnerability: number;
    high_vulnerability_nodes: number;
    critical_nodes: number;
  };
  systemic_vulnerabilities: Array<{
    area: string;
    risk_level: string;
    description: string;
  }>;
  recommendations: string[];
  analysis_timestamp: string;
  methodology: {
    description: string;
    data_sources: string[];
    calculation_method: string;
  };
}

export interface CriticalPath {
  pathId: number;
  path: string[];
  pathDetails: Array<{
    nodeId: string;
    nodeName: string;
    category: string;
    riskLevel: number;
    currentValue: number;
    riskContribution: number;
    description: string;
  }>;
  avgRiskLevel: number;
  pathLength: number;
  criticalityScore: number;
  riskCategory: string;
  pathType: string;
  description: string;
  mechanism: string;
  totalRisk: number;
}

export interface ShockSimulation {
  simulation_id: string;
  shock_type: 'node_failure' | 'edge_disruption' | 'cascading_failure' | 'external_shock';
  target_nodes: string[];
  target_edges: string[];
  shock_magnitude: number;
  results: {
    affected_nodes: Array<{
      node_id: string;
      impact_score: number;
      recovery_time: number;
    }>;
    network_resilience: number;
    total_system_impact: number;
    cascade_depth: number;
    recovery_strategies: string[];
  };
  timestamp: string;
}

interface UseNetworkAnalysisOptions {
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseNetworkAnalysisResult {
  // State
  loading: boolean;
  error: string | null;
  
  // Data
  networkAnalysis: NetworkAnalysisResult | null;
  centralityAnalysis: CentralityAnalysis | null;
  vulnerabilityAssessment: VulnerabilityAssessment | null;
  criticalPaths: CriticalPath[];
  shockSimulation: ShockSimulation | null;
  
  // Actions
  fetchNetworkAnalysis: () => Promise<NetworkAnalysisResult>;
  fetchCentralityAnalysis: () => Promise<CentralityAnalysis>;
  fetchVulnerabilityAssessment: () => Promise<VulnerabilityAssessment>;
  fetchCriticalPaths: () => Promise<CriticalPath[]>;
  runShockSimulation: (config: {
    shockType: string;
    targetNodes: string[];
    magnitude: number;
  }) => Promise<ShockSimulation>;
  refreshNetworkData: () => Promise<void>;
  clearError: () => void;
}

export function useNetworkAnalysis(
  apiUrl: string,
  options: UseNetworkAnalysisOptions = {}
): UseNetworkAnalysisResult {
  const {
    onError,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkAnalysisResult | null>(null);
  const [centralityAnalysis, setCentralityAnalysis] = useState<CentralityAnalysis | null>(null);
  const [vulnerabilityAssessment, setVulnerabilityAssessment] = useState<VulnerabilityAssessment | null>(null);
  const [criticalPaths, setCriticalPaths] = useState<CriticalPath[]>([]);
  const [shockSimulation, setShockSimulation] = useState<ShockSimulation | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const makeRequest = useCallback(async <T>(
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Network analysis endpoint not found');
        }
        if (response.status === 503) {
          throw new Error('Network analysis service temporarily unavailable');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (attempt < retryAttempts && !(err instanceof Error && err.message.includes('404'))) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return makeRequest<T>(url, options, attempt + 1);
      }
      throw err;
    }
  }, [retryAttempts, retryDelay]);

  const handleError = useCallback((err: any, context: string) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    const fullError = new Error(`${context}: ${errorMessage}`);
    setError(fullError.message);
    onError?.(fullError);
    console.error(`Network analysis ${context} error:`, err);
  }, [onError]);

  const fetchNetworkAnalysis = useCallback(async (): Promise<NetworkAnalysisResult> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<NetworkAnalysisResult>(
        `${apiUrl}/api/v1/network/analysis`
      );
      
      setNetworkAnalysis(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch network analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchCentralityAnalysis = useCallback(async (): Promise<CentralityAnalysis> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<any>(
        `${apiUrl}/api/v1/network/centrality`
      );
      
      // Transform backend response to match frontend interface
      const transformedData: CentralityAnalysis = {
        node_rankings: data.centrality?.map((item: any, index: number) => ({
          node_id: item.nodeId,
          node_name: item.nodeName,
          centrality_type: 'eigenvector' as const, // Default type since backend doesn't specify
          score: item.centralityScore || item.combinedScore,
          rank: index + 1,
          interpretation: `${item.nodeName} has high network centrality with score ${(item.centralityScore || 0).toFixed(3)}`
        })) || [],
        top_influential: data.topNodes?.map((item: any) => item.nodeId) || [],
        top_vulnerable: data.centrality?.filter((item: any) => item.riskLevel > 60).map((item: any) => item.nodeId) || [],
        critical_connectors: data.centrality?.filter((item: any) => item.systemicImportance > 0.8).map((item: any) => item.nodeId) || [],
        analysis_date: new Date().toISOString()
      };
      
      setCentralityAnalysis(transformedData);
      return transformedData;
    } catch (err) {
      handleError(err, 'Failed to fetch centrality analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchVulnerabilityAssessment = useCallback(async (): Promise<VulnerabilityAssessment> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<VulnerabilityAssessment>(
        `${apiUrl}/api/v1/network/vulnerability-assessment`
      );
      
      setVulnerabilityAssessment(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch vulnerability assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchCriticalPaths = useCallback(async (): Promise<CriticalPath[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<{criticalPaths: CriticalPath[]}>(
        `${apiUrl}/api/v1/network/critical-paths`
      );
      
      const paths = data.criticalPaths || [];
      setCriticalPaths(paths);
      return paths;
    } catch (err) {
      handleError(err, 'Failed to fetch critical paths');
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const runShockSimulation = useCallback(async (config: {
    shockType: string;
    targetNodes: string[];
    magnitude: number;
  }): Promise<ShockSimulation> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<ShockSimulation>(
        `${apiUrl}/api/v1/network/simulate-shock`,
        {
          method: 'POST',
          body: JSON.stringify({
            shock_type: config.shockType,
            target_nodes: config.targetNodes,
            shock_magnitude: config.magnitude
          })
        }
      );
      
      setShockSimulation(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to run shock simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const refreshNetworkData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchNetworkAnalysis(),
        fetchCentralityAnalysis(),
        fetchVulnerabilityAssessment(),
        fetchCriticalPaths()
      ]);
    } catch (err) {
      handleError(err, 'Failed to refresh network data');
    } finally {
      setLoading(false);
    }
  }, [fetchNetworkAnalysis, fetchCentralityAnalysis, fetchVulnerabilityAssessment, fetchCriticalPaths, handleError]);

  return {
    // State
    loading,
    error,
    
    // Data
    networkAnalysis,
    centralityAnalysis,
    vulnerabilityAssessment,
    criticalPaths,
    shockSimulation,
    
    // Actions
    fetchNetworkAnalysis,
    fetchCentralityAnalysis,
    fetchVulnerabilityAssessment,
    fetchCriticalPaths,
    runShockSimulation,
    refreshNetworkData,
    clearError
  };
}