import React, { useState } from 'react';
import { History, Download, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationHistory as SimulationHistoryType } from '../../types/simulation';

interface SimulationHistoryProps {
  apiUrl: string;
  onLoadSimulation?: (simulation: SimulationHistoryType) => void;
}

export const SimulationHistory: React.FC<SimulationHistoryProps> = ({
  apiUrl,
  onLoadSimulation
}) => {
  const { 
    simulationHistory, 
    loading, 
    error, 
    getSimulation,
    deleteSimulation,
    exportSimulation,
    clearError 
  } = useSimulation(apiUrl);

  const [selectedSimulations, setSelectedSimulations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'status'>('date');
  const [filterType, setFilterType] = useState<'all' | 'policy' | 'monte_carlo'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'running' | 'failed'>('all');

  const handleSelectSimulation = (simulationId: string) => {
    setSelectedSimulations(prev => 
      prev.includes(simulationId)
        ? prev.filter(id => id !== simulationId)
        : [...prev, simulationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSimulations.length === filteredSimulations.length) {
      setSelectedSimulations([]);
    } else {
      setSelectedSimulations(filteredSimulations.map(sim => sim.id));
    }
  };

  const handleLoadSimulation = async (simulationId: string) => {
    try {
      const simulation = await getSimulation(simulationId);
      onLoadSimulation?.(simulation);
    } catch (err) {
      console.error('Failed to load simulation:', err);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Delete ${selectedSimulations.length} selected simulation(s)?`)) {
      try {
        await Promise.all(selectedSimulations.map(id => deleteSimulation(id)));
        setSelectedSimulations([]);
      } catch (err) {
        console.error('Failed to delete simulations:', err);
      }
    }
  };

  const handleExportSelected = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      await Promise.all(selectedSimulations.map(id => exportSimulation(id, format)));
    } catch (err) {
      console.error('Failed to export simulations:', err);
    }
  };

  const filteredSimulations = simulationHistory
    .filter(sim => filterType === 'all' || sim.type === filterType)
    .filter(sim => filterStatus === 'all' || sim.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return 'GOV';
      case 'monte_carlo':
        return 'CHART';
      default:
        return 'LIST';
    }
  };

  const formatDuration = (executionTime?: number) => {
    if (!executionTime) return 'N/A';
    if (executionTime < 1000) return `${executionTime}ms`;
    if (executionTime < 60000) return `${(executionTime / 1000).toFixed(1)}s`;
    return `${(executionTime / 60000).toFixed(1)}m`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Simulation History</h3>
              <p className="text-sm text-gray-600">
                Manage and review past simulation runs
              </p>
            </div>
          </div>
          
          {selectedSimulations.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportSelected('json')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Export JSON
              </button>
              <button
                onClick={() => handleExportSelected('csv')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Export CSV
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete ({selectedSimulations.length})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="policy">Policy Simulation</option>
              <option value="monte_carlo">Monte Carlo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Simulation List */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading simulations...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading simulations</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredSimulations.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No simulations found</h3>
            <p className="text-gray-600">
              {filterType !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters'
                : 'Run your first simulation to see results here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Select All */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedSimulations.length === filteredSimulations.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                Select all ({filteredSimulations.length} simulations)
              </span>
            </div>

            {/* Simulation Items */}
            {filteredSimulations.map((simulation) => (
              <div
                key={simulation.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedSimulations.includes(simulation.id)}
                  onChange={() => handleSelectSimulation(simulation.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getTypeIcon(simulation.type)}</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {simulation.name}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(simulation.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(simulation.executionTime)}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(simulation.status)}`}>
                          {simulation.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                          {simulation.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {simulation.notes && (
                    <p className="text-xs text-gray-600 mt-2 truncate">
                      {simulation.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLoadSimulation(simulation.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="View simulation"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => exportSimulation(simulation.id, 'json')}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                    title="Export simulation"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSimulation(simulation.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete simulation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};