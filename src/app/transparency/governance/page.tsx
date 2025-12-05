"use client";

import MainLayout from "@/components/layout/MainLayout";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";
import { useGovernanceModels } from "@/hooks/useGovernanceModels";
import { useGovernanceCompliance } from "@/hooks/useGovernanceCompliance";
import { useExplainabilityAudit } from "@/hooks/useExplainabilityAudit";
import { useState } from "react";

function GovernanceModelsTable() {
  const { data, isLoading } = useGovernanceModels();

  if (isLoading) return <SkeletonLoader variant="card" />;
  if (!data) return <p className="text-sm text-terminal-muted">No governance data available.</p>;

  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Model Registry</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">Governance Models</h3>
        </div>
        <StatusBadge variant="good">Live</StatusBadge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono text-terminal-text">
          <thead className="text-terminal-muted">
            <tr>
              <th className="py-2 text-left">Model</th>
              <th className="py-2 text-left">Version</th>
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Risk</th>
              <th className="py-2 text-left">Registered</th>
            </tr>
          </thead>
          <tbody>
            {data.models.map((m) => (
              <tr key={`${m.model_id}_${m.version}`} className="border-t border-terminal-border">
                <td className="py-2">{m.model_id}</td>
                <td className="py-2">{m.version}</td>
                <td className="py-2">{m.model_type}</td>
                <td className="py-2">
                  <StatusBadge variant={m.risk_level === "high" ? "critical" : m.risk_level === "medium" ? "warning" : "good"}>
                    {m.risk_level || "minimal"}
                  </StatusBadge>
                </td>
                <td className="py-2">{new Date(m.registered_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModelDetailsSection({ modelName, modelsData }: { modelName: string; modelsData?: GovernanceModelsResponse }) {
  const selectedModel = modelsData?.models?.find((m) => m.model_id === modelName);
  
  if (!selectedModel) {
    return <div className="text-sm text-terminal-muted">Model details not available.</div>;
  }

  return (
    <div className="terminal-card space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">Model Details</p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">
          {selectedModel.model_id} v{selectedModel.version}
        </h3>
        <p className="text-xs text-terminal-muted mt-1">
          Comprehensive model information and technical specifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Information */}
        <div className="space-y-4">
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
              Model Information
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-terminal-muted">Model Type</span>
                <span className="text-terminal-text font-bold">{selectedModel.model_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-terminal-muted">Version</span>
                <span className="text-terminal-text font-bold">v{selectedModel.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-terminal-muted">Created</span>
                <span className="text-terminal-text">{new Date(selectedModel.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-terminal-muted">Training Hash</span>
                <span className="text-terminal-text font-mono text-xs">
                  {selectedModel.training_data_hash?.substring(0, 12)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-terminal-muted">Artifact Status</span>
                <StatusBadge variant={selectedModel.checksum === "artifact_not_found" ? "warning" : "good"}>
                  {selectedModel.checksum === "artifact_not_found" ? "DEMO MODE" : "VERIFIED"}
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
              Performance Metrics
            </h4>
            <div className="space-y-2">
              {selectedModel.performance_metrics && Object.entries(selectedModel.performance_metrics as Record<string, unknown>).map(([metric, value]) => (
                <div key={metric} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-terminal-muted capitalize">
                    {metric.replace(/_/g, ' ')}
                  </span>
                  <span className="text-terminal-green font-bold">
                    {typeof value === 'number' ? value.toFixed(3) : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
              Hyperparameters
            </h4>
            <div className="space-y-2">
              {selectedModel.hyperparameters && Object.entries(selectedModel.hyperparameters as Record<string, unknown>).map(([param, value]) => (
                <div key={param} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-terminal-muted">
                    {param.replace(/_/g, ' ')}
                  </span>
                  <span className="text-terminal-text font-bold">
                    {typeof value === 'boolean' ? (value ? 'True' : 'False') : value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
              Risk Assessment
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-terminal-muted font-mono">Economic Impact</span>
                <StatusBadge variant="critical">HIGH</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-terminal-muted font-mono">Regulatory Scope</span>
                <StatusBadge variant="warning">MONITORED</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-terminal-muted font-mono">Transparency Requirement</span>
                <StatusBadge variant="good">COMPLIANT</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-terminal-muted font-mono">Human Oversight</span>
                <StatusBadge variant="good">ACTIVE</StatusBadge>
              </div>
            </div>
          </div>

          {/* Usage Context */}
          <div className="bg-terminal-surface border border-terminal-border rounded p-4">
            <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
              Intended Use Case
            </h4>
            <div className="text-xs text-terminal-muted font-mono space-y-2">
              <p className="text-terminal-text">
                {selectedModel.model_id === 'regime_classifier' 
                  ? 'Economic regime classification for institutional risk assessment and portfolio optimization'
                  : selectedModel.model_id === 'forecast_model'
                  ? 'Economic forecasting and predictive analytics for institutional decision making'
                  : 'AI/ML model for economic intelligence and risk management'
                }
              </p>
              <div className="space-y-1 mt-3">
                <div className="text-terminal-muted uppercase text-xs">Key Applications:</div>
                <ul className="list-disc list-inside space-y-1 text-terminal-text">
                  {selectedModel.model_id === 'regime_classifier' ? (
                    <>
                      <li>Market regime identification and classification</li>
                      <li>Risk factor correlation analysis</li>
                      <li>Portfolio allocation optimization</li>
                      <li>Stress testing scenario generation</li>
                    </>
                  ) : selectedModel.model_id === 'forecast_model' ? (
                    <>
                      <li>Economic indicator forecasting</li>
                      <li>Risk scenario modeling</li>
                      <li>Market volatility prediction</li>
                      <li>Trend analysis and early warning</li>
                    </>
                  ) : (
                    <>
                      <li>General economic intelligence</li>
                      <li>Risk assessment support</li>
                      <li>Decision support analytics</li>
                      <li>Institutional compliance monitoring</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Limitations and Considerations */}
      <div className="bg-terminal-surface border border-terminal-border rounded p-4">
        <h4 className="font-mono text-sm font-semibold text-terminal-text mb-3">
          Limitations and Considerations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <div className="text-terminal-muted uppercase mb-2">Known Limitations</div>
            <ul className="space-y-1 text-terminal-text">
              {selectedModel.model_id === 'regime_classifier' ? (
                <>
                  <li>• Limited to US economic data coverage</li>
                  <li>• Requires quarterly model retraining</li>
                  <li>• Performance degrades during crisis periods</li>
                  <li>• Sensitive to data quality variations</li>
                </>
              ) : selectedModel.model_id === 'forecast_model' ? (
                <>
                  <li>• 6-month maximum prediction horizon</li>
                  <li>• Reduced accuracy during high volatility</li>
                  <li>• Requires continuous market data feed</li>
                  <li>• Limited to established economic patterns</li>
                </>
              ) : (
                <>
                  <li>• Model-specific limitations apply</li>
                  <li>• Regular validation required</li>
                  <li>• Performance monitoring active</li>
                  <li>• Human oversight recommended</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <div className="text-terminal-muted uppercase mb-2">Operational Notes</div>
            <ul className="space-y-1 text-terminal-text">
              <li>• NIST AI RMF compliance maintained</li>
              <li>• Continuous drift monitoring active</li>
              <li>• Model versioning strictly enforced</li>
              <li>• Audit trail fully documented</li>
              <li>• Performance baselines established</li>
              <li>• Human oversight protocols in place</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompliancePanel({ modelName }: { modelName: string }) {
  const { data, isLoading } = useGovernanceCompliance(modelName);
  if (isLoading) return <SkeletonLoader variant="card" />;
  if (!data?.compliance_report) return <p className="text-sm text-terminal-muted">No compliance report.</p>;
  const r = data.compliance_report;
  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Compliance</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">NIST AI RMF</h3>
        </div>
        <StatusBadge variant={r.compliance_status === "compliant" ? "good" : "warning"}>
          {r.compliance_status}
        </StatusBadge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-terminal-surface border border-terminal-border rounded p-3">
          <p className="text-terminal-muted uppercase">Overall</p>
          <p className="text-terminal-text text-lg font-bold">{(r.overall_compliance_score * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded p-3">
          <p className="text-terminal-muted uppercase">Govern</p>
          <p className="text-terminal-text text-lg font-bold">{(r.nist_rmf_functions.govern * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded p-3">
          <p className="text-terminal-muted uppercase">Map</p>
          <p className="text-terminal-text text-lg font-bold">{(r.nist_rmf_functions.map * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-terminal-surface border border-terminal-border rounded p-3">
          <p className="text-terminal-muted uppercase">Measure</p>
          <p className="text-terminal-text text-lg font-bold">{(r.nist_rmf_functions.measure * 100).toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}

function AuditLogPanel() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startISO = start.toISOString();
  const endISO = end.toISOString();
  const { data, isLoading } = useExplainabilityAudit(startISO, endISO);

  if (isLoading) return <SkeletonLoader variant="card" />;
  if (!data) return <p className="text-sm text-terminal-muted">No audit logs.</p>;

  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">Explainability</p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">Audit Log</h3>
        </div>
        <StatusBadge variant="info">{data.total_entries} entries</StatusBadge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono text-terminal-text">
          <thead className="text-terminal-muted">
            <tr>
              <th className="py-2 text-left">Decision</th>
              <th className="py-2 text-left">Model</th>
              <th className="py-2 text-left">User</th>
              <th className="py-2 text-left">Level</th>
              <th className="py-2 text-left">Accessed</th>
            </tr>
          </thead>
          <tbody>
            {data.audit_logs.slice(0, 10).map((log) => (
              <tr key={log.decision_id} className="border-t border-terminal-border">
                <td className="py-2">{log.decision_id}</td>
                <td className="py-2">{log.model_id} v{log.model_version}</td>
                <td className="py-2">{log.accessed_by}</td>
                <td className="py-2">{log.explanation_level}</td>
                <td className="py-2">{new Date(log.access_timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const { data: modelsData } = useGovernanceModels();
  const firstModel = modelsData?.models?.[0]?.model_id ?? "";
  const [selectedModel, setSelectedModel] = useState<string>("");
  const effectiveModel = selectedModel || firstModel;

  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">Governance & Compliance</p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">Institutional Trust</h1>
            <p className="text-sm text-terminal-muted">
              AI governance, provenance, and compliance telemetry surfaced for admins.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge variant="good">Live</StatusBadge>
            <span className="text-xs font-mono text-terminal-muted">Request IDs propagated</span>
          </div>
        </header>

        <GovernanceModelsTable />

        <div className="terminal-card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">Compliance Report</p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">Select Model</h3>
            </div>
            <select
              className="bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-xs font-mono text-terminal-text"
              value={effectiveModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {(modelsData?.models || []).map((m) => (
                <option key={m.model_id} value={m.model_id}>
                  {m.model_id} v{m.version}
                </option>
              ))}
            </select>
          </div>
          {effectiveModel ? (
            <CompliancePanel modelName={effectiveModel} />
          ) : (
            <p className="text-sm text-terminal-muted">No models to report.</p>
          )}
        </div>

        {/* Model Details Section */}
        {effectiveModel && (
          <ModelDetailsSection modelName={effectiveModel} modelsData={modelsData} />
        )}

        <AuditLogPanel />
      </main>
    </MainLayout>
  );
}
