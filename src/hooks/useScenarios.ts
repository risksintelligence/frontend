import { useState, useCallback, useMemo } from 'react';

interface ScenarioParameter {
  id: string;
  name: string;
  currentValue: number;
  baselineValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: 'economic' | 'market' | 'policy';
}

interface ScenarioResult {
  parameterId: string;
  impact: number;
  confidence: number;
  timeHorizon: string;
  description: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: ScenarioParameter[];
  results: ScenarioResult[];
  created: string;
  lastModified: string;
}

interface UseScenariosResult {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  loading: boolean;
  error: string | null;
  createScenario: (name: string, description: string) => Promise<void>;
  updateParameter: (parameterId: string, value: number) => Promise<void>;
  calculateImpact: () => Promise<void>;
  saveScenario: (id: string) => Promise<void>;
  loadScenario: (id: string) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
}

export function useScenarios(): UseScenariosResult {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultParameters = useMemo<ScenarioParameter[]>(() => [
    {
      id: 'gdp-growth',
      name: 'GDP Growth Rate',
      currentValue: 2.1,
      baselineValue: 2.1,
      min: -2.0,
      max: 5.0,
      step: 0.1,
      unit: '%',
      category: 'economic'
    },
    {
      id: 'interest-rate',
      name: 'Federal Funds Rate',
      currentValue: 5.25,
      baselineValue: 5.25,
      min: 0.0,
      max: 8.0,
      step: 0.25,
      unit: '%',
      category: 'policy'
    },
    {
      id: 'unemployment',
      name: 'Unemployment Rate',
      currentValue: 3.7,
      baselineValue: 3.7,
      min: 2.0,
      max: 10.0,
      step: 0.1,
      unit: '%',
      category: 'economic'
    },
    {
      id: 'inflation',
      name: 'Inflation Rate',
      currentValue: 3.2,
      baselineValue: 3.2,
      min: 0.0,
      max: 8.0,
      step: 0.1,
      unit: '%',
      category: 'economic'
    },
    {
      id: 'market-volatility',
      name: 'Market Volatility (VIX)',
      currentValue: 18.5,
      baselineValue: 18.5,
      min: 10.0,
      max: 50.0,
      step: 1.0,
      unit: '',
      category: 'market'
    },
    {
      id: 'oil-price',
      name: 'Oil Price',
      currentValue: 85.0,
      baselineValue: 85.0,
      min: 40.0,
      max: 150.0,
      step: 5.0,
      unit: '$/barrel',
      category: 'market'
    }
  ], []);

  const createScenario = useCallback(async (name: string, description: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        name,
        description,
        parameters: defaultParameters.map(p => ({ ...p })),
        results: [],
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      
      setActiveScenario(newScenario);
      setScenarios(prev => [...prev, newScenario]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scenario');
    } finally {
      setLoading(false);
    }
  }, [defaultParameters]);

  const updateParameter = useCallback(async (parameterId: string, value: number) => {
    if (!activeScenario) return;
    
    try {
      setError(null);
      
      const updatedScenario = {
        ...activeScenario,
        parameters: activeScenario.parameters.map(p =>
          p.id === parameterId ? { ...p, currentValue: value } : p
        ),
        lastModified: new Date().toISOString()
      };
      
      setActiveScenario(updatedScenario);
      setScenarios(prev => 
        prev.map(s => s.id === updatedScenario.id ? updatedScenario : s)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update parameter');
    }
  }, [activeScenario]);

  const calculateImpact = useCallback(async () => {
    if (!activeScenario) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In production, call API for impact calculation
      // const response = await fetch('/api/v1/analytics/scenarios/calculate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ parameters: activeScenario.parameters })
      // });
      
      // Simulate impact calculation
      const results: ScenarioResult[] = activeScenario.parameters.map(param => {
        const baselineValue = param.baselineValue;
        const currentValue = param.currentValue;
        const change = ((currentValue - baselineValue) / baselineValue) * 100;
        
        // Simple impact calculation (in reality, this would be much more complex)
        let impact = 0;
        let confidence = 0.75;
        
        switch (param.id) {
          case 'gdp-growth':
            impact = change * 2.5; // GDP has high impact
            confidence = 0.85;
            break;
          case 'interest-rate':
            impact = -change * 1.8; // Interest rates have inverse impact
            confidence = 0.80;
            break;
          case 'unemployment':
            impact = -change * 1.2; // Unemployment has inverse impact
            confidence = 0.75;
            break;
          case 'inflation':
            impact = -change * 0.8; // Inflation has moderate negative impact
            confidence = 0.70;
            break;
          case 'market-volatility':
            impact = -change * 0.5; // Volatility has negative impact
            confidence = 0.65;
            break;
          case 'oil-price':
            impact = -change * 0.3; // Oil price has small negative impact
            confidence = 0.60;
            break;
        }
        
        return {
          parameterId: param.id,
          impact: Math.round(impact * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          timeHorizon: '6m',
          description: `${impact > 0 ? 'Positive' : 'Negative'} impact from ${param.name} change`
        };
      });
      
      const updatedScenario = {
        ...activeScenario,
        results,
        lastModified: new Date().toISOString()
      };
      
      setActiveScenario(updatedScenario);
      setScenarios(prev => 
        prev.map(s => s.id === updatedScenario.id ? updatedScenario : s)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate impact');
    } finally {
      setLoading(false);
    }
  }, [activeScenario]);

  const saveScenario = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, save to API
      // await fetch(`/api/v1/analytics/scenarios/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(activeScenario)
      // });
      
      // For now, just update local state
      console.log('Scenario saved:', id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scenario');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadScenario = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const scenario = scenarios.find(s => s.id === id);
      if (scenario) {
        setActiveScenario(scenario);
      } else {
        throw new Error('Scenario not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario');
    } finally {
      setLoading(false);
    }
  }, [scenarios]);

  const deleteScenario = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, delete from API
      // await fetch(`/api/v1/analytics/scenarios/${id}`, {
      //   method: 'DELETE'
      // });
      
      setScenarios(prev => prev.filter(s => s.id !== id));
      
      if (activeScenario?.id === id) {
        setActiveScenario(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete scenario');
    } finally {
      setLoading(false);
    }
  }, [activeScenario]);

  return {
    scenarios,
    activeScenario,
    loading,
    error,
    createScenario,
    updateParameter,
    calculateImpact,
    saveScenario,
    loadScenario,
    deleteScenario
  };
}