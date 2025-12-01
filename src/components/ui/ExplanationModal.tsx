"use client";

import { useState, ReactNode } from "react";
import { Info, TrendingUp, BarChart3, Network, Target, Download, Copy, X } from "lucide-react";

export interface ExplanationSection {
  title: string;
  content: string | ReactNode;
  type?: "technical" | "business" | "methodology" | "data";
  importance?: "high" | "medium" | "low";
}

export interface DataSource {
  name: string;
  freshness: string;
  quality: number; // 0-100
  endpoint?: string;
}

export interface ExplanationContext {
  component: string;
  model?: string;
  timestamp: string;
  confidence?: number;
  dataSources: DataSource[];
  relatedMetrics?: string[];
}

export interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  context: ExplanationContext;
  sections: ExplanationSection[];
  exportData?: Record<string, unknown>;
  onExport?: () => void;
}

function Badge({ children, variant = "default", className = "" }: { 
  children: ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) {
  const variants = {
    default: "bg-terminal-green/20 text-terminal-green border border-terminal-green/30",
    secondary: "bg-yellow-600/20 text-yellow-600 border border-yellow-600/30",
    destructive: "bg-red-600/20 text-red-600 border border-red-600/30",
    outline: "bg-transparent text-terminal-muted border border-terminal-border"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

function DataSourcesTab({ sources }: { sources: DataSource[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-terminal-muted">
        Data sources powering this analysis with quality and freshness indicators.
      </p>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div key={index} className="p-3 bg-terminal-surface border border-terminal-border rounded">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-mono text-sm text-terminal-text">{source.name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant={source.quality >= 90 ? "default" : source.quality >= 70 ? "secondary" : "destructive"}>
                  {source.quality}% quality
                </Badge>
                <span className="text-xs text-terminal-muted font-mono">{source.freshness}</span>
              </div>
            </div>
            {source.endpoint && (
              <p className="text-xs text-terminal-muted font-mono">{source.endpoint}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodologyTab({ sections }: { sections: ExplanationSection[] }) {
  const methodologySections = sections.filter(s => s.type === "methodology" || s.type === "technical");
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-terminal-muted">
        Technical methodology and computational approaches used in this analysis.
      </p>
      {methodologySections.map((section, index) => (
        <div key={index} className="p-4 bg-terminal-surface border border-terminal-border rounded">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-terminal-green/20 rounded-lg flex items-center justify-center">
              <Info className="h-4 w-4 text-terminal-green" />
            </div>
            <div>
              <h4 className="font-semibold text-terminal-text mb-2">{section.title}</h4>
              <div className="text-sm text-terminal-muted">
                {typeof section.content === 'string' ? (
                  <p>{section.content}</p>
                ) : (
                  section.content
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BusinessImpactTab({ sections }: { sections: ExplanationSection[] }) {
  const businessSections = sections.filter(s => s.type === "business" || !s.type);
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-terminal-muted">
        Business context and decision-making implications of this analysis.
      </p>
      {businessSections.map((section, index) => (
        <div key={index} className="p-4 bg-terminal-surface border border-terminal-border rounded">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-cyan-700" />
            </div>
            <div>
              <h4 className="font-semibold text-terminal-text mb-2">{section.title}</h4>
              <div className="text-sm text-terminal-muted">
                {typeof section.content === 'string' ? (
                  <p>{section.content}</p>
                ) : (
                  section.content
                )}
              </div>
              {section.importance && (
                <Badge 
                  variant={section.importance === "high" ? "destructive" : section.importance === "medium" ? "secondary" : "outline"}
                  className="mt-2"
                >
                  {section.importance} priority
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExportTab({ context, exportData, onExport }: { 
  context: ExplanationContext; 
  exportData?: Record<string, unknown>;
  onExport?: () => void;
}) {
  const handleCopyContext = () => {
    const contextData = {
      component: context.component,
      timestamp: context.timestamp,
      model: context.model,
      confidence: context.confidence,
      data_sources: context.dataSources.map(ds => ({
        name: ds.name,
        quality: ds.quality,
        freshness: ds.freshness
      }))
    };
    navigator.clipboard.writeText(JSON.stringify(contextData, null, 2));
  };

  const handleDownloadReport = () => {
    if (onExport) {
      onExport();
    } else if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${context.component.toLowerCase()}_explanation_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-terminal-muted">
        Export explanation data, methodology context, and analysis results.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleCopyContext}
          className="flex items-center gap-2 p-3 bg-terminal-surface border border-terminal-border rounded hover:bg-terminal-border transition-colors text-left"
        >
          <Copy className="h-4 w-4 text-terminal-muted" />
          <div>
            <p className="font-mono text-sm text-terminal-text">Copy Context</p>
            <p className="text-xs text-terminal-muted">Analysis metadata & sources</p>
          </div>
        </button>

        <button
          onClick={handleDownloadReport}
          disabled={!exportData && !onExport}
          className="flex items-center gap-2 p-3 bg-terminal-surface border border-terminal-border rounded hover:bg-terminal-border transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 text-terminal-muted" />
          <div>
            <p className="font-mono text-sm text-terminal-text">Download Report</p>
            <p className="text-xs text-terminal-muted">Full analysis & methodology</p>
          </div>
        </button>
      </div>

      <div className="p-3 bg-terminal-surface border border-terminal-border rounded">
        <h4 className="font-semibold text-terminal-text mb-2">Analysis Context</h4>
        <div className="text-xs font-mono text-terminal-muted space-y-1">
          <p>Component: {context.component}</p>
          <p>Timestamp: {context.timestamp}</p>
          {context.model && <p>Model: {context.model}</p>}
          {context.confidence && <p>Confidence: {(context.confidence * 100).toFixed(1)}%</p>}
          <p>Data Sources: {context.dataSources.length}</p>
          {context.relatedMetrics && <p>Related Metrics: {context.relatedMetrics.join(", ")}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ExplanationModal({
  isOpen,
  onClose,
  title,
  subtitle,
  context,
  sections,
  exportData,
  onExport
}: ExplanationModalProps) {
  const [activeTab, setActiveTab] = useState("business");

  const getComponentIcon = () => {
    const component = context.component.toLowerCase();
    if (component.includes("network")) return <Network className="h-4 w-4" />;
    if (component.includes("forecast") || component.includes("monte")) return <TrendingUp className="h-4 w-4" />;
    if (component.includes("simulation") || component.includes("stress")) return <Target className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-terminal-bg border border-terminal-border rounded-lg">
        <div className="p-6 border-b border-terminal-border">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-terminal-green/20 rounded-lg flex items-center justify-center">
              {getComponentIcon()}
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-mono font-bold text-terminal-text">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-terminal-muted mt-1">
                  {subtitle}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">
                  {context.component}
                </Badge>
                {context.confidence && (
                  <Badge 
                    variant={context.confidence > 0.8 ? "default" : context.confidence > 0.6 ? "secondary" : "destructive"}
                  >
                    {(context.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                )}
                <span className="text-xs text-terminal-muted font-mono">
                  {new Date(context.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex border border-terminal-border rounded mb-6">
            {["business", "methodology", "sources", "export"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-xs font-mono transition-colors ${
                  activeTab === tab
                    ? "bg-terminal-green/20 text-terminal-green border-r border-terminal-border last:border-r-0"
                    : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface border-r border-terminal-border last:border-r-0"
                }`}
              >
                {tab === "business" && "Business Impact"}
                {tab === "methodology" && "Methodology"}
                {tab === "sources" && "Data Sources"}
                {tab === "export" && "Export"}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === "business" && <BusinessImpactTab sections={sections} />}
            {activeTab === "methodology" && <MethodologyTab sections={sections} />}
            {activeTab === "sources" && <DataSourcesTab sources={context.dataSources} />}
            {activeTab === "export" && (
              <ExportTab 
                context={context} 
                exportData={exportData} 
                onExport={onExport} 
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-terminal-border">
          <div className="flex items-center gap-2 text-xs text-terminal-muted font-mono">
            <Info className="h-3 w-3" />
            <span>Institutional-grade explainability framework</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-mono border border-terminal-border rounded hover:bg-terminal-surface transition-colors"
            >
              Close
            </button>
            {(exportData || onExport) && (
              <button
                onClick={() => {
                  if (onExport) onExport();
                }}
                className="px-4 py-2 text-sm font-mono bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded hover:bg-terminal-green/30 transition-colors flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Quick Export
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing explanation modals
export function useExplanationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<Omit<ExplanationModalProps, 'isOpen' | 'onClose'> | null>(null);

  const openModal = (props: Omit<ExplanationModalProps, 'isOpen' | 'onClose'>) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setModalProps(null), 150); // Allow animation to complete
  };

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps
  };
}
