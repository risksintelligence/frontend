import { useState, useCallback } from 'react';
import {
  PolicyParameter,
  SimulationResult,
  MonteCarloConfig,
  MonteCarloResult,
  PolicyTemplate,
  SimulationHistory,
  SimulationComparison,
  UseSimulationOptions,
  UseSimulationResult
} from '../types/simulation';

export function useSimulation(
  apiUrl: string,
  options: UseSimulationOptions = {}
): UseSimulationResult {
  const {
    onError,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyTemplates, setPolicyTemplates] = useState<PolicyTemplate[]>([]);
  const [simulationHistory, setSimulationHistory] = useState<SimulationHistory[]>([]);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult | null>(null);

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
          throw new Error('Simulation endpoint not found');
        }
        if (response.status === 503) {
          throw new Error('Simulation service temporarily unavailable');
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
    console.error(`Simulation ${context} error:`, err);
  }, [onError]);

  const runPolicySimulation = useCallback(async (parameters: PolicyParameter[]): Promise<SimulationResult[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<SimulationResult[]>(
        `${apiUrl}/api/v1/simulation/policy/simulate`,
        {
          method: 'POST',
          body: JSON.stringify({
            parameters: parameters.map(p => ({
              id: p.id,
              value: p.currentValue
            }))
          })
        }
      );
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to run policy simulation');
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const runMonteCarloSimulation = useCallback(async (config: MonteCarloConfig): Promise<MonteCarloResult> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<MonteCarloResult>(
        `${apiUrl}/api/v1/simulation/monte-carlo/run`,
        {
          method: 'POST',
          body: JSON.stringify(config)
        }
      );
      
      setMonteCarloResults(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to run Monte Carlo simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const loadPolicyTemplates = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<any>(
        `${apiUrl}/api/v1/simulation/templates/policies`
      );
      
      // Handle both old and new response formats
      if (Array.isArray(data)) {
        setPolicyTemplates(data);
      } else if (data.policy_parameters) {
        setPolicyTemplates(data.policy_parameters);
      } else {
        // Convert old format to new format for storage
        const convertedTemplates = data.templates ? Object.values(data.templates) : [];
        setPolicyTemplates(convertedTemplates as PolicyTemplate[]);
      }
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to load policy templates');
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const getSimulation = useCallback(async (simulationId: string): Promise<SimulationHistory> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<SimulationHistory>(
        `${apiUrl}/api/v1/simulation/${simulationId}`
      );
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to get simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const saveSimulation = useCallback(async (name: string, simulation: any): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<{ id: string }>(
        `${apiUrl}/api/v1/simulation/save`,
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            simulation
          })
        }
      );
      
      return data.id;
    } catch (err) {
      handleError(err, 'Failed to save simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const deleteSimulation = useCallback(async (simulationId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await makeRequest<void>(
        `${apiUrl}/api/v1/simulation/${simulationId}`,
        {
          method: 'DELETE'
        }
      );
      
      setSimulationHistory(prev => prev.filter(sim => sim.id !== simulationId));
    } catch (err) {
      handleError(err, 'Failed to delete simulation');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const compareSimulations = useCallback(async (simulationIds: string[]): Promise<SimulationComparison> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<SimulationComparison>(
        `${apiUrl}/api/v1/simulation/compare`,
        {
          method: 'POST',
          body: JSON.stringify({
            simulationIds
          })
        }
      );
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to compare simulations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const exportSimulation = useCallback(async (simulationId: string, format: 'json' | 'csv' | 'xlsx'): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/simulation/${simulationId}/export?format=${format}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simulation_${simulationId}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      handleError(err, 'Failed to export simulation');
    }
  }, [apiUrl, handleError]);

  return {
    // State
    loading,
    error,
    
    // Data
    policyTemplates,
    simulationHistory,
    monteCarloResults,
    
    // Actions
    runPolicySimulation,
    runMonteCarloSimulation,
    loadPolicyTemplates,
    getSimulation,
    saveSimulation,
    deleteSimulation,
    compareSimulations,
    exportSimulation,
    clearError
  };
}