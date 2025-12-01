"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useDataLineage } from "@/hooks/useDataLineage";
import { useUpdateLog } from "@/hooks/useUpdateLog";
import { useComponentsData } from "@/hooks/useComponentsData";
import { TransparencyLineage, TransparencyUpdateLog } from "@/lib/types";
import LineageTimeline from "@/components/transparency/LineageTimeline";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";

function DataLineageContent() {
  const [selectedSeries, setSelectedSeries] = useState<string>("VIX");
  const { data: componentsData } = useComponentsData();
  const { data: lineageDataRaw, isLoading: lineageLoading } = useDataLineage(selectedSeries);
  const { data: updateLogDataRaw, isLoading: logLoading } = useUpdateLog();
  const lineageData = lineageDataRaw as TransparencyLineage | undefined;
  const updateLogData = updateLogDataRaw as TransparencyUpdateLog | undefined;
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  const availableSeries = componentsData?.components?.map(c => c.id) || ["VIX", "CREDIT_SPREAD", "WTI_OIL", "YIELD_CURVE", "UNEMPLOYMENT"];

  if (lineageLoading && logLoading) {
    return (
      <div className="terminal-card">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Series Selector */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            ECONOMIC INDICATOR SELECTION
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Choose an economic indicator to view its institutional data sources and quality metrics
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {availableSeries.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-3 py-2 text-xs font-mono rounded border transition-colors ${
                selectedSeries === series
                  ? "bg-terminal-green/20 text-terminal-green border-terminal-green/30"
                  : "bg-terminal-surface text-terminal-text border-terminal-border hover:bg-terminal-border/20"
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      {/* Lineage Overview */}
      {lineageData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="terminal-card">
            <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Data Availability</div>
            <StatusBadge variant={lineageData.status === "success" ? "good" : "critical"}>
              {lineageData.status === "success" ? "AVAILABLE" : "UNAVAILABLE"}
            </StatusBadge>
          </div>
          <div className="terminal-card">
            <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Historical Coverage</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">
              {lineageData.total_observations || 0}
            </div>
            <div className="text-xs text-terminal-muted font-mono">data points</div>
          </div>
          <div className="terminal-card">
            <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Last Updated</div>
            <div className="text-sm text-terminal-orange font-mono">
              {lineageData.latest_fetch ? new Date(lineageData.latest_fetch).toLocaleDateString() : "Unknown"}
            </div>
          </div>
          <div className="terminal-card">
            <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Data Freshness</div>
            <div className="text-lg text-terminal-text font-mono font-bold">
              {lineageData.observations?.[0]?.age_hours ? 
                (lineageData.observations[0].age_hours < 24 ? "Current" : 
                 lineageData.observations[0].age_hours < 168 ? "Recent" : "Historical") 
                : "Unknown"}
            </div>
          </div>
        </div>
      )}

      {/* Data Observations Table */}
      {lineageData?.observations && (
        <div className="terminal-card space-y-4">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              SOURCE VERIFICATION ({selectedSeries})
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Authoritative data sources with institutional quality standards
            </p>
          </div>

          <LineageTimeline lineage={lineageData} />

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="border-b border-terminal-border">
                <tr className="text-terminal-muted">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Value</th>
                  <th className="text-left p-2">Official Source</th>
                  <th className="text-left p-2">Last Verified</th>
                  <th className="text-left p-2">Update Frequency</th>
                  <th className="text-left p-2">Quality Status</th>
                </tr>
              </thead>
              <tbody>
                {lineageData.observations.slice(0, 10).map((obs, idx: number) => {
                  const isStale = obs.age_hours > (obs.soft_ttl / 3600);
                  const isExpired = obs.age_hours > (obs.hard_ttl / 3600);
                  
                  return (
                    <tr key={idx} className="border-b border-terminal-border/50">
                      <td className="p-2 text-terminal-text">
                        {new Date(obs.observed_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-terminal-text font-bold">
                        {typeof obs.value === 'number' ? obs.value.toFixed(2) : obs.value}
                      </td>
                      <td className="p-2">
                        <a 
                          href={obs.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-green hover:text-terminal-text underline"
                        >
                          {obs.source.toUpperCase()}
                        </a>
                      </td>
                      <td className="p-2 text-terminal-muted">
                        {obs.fetched_at ? new Date(obs.fetched_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-2 text-terminal-orange">
                        {obs.age_hours < 24 ? "Daily" : obs.age_hours < 168 ? "Weekly" : "Monthly"}
                      </td>
                      <td className="p-2">
                        <StatusBadge variant={
                          isExpired ? "critical" : isStale ? "warning" : "good"
                        }>
                          {isExpired ? "OUTDATED" : isStale ? "AGING" : "VERIFIED"}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Log */}
      {updateLogData?.entries && (
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              DATA SOURCE UPDATES
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Recent enhancements to data collection and validation processes
            </p>
          </div>

          <div className="space-y-3">
            {updateLogData.entries.map((entry, idx: number) => (
              <div key={idx} className="border border-terminal-border rounded p-3 bg-terminal-surface">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-terminal-text font-mono mb-1">
                      {entry.description}
                    </p>
                    <p className="text-xs text-terminal-muted font-mono">
                      {entry.date}
                    </p>
                  </div>
                  <StatusBadge variant="info">
                    UPDATE
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Quality Metrics */}
      {lineageData?.observations && (
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              INSTITUTIONAL QUALITY STANDARDS
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Institutional-grade verification and compliance metrics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <h4 className="font-mono text-sm font-semibold text-terminal-text mb-2">
                Official Data Source
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Authority</span>
                  <span className="text-xs font-mono font-bold text-terminal-green">
                    {lineageData.observations[0]?.source?.toUpperCase() || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Type</span>
                  <span className="text-xs font-mono font-bold text-terminal-text">
                    {lineageData.observations[0]?.derivation_flag === "direct" ? "PRIMARY" : "DERIVED"}
                  </span>
                </div>

                <StatusBadge variant="good">
                  INSTITUTIONAL GRADE
                </StatusBadge>
              </div>
            </div>

            <div className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <h4 className="font-mono text-sm font-semibold text-terminal-text mb-2">
                Update Reliability
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Standard Frequency</span>
                  <span className="text-xs font-mono font-bold text-terminal-text">
                    {lineageData.observations[0]?.soft_ttl && lineageData.observations[0].soft_ttl < 86400 ? "Daily" : 
                     lineageData.observations[0]?.soft_ttl && lineageData.observations[0].soft_ttl < 604800 ? "Weekly" : "Monthly"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">SLA Target</span>
                  <span className="text-xs font-mono font-bold text-terminal-text">
                    {lineageData.observations[0]?.hard_ttl ? `${(lineageData.observations[0].hard_ttl / 86400).toFixed(0)} days` : "N/A"}
                  </span>
                </div>

                <StatusBadge variant="info">
                  SLA COMPLIANT
                </StatusBadge>
              </div>
            </div>

            <div className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <h4 className="font-mono text-sm font-semibold text-terminal-text mb-2">
                Data Verification
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Validation ID</span>
                  <span className="text-xs font-mono font-bold text-terminal-text">
                    {lineageData.observations[0]?.checksum?.substring(0, 8) || "N/A"}...
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Data Points</span>
                  <span className="text-xs font-mono font-bold text-terminal-green">
                    {lineageData.total_observations}
                  </span>
                </div>

                <StatusBadge variant="good">
                  VERIFIED
                </StatusBadge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors"
          onClick={() =>
            openModal({
              title: "Export Source Verification Report",
              subtitle: "Institutional data sourcing documentation",
              sections: [
                { title: "Indicator", content: selectedSeries, type: "definition" },
                { title: "Documentation", content: "Official sources, update schedules, quality verification, institutional compliance standards.", type: "inputs" },
                { title: "Purpose", content: "Due diligence documentation for institutional risk assessment and regulatory compliance.", type: "outputs" },
              ],
            })
          }
        >
          Export Source Report →
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
          Refresh Data
        </button>
      </div>

      <MethodologyModal {...modalProps} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

export default function DataLineagePage() {
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Transparency Portal
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Data Sources & Methodology
          </h1>
          <p className="text-sm text-terminal-muted">
            Authoritative data sourcing, institutional verification, and quality assurance for risk intelligence indicators.
          </p>
        </header>
        <DataLineageContent />
      </main>
    </MainLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
