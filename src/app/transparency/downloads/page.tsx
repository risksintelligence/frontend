"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useTransparencyDatasets } from "@/hooks/useTransparencyDatasets";
import { Download, FileText, Database, Calendar, Users } from "lucide-react";

interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  source: string;
  frequency: string;
  startDate: string;
  recordCount: number;
  lastUpdated: string;
  category: "macro" | "financial" | "supply" | "policy";
}

const EXPORT_FORMATS = [
  { id: "csv", name: "CSV", description: "Comma-separated values for Excel/R/Python", icon: FileText },
  { id: "json", name: "JSON", description: "JavaScript Object Notation for APIs", icon: Database },
  { id: "parquet", name: "Parquet", description: "Columnar format for big data analytics", icon: Database }
];

const TIME_RANGES = [
  { id: "30d", name: "Last 30 Days", days: 30 },
  { id: "3m", name: "Last 3 Months", days: 90 },
  { id: "1y", name: "Last 1 Year", days: 365 },
  { id: "5y", name: "Last 5 Years", days: 1825 },
  { id: "all", name: "All Available Data", days: null }
];

export default function DataDownloadsPage() {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [selectedTimeRange, setSelectedTimeRange] = useState("1y");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: datasetsResponse, isLoading: datasetsLoading } = useTransparencyDatasets();
  
  const availableDatasets: DatasetInfo[] = datasetsResponse?.datasets || [];
  const exportFormats = datasetsResponse?.export_formats || ["csv", "json", "parquet"];
  const timeRanges = datasetsResponse?.time_ranges || ["30d", "3m", "1y", "5y", "all"];
  
  const filteredDatasets = availableDatasets.filter(dataset => 
    categoryFilter === "all" || dataset.category === categoryFilter
  );

  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "macro": return "text-blue-700 bg-blue-50 border-blue-200";
      case "financial": return "text-green-700 bg-green-50 border-green-200";
      case "supply": return "text-orange-700 bg-orange-50 border-orange-200";
      case "policy": return "text-purple-700 bg-purple-50 border-purple-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const handleDownload = () => {
    if (selectedDatasets.length === 0) return;
    
    // In a real implementation, this would trigger the download
    const timeRange = TIME_RANGES.find(r => r.id === selectedTimeRange);
    const format = EXPORT_FORMATS.find(f => f.id === selectedFormat);
    
    alert(`Downloading ${selectedDatasets.length} dataset(s) in ${format?.name} format for ${timeRange?.name}. In production, this would start the download.`);
  };

  const getTotalRecords = () => {
    return selectedDatasets.reduce((total, datasetId) => {
      const dataset = availableDatasets.find(d => d.id === datasetId);
      const timeRange = TIME_RANGES.find(r => r.id === selectedTimeRange);
      
      if (!dataset || !timeRange) return total;
      
      if (timeRange.days === null) return total + dataset.recordCount;
      
      // Estimate records based on frequency and time range
      const dailyRecords = dataset.frequency === "Daily" ? timeRange.days : 
                          dataset.frequency === "Monthly" ? Math.ceil(timeRange.days / 30) :
                          Math.ceil(timeRange.days / 7);
      
      return total + Math.min(dailyRecords, dataset.recordCount);
    }, 0);
  };

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Transparency Portal
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Research Data Downloads
          </h1>
          <p className="text-sm text-terminal-muted">
            Access authoritative economic datasets for research, analysis, and institutional due diligence.
          </p>
        </header>

        {/* Usage Guidelines */}
        <section className="terminal-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
              Research & Academic Use
            </h3>
            <p className="text-xs text-terminal-muted font-mono mt-1">
              Institutional-grade economic data with proper source attribution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-terminal-green mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text">Academic Research</h4>
                <p className="text-terminal-muted">Peer-reviewed publications, thesis research, policy analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-terminal-green mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text">Institutional Analysis</h4>
                <p className="text-terminal-muted">Risk modeling, portfolio optimization, stress testing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-terminal-green mt-0.5" />
              <div>
                <h4 className="font-semibold text-terminal-text">Proper Attribution</h4>
                <p className="text-terminal-muted">Citation guidelines included with all downloads</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dataset Selection */}
        <section className="terminal-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
                Available Datasets
              </h3>
              <p className="text-xs text-terminal-muted font-mono">
                {datasetsLoading ? "Loading datasets..." : "Select economic indicators for download"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-terminal-bg border border-terminal-border rounded px-3 py-1 text-xs font-mono text-terminal-text"
              >
                <option value="all">All Categories</option>
                <option value="macro">Macroeconomic</option>
                <option value="financial">Financial Markets</option>
                <option value="supply">Supply Chain</option>
                <option value="policy">Policy Measures</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {datasetsLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonLoader key={idx} variant="card" />
              ))
            ) : filteredDatasets.map((dataset) => (
              <div 
                key={dataset.id}
                className={`border rounded p-4 transition-colors cursor-pointer ${
                  selectedDatasets.includes(dataset.id)
                    ? "border-terminal-green bg-terminal-green/5"
                    : "border-terminal-border hover:bg-terminal-surface/50"
                }`}
                onClick={() => toggleDataset(dataset.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.id)}
                        onChange={() => toggleDataset(dataset.id)}
                        className="rounded"
                      />
                      <h4 className="font-semibold text-terminal-text font-mono text-sm">
                        {dataset.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-mono rounded border ${getCategoryColor(dataset.category)}`}>
                        {dataset.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-terminal-muted font-mono mb-2">
                      {dataset.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-terminal-muted">
                      <div>
                        <span className="text-terminal-text">Source:</span> {dataset.source}
                      </div>
                      <div>
                        <span className="text-terminal-text">Frequency:</span> {dataset.frequency}
                      </div>
                      <div>
                        <span className="text-terminal-text">Records:</span> {dataset.recordCount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-terminal-text">Updated:</span> {dataset.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Export Configuration */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div className="terminal-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
                Export Format
              </h3>
              <p className="text-xs text-terminal-muted font-mono">
                Choose output format for your use case
              </p>
            </div>
            
            <div className="space-y-2">
              {EXPORT_FORMATS.map((format) => (
                <div
                  key={format.id}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selectedFormat === format.id
                      ? "border-terminal-green bg-terminal-green/5"
                      : "border-terminal-border hover:bg-terminal-surface/50"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedFormat === format.id}
                      onChange={() => setSelectedFormat(format.id)}
                      className="text-terminal-green"
                    />
                    <format.icon className="w-4 h-4 text-terminal-muted" />
                    <div>
                      <div className="font-semibold text-terminal-text font-mono text-sm">
                        {format.name}
                      </div>
                      <div className="text-xs text-terminal-muted font-mono">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Range Selection */}
          <div className="terminal-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
                Time Range
              </h3>
              <p className="text-xs text-terminal-muted font-mono">
                Select historical data period
              </p>
            </div>
            
            <div className="space-y-2">
              {TIME_RANGES.map((range) => (
                <div
                  key={range.id}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selectedTimeRange === range.id
                      ? "border-terminal-green bg-terminal-green/5"
                      : "border-terminal-border hover:bg-terminal-surface/50"
                  }`}
                  onClick={() => setSelectedTimeRange(range.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedTimeRange === range.id}
                      onChange={() => setSelectedTimeRange(range.id)}
                      className="text-terminal-green"
                    />
                    <Calendar className="w-4 h-4 text-terminal-muted" />
                    <div className="font-semibold text-terminal-text font-mono text-sm">
                      {range.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download Summary */}
        {selectedDatasets.length > 0 && (
          <section className="terminal-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
                  Download Summary
                </h3>
                <p className="text-xs text-terminal-muted font-mono">
                  Review your export configuration
                </p>
              </div>
              <StatusBadge variant="info">
                {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? 's' : ''}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono mb-4">
              <div className="bg-terminal-surface border border-terminal-border rounded p-3">
                <div className="text-terminal-muted uppercase">Datasets</div>
                <div className="text-terminal-text text-lg font-bold">{selectedDatasets.length}</div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border rounded p-3">
                <div className="text-terminal-muted uppercase">Format</div>
                <div className="text-terminal-text text-lg font-bold">
                  {EXPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
                </div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border rounded p-3">
                <div className="text-terminal-muted uppercase">Time Range</div>
                <div className="text-terminal-text text-lg font-bold">
                  {TIME_RANGES.find(r => r.id === selectedTimeRange)?.name}
                </div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border rounded p-3">
                <div className="text-terminal-muted uppercase">Est. Records</div>
                <div className="text-terminal-text text-lg font-bold">{getTotalRecords().toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleDownload}
                disabled={selectedDatasets.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Data Package →
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
                <FileText className="w-4 h-4" />
                Preview Data
              </button>
            </div>
          </section>
        )}

        {/* Citation Guidelines */}
        <section className="terminal-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase text-terminal-text font-mono">
              Citation & Attribution Guidelines
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Proper attribution for academic and institutional use
            </p>
          </div>
          
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-semibold text-terminal-text font-mono text-sm mb-2">
              Recommended Citation Format:
            </h4>
            <div className="text-xs font-mono text-terminal-text bg-terminal-bg border border-terminal-border rounded p-3">
              {`RRIO Observatory (2024). Economic Indicators Dataset [Data file]. 
Retrieved from https://rrio.observatory/transparency/downloads
Original Sources: Federal Reserve Economic Data (FRED), Bureau of Labor Statistics (BLS), 
Energy Information Administration (EIA), Chicago Board Options Exchange (CBOE)`}
            </div>
            <p className="text-xs text-terminal-muted font-mono mt-2">
              Individual dataset citations and methodology documentation included with each download.
            </p>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
