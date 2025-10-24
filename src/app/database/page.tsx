'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  HardDrive, 
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Search,
  Eye,
  Settings
} from 'lucide-react';

interface DatabaseInfo {
  status: 'connected' | 'disconnected' | 'error';
  version: string;
  uptime: number;
  total_size: number;
  available_space: number;
  connections: {
    active: number;
    idle: number;
    max: number;
  };
  performance: {
    queries_per_second: number;
    avg_query_time: number;
    cache_hit_ratio: number;
    transactions_per_second: number;
  };
}

interface TableInfo {
  name: string;
  schema: string;
  row_count: number;
  size: number;
  last_modified: string;
  description: string;
  columns: number;
  indexes: number;
  constraints: number;
}

interface QueryMetric {
  query: string;
  calls: number;
  total_time: number;
  mean_time: number;
  rows_affected: number;
  last_executed: string;
}

export default function DatabaseAdministrationPage() {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [queryMetrics, setQueryMetrics] = useState<QueryMetric[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  useEffect(() => {
    const loadDatabaseData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch database schema information
        const schemaResponse = await fetch('/api/v1/database/schema');
        if (!schemaResponse.ok) {
          throw new Error('Failed to fetch database schema');
        }
        const schemaData = await schemaResponse.json();
        
        // Fetch data summary
        const summaryResponse = await fetch('/api/v1/database/data/summary');
        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch data summary');
        }
        const summaryData = await summaryResponse.json();
        
        // Create database info from available data
        const dbInfo: DatabaseInfo = {
          status: 'connected',
          version: 'PostgreSQL 15.4',
          uptime: 0, // Not available from API
          total_size: 0, // Calculate from schema if needed
          available_space: 0, // Not available from API
          connections: {
            active: 0, // Not available from API
            idle: 0, // Not available from API
            max: 100 // Default
          },
          performance: {
            queries_per_second: 0, // Not available from API
            avg_query_time: 0, // Not available from API
            cache_hit_ratio: 0, // Not available from API
            transactions_per_second: 0 // Not available from API
          }
        };

        // Transform schema data into tables format
        const tables: TableInfo[] = [];
        if (schemaData.schema) {
          Object.entries(schemaData.schema).forEach(([tableName, columns]: [string, any]) => {
            const rowCount = summaryData.data_summary?.[tableName] || 0;
            tables.push({
              name: tableName,
              schema: 'public',
              row_count: typeof rowCount === 'number' ? rowCount : 0,
              size: 0, // Not available from API
              last_modified: new Date().toISOString(),
              description: `${tableName.replace(/_/g, ' ')} table`,
              columns: Array.isArray(columns) ? columns.length : 0,
              indexes: 0, // Not available from API
              constraints: 0 // Not available from API
            });
          });
        }

        // Query metrics not available from current API
        const queryMetrics: QueryMetric[] = [];

        setDbInfo(dbInfo);
        setTables(tables);
        setQueryMetrics(queryMetrics);
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading database data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatabaseData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDatabaseData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const schemaResponse = await fetch('/api/v1/database/schema');
      const summaryResponse = await fetch('/api/v1/database/data/summary');
      
      if (schemaResponse.ok && summaryResponse.ok) {
        const schemaData = await schemaResponse.json();
        const summaryData = await summaryResponse.json();
        
        const tables: TableInfo[] = [];
        if (schemaData.schema) {
          Object.entries(schemaData.schema).forEach(([tableName, columns]: [string, any]) => {
            const rowCount = summaryData.data_summary?.[tableName] || 0;
            tables.push({
              name: tableName,
              schema: 'public',
              row_count: typeof rowCount === 'number' ? rowCount : 0,
              size: 0,
              last_modified: new Date().toISOString(),
              description: `${tableName.replace(/_/g, ' ')} table`,
              columns: Array.isArray(columns) ? columns.length : 0,
              indexes: 0,
              constraints: 0
            });
          });
        }
        
        setTables(tables);
      }
      
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error refreshing database data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getSchemas = () => {
    const schemaSet = new Set(tables.map(table => table.schema));
    const schemas = Array.from(schemaSet);
    return schemas.sort();
  };

  const filteredTables = tables.filter(table => {
    const matchesSchema = selectedSchema === 'all' || table.schema === selectedSchema;
    const matchesSearch = searchTerm === '' || 
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchema && matchesSearch;
  });

  const totalRows = tables.reduce((sum, table) => sum + table.row_count, 0);
  const totalSize = tables.reduce((sum, table) => sum + table.size, 0);
  const activeSchemas = getSchemas().length;

  if (isLoading && !dbInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-[#374151]">Loading database administration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Database Administration</h1>
              <p className="text-[#374151]">Monitor and manage PostgreSQL database operations</p>
            </div>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastRefresh}</p>
          )}
        </div>

        {/* Database Status */}
        {dbInfo && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Database Status</h3>
                    <p className="text-lg font-medium text-green-600 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Connected
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">{dbInfo.version}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Database Size</h3>
                    <p className="text-3xl font-bold text-[#374151]">{formatBytes(dbInfo.total_size)}</p>
                  </div>
                  <HardDrive className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">{formatBytes(dbInfo.available_space)} available</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Active Connections</h3>
                    <p className="text-3xl font-bold text-[#374151]">{dbInfo.connections.active}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">of {dbInfo.connections.max} max</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Uptime</h3>
                    <p className="text-3xl font-bold text-[#374151]">{formatDuration(dbInfo.uptime)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Continuous operation</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Performance Metrics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#374151]">Queries per Second</span>
                    <span className="text-lg font-bold text-[#374151]">{dbInfo.performance.queries_per_second.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#374151]">Average Query Time</span>
                    <span className="text-lg font-bold text-[#374151]">{dbInfo.performance.avg_query_time.toFixed(1)}ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#374151]">Cache Hit Ratio</span>
                    <span className="text-lg font-bold text-green-600">{dbInfo.performance.cache_hit_ratio.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#374151]">Transactions per Second</span>
                    <span className="text-lg font-bold text-[#374151]">{dbInfo.performance.transactions_per_second.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Connection Pool</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active Connections</span>
                      <span>{dbInfo.connections.active}/{dbInfo.connections.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(dbInfo.connections.active / dbInfo.connections.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Active</p>
                      <p className="text-2xl font-bold text-blue-600">{dbInfo.connections.active}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Idle</p>
                      <p className="text-2xl font-bold text-gray-600">{dbInfo.connections.idle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Database Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Total Tables</h3>
                <p className="text-3xl font-bold text-[#374151]">{tables.length}</p>
              </div>
              <Table className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Across {activeSchemas} schemas</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Total Rows</h3>
                <p className="text-3xl font-bold text-[#374151]">{totalRows.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">All tables combined</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Total Size</h3>
                <p className="text-3xl font-bold text-[#374151]">{formatBytes(totalSize)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Data and indexes</p>
          </div>
        </div>

        {/* Tables Management */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1e3a8a]">Database Tables</h2>
                <p className="text-sm text-gray-600 mt-1">Browse and manage database tables</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
                <select
                  value={selectedSchema}
                  onChange={(e) => setSelectedSchema(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Schemas</option>
                  {getSchemas().map((schema) => (
                    <option key={schema} value={schema}>{schema}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Table Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Schema</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Rows</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Size</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Columns</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Last Modified</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTables.map((table, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-3 px-6">
                      <div>
                        <span className="text-sm font-medium text-[#374151]">{table.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{table.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded">
                        {table.schema}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{table.row_count.toLocaleString()}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{formatBytes(table.size)}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {table.columns} cols, {table.indexes} idx
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {new Date(table.last_modified).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Performance */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Query Performance</h2>
            <p className="text-sm text-gray-600 mt-1">Most frequently executed queries and their performance metrics</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Query</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Calls</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Total Time</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Mean Time</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Rows Affected</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Last Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {queryMetrics.map((query, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-3 px-6">
                      <code className="text-xs font-mono bg-gray-100 p-1 rounded max-w-md block truncate">
                        {query.query}
                      </code>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{query.calls.toLocaleString()}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{(query.total_time / 1000).toFixed(2)}s</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{query.mean_time.toFixed(2)}ms</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{query.rows_affected.toLocaleString()}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {new Date(query.last_executed).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Information */}
        <div className="mt-8 bg-slate-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Database Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Database Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>PostgreSQL 15.4:</strong> Latest stable version</li>
                <li>• <strong>Connection Pooling:</strong> PgBouncer for efficient connections</li>
                <li>• <strong>Query Optimization:</strong> Automatic query plan optimization</li>
                <li>• <strong>Backup & Recovery:</strong> Point-in-time recovery enabled</li>
                <li>• <strong>Monitoring:</strong> Real-time performance tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Schema Organization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>public:</strong> Core application data and cache</li>
                <li>• <strong>ml:</strong> Machine learning models and predictions</li>
                <li>• <strong>monitoring:</strong> System monitoring and logs</li>
                <li>• <strong>auth:</strong> Authentication and authorization</li>
                <li>• <strong>analytics:</strong> Business intelligence and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}