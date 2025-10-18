import React from 'react';
import { Server, CheckCircle, AlertTriangle, XCircle, Clock, Activity } from 'lucide-react';
import { ServiceStatus } from '../../hooks/useSystemMonitoring';

interface ServiceStatusPanelProps {
  services: ServiceStatus[];
  loading?: boolean;
}

export const ServiceStatusPanel: React.FC<ServiceStatusPanelProps> = ({
  services,
  loading
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'unknown':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4" />;
      case 'unknown':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatUptime = (uptimeSeconds: number): string => {
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getOverallHealth = () => {
    if (services.length === 0) return { status: 'unknown', count: 0 };
    
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const degradedCount = services.filter(s => s.status === 'degraded').length;
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length;
    
    if (unhealthyCount > 0) {
      return { status: 'unhealthy', count: unhealthyCount };
    } else if (degradedCount > 0) {
      return { status: 'degraded', count: degradedCount };
    } else if (healthyCount === services.length) {
      return { status: 'healthy', count: healthyCount };
    } else {
      return { status: 'unknown', count: 0 };
    }
  };

  const overallHealth = getOverallHealth();

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading service status...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Server className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Service Health</h3>
                <p className="text-sm text-gray-600">Real-time status of all system services</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${getStatusColor(overallHealth.status)}`}>
              {getStatusIcon(overallHealth.status)}
              <span className="font-medium capitalize">{overallHealth.status}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status === 'healthy').length}
              </div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {services.filter(s => s.status === 'degraded').length}
              </div>
              <div className="text-sm text-gray-600">Degraded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => s.status === 'unhealthy').length}
              </div>
              <div className="text-sm text-gray-600">Unhealthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {services.length}
              </div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Service Details</h4>
        </div>
        <div className="p-6">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Services Configured</h4>
              <p className="text-gray-600">No services are currently being monitored.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.service_name}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{service.service_name}</h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Uptime: {formatUptime(service.uptime)}</span>
                          <span>Response: {Math.round(service.response_time)}ms</span>
                          <span>Last Check: {new Date(service.last_check).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>

                  {service.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                      <div className="text-sm text-red-800">{service.error_message}</div>
                    </div>
                  )}

                  {/* Dependencies */}
                  {service.dependencies.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Dependencies</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {service.dependencies.map((dependency) => (
                          <div
                            key={dependency.name}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                dependency.status === 'healthy' 
                                  ? 'bg-green-500' 
                                  : dependency.status === 'degraded'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium text-gray-700">{dependency.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(dependency.response_time)}ms
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Service Health Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Health Timeline</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-600">Service health timeline visualization</div>
              <div className="text-sm text-gray-500">
                Historical health status and incident timeline would render here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};