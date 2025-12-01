import { useCallback, useEffect, useState } from 'react';
import { getTimelineCascadeVisualization } from '@/services/realTimeDataService';
import { rrio } from '@/lib/monitoring';

type VisualizationType = 'timeline' | 'gantt' | 'flowchart';

interface CascadeEvent {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  severity: string;
  impact_regions: string[];
  supply_chains_affected: string[];
  mitigation_actions: string[];
}

interface TimelineCascadeData {
  visualization_type: VisualizationType;
  time_range: {
    start_date: string;
    end_date: string;
  };
  cascade_events: CascadeEvent[];
  critical_paths: Array<{
    path_id: string;
    description: string;
    events: string[];
    risk_level: string;
  }>;
  metadata: {
    generated_at: string;
    total_events: number;
    active_cascades: number;
  };
}

interface TimelineCascadeState {
  data: TimelineCascadeData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  visualizationType: VisualizationType;
}

export const useTimelineCascade = (initialVisualizationType: VisualizationType = 'timeline') => {
  const [state, setState] = useState<TimelineCascadeState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    visualizationType: initialVisualizationType,
  });

  const fetchTimelineCascade = useCallback(async (visualizationType?: VisualizationType) => {
    const vizType = visualizationType || state.visualizationType;
    setState(prev => ({ ...prev, loading: true, error: null, visualizationType: vizType }));
    
    try {
      const cascadeData = await getTimelineCascadeVisualization(vizType);
      
      if (cascadeData?.timeline_visualization) {
        setState(prev => ({
          ...prev,
          data: cascadeData.timeline_visualization,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
          visualizationType: vizType,
        }));
        
        rrio.trackDataFetch('TimelineCascade', 'success', {
          visualization_type: vizType,
          total_events: cascadeData.timeline_visualization.metadata?.total_events || 0
        });
      } else {
        throw new Error('Invalid timeline cascade data structure');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      rrio.trackDataFetch('TimelineCascade', 'error', {
        visualization_type: vizType,
        error: errorMessage
      });
    }
  }, [state.visualizationType]);

  const setVisualizationType = useCallback((type: VisualizationType) => {
    fetchTimelineCascade(type);
  }, [fetchTimelineCascade]);

  const refreshData = useCallback(() => {
    fetchTimelineCascade();
  }, [fetchTimelineCascade]);

  useEffect(() => {
    fetchTimelineCascade();
  }, [fetchTimelineCascade]);

  return {
    ...state,
    setVisualizationType,
    refreshData,
    isStale: state.lastUpdated && 
      (Date.now() - new Date(state.lastUpdated).getTime()) > 180000, // 3 minutes for timeline data
    activeCascades: state.data?.metadata?.active_cascades || 0,
    totalEvents: state.data?.metadata?.total_events || 0,
  };
};

export default useTimelineCascade;