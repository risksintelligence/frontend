"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle, Eye, FileText } from "lucide-react";
import DataFlowDiagram, { DataNode, DataFlow } from "./DataFlowDiagram";

interface PrimerItem {
  title: string;
  content: string;
  tooltip?: string;
  expandedContent?: string;
}

interface PagePrimerProps {
  kicker?: string;
  title: string;
  description: string;
  items?: PrimerItem[];
  inputs?: string[];
  process?: string[];
  outputs?: string[];
  showDataFlow?: boolean;
  dataFlowNodes?: DataNode[];
  dataFlowConnections?: DataFlow[];
  expandable?: boolean;
}

function TooltipWrapper({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!tooltip) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-terminal-bg border border-terminal-border rounded p-2 shadow-lg z-20 w-64">
          <p className="text-xs text-terminal-muted">{tooltip}</p>
        </div>
      )}
    </div>
  );
}

export default function PagePrimer({ 
  kicker = "Primer", 
  title, 
  description, 
  items, 
  inputs,
  process,
  outputs,
  showDataFlow = false,
  dataFlowNodes = [],
  dataFlowConnections = [],
  expandable = false
}: PagePrimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<"overview" | "dataflow">("overview");

  // Convert inputs/process/outputs format to items format if needed
  const finalItems = items || [
    ...(inputs ? [{ title: "Inputs", content: inputs.join(", ") }] : []),
    ...(process ? [{ title: "Process", content: process.join(", ") }] : []),
    ...(outputs ? [{ title: "Outputs", content: outputs.join(", ") }] : [])
  ];

  const toggleItemExpansion = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="terminal-card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <p className="text-xs uppercase tracking-wide text-terminal-muted">{kicker}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase text-terminal-text">{title}</h3>
            <TooltipWrapper tooltip="This primer explains the inputs, processing, and outputs for this page's analytical framework">
              <HelpCircle className="h-3 w-3 text-terminal-muted" />
            </TooltipWrapper>
          </div>
          <p className="text-sm text-terminal-muted">{description}</p>
        </div>
        
        {/* View Toggle */}
        {showDataFlow && dataFlowNodes.length > 0 && (
          <div className="flex items-center gap-1 bg-terminal-surface border border-terminal-border rounded">
            <button
              onClick={() => setActiveView("overview")}
              className={`px-3 py-1 text-xs font-mono rounded-l transition-colors ${
                activeView === "overview"
                  ? "bg-terminal-green/20 text-terminal-green"
                  : "text-terminal-muted hover:text-terminal-text"
              }`}
            >
              <FileText className="h-3 w-3 inline mr-1" />
              Overview
            </button>
            <button
              onClick={() => setActiveView("dataflow")}
              className={`px-3 py-1 text-xs font-mono rounded-r transition-colors ${
                activeView === "dataflow"
                  ? "bg-terminal-green/20 text-terminal-green"
                  : "text-terminal-muted hover:text-terminal-text"
              }`}
            >
              <Eye className="h-3 w-3 inline mr-1" />
              Data Flow
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeView === "overview" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-terminal-text">
          {finalItems.map((item) => {
            const isItemExpanded = expandedItems.has(item.title);
            const hasExpandedContent = item.expandedContent && expandable;
            
            return (
              <div key={item.title} className="bg-terminal-surface border border-terminal-border rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <TooltipWrapper tooltip={item.tooltip}>
                    <p className="text-terminal-muted uppercase tracking-wide flex items-center gap-1">
                      {item.title}
                      {item.tooltip && <HelpCircle className="h-3 w-3" />}
                    </p>
                  </TooltipWrapper>
                  
                  {hasExpandedContent && (
                    <button
                      onClick={() => toggleItemExpansion(item.title)}
                      className="text-terminal-muted hover:text-terminal-text transition-colors"
                    >
                      {isItemExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
                
                <p className="text-terminal-text">{item.content}</p>
                
                {hasExpandedContent && isItemExpanded && (
                  <div className="pt-2 border-t border-terminal-border">
                    <p className="text-xs text-terminal-muted leading-relaxed">
                      {item.expandedContent}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <DataFlowDiagram
          title="Data Processing Pipeline"
          nodes={dataFlowNodes}
          flows={dataFlowConnections}
          onNodeClick={(node) => {
            // Optional: Handle node clicks for additional detail
            console.log("Data flow node clicked:", node);
          }}
        />
      )}

      {/* Expandable Details */}
      {expandable && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-text transition-colors font-mono"
        >
          <ChevronRight className="h-3 w-3" />
          Show technical implementation details
        </button>
      )}

      {expandable && isExpanded && (
        <div className="border-t border-terminal-border pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-terminal-muted hover:text-terminal-text transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
            <h4 className="text-xs font-semibold uppercase text-terminal-text font-mono">
              Technical Implementation
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-2">
              <h5 className="text-terminal-muted uppercase">Data Sources</h5>
              <ul className="space-y-1 text-terminal-text">
                <li>• Real-time market feeds (5-second intervals)</li>
                <li>• Economic indicators (daily updates)</li>
                <li>• Regime classification models</li>
                <li>• Historical calibration data</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-terminal-muted uppercase">Processing Framework</h5>
              <ul className="space-y-1 text-terminal-text">
                <li>• Z-score normalization</li>
                <li>• Weighted composite calculation</li>
                <li>• Monte Carlo simulation</li>
                <li>• Statistical validation</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-terminal-bg border border-terminal-border rounded p-3">
            <h5 className="text-terminal-muted uppercase mb-2 text-xs">Quality Assurance</h5>
            <p className="text-xs text-terminal-text">
              All data undergoes real-time validation with institutional-grade quality checks. 
              Models are backtested monthly against historical events and maintain 90%+ accuracy 
              on regime detection and risk assessment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
