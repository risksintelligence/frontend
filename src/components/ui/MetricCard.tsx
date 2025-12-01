"use client";

import {
  getAccessibilityPattern,
  getRiskLevel,
  getRiskTextColor,
  getTrendColor,
} from "@/lib/risk-colors";
import StatusBadge from "./StatusBadge";
import Tooltip from "./Tooltip";
import MethodologyModal, { useMethodologyModal } from "./MethodologyModal";
import { HelpCircle, Info } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  riskScore?: number;
  trend?: "rising" | "falling" | "stable";
  timestamp?: string;
  loading?: boolean;
  footer?: string;
  tooltip?: string;
  showMethodology?: boolean;
  methodologyTitle?: string;
  methodologyContent?: Array<{
    title: string;
    content: string;
    type?: "definition" | "inputs" | "process" | "outputs" | "technical";
  }>;
}

export default function MetricCard({
  title,
  value,
  description,
  riskScore,
  trend,
  timestamp,
  loading = false,
  footer,
  tooltip,
  showMethodology = false,
  methodologyTitle,
  methodologyContent = [],
}: MetricCardProps) {
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();
  if (loading) {
    return (
      <div className="terminal-card animate-pulse space-y-4">
        <div className="h-4 w-2/5 rounded bg-terminal-border/60" />
        <div className="h-8 w-3/5 rounded bg-terminal-border/60" />
        <div className="h-3 w-1/2 rounded bg-terminal-border/60" />
      </div>
    );
  }

  const riskLevel = riskScore !== undefined ? getRiskLevel(riskScore) : null;
  const riskColor = riskScore !== undefined ? getRiskTextColor(riskScore) : "";
  const pattern =
    riskScore !== undefined ? getAccessibilityPattern(riskScore) : null;
  const badgeVariant =
    riskLevel?.semanticColor === "red"
      ? "critical"
      : riskLevel?.semanticColor === "amber"
        ? "warning"
        : "good";

  const handleMethodologyClick = () => {
    if (methodologyContent.length > 0) {
      openModal({
        title: methodologyTitle || `${title} Methodology`,
        subtitle: "Understanding the calculation and interpretation",
        sections: methodologyContent,
        riskBand: (riskLevel?.name ?? "").toLowerCase() as "critical" | "high" | "low" | "moderate" | "minimal",
      });
    }
  };

  const getRiskBandTooltip = () => {
    if (!riskScore || !riskLevel) return "";
    
    const descriptions = {
      "Minimal": "Stable conditions with no significant stress indicators detected. All systems operating within normal parameters.",
      "Low": "Mild tension observed in selective indicators. Continued monitoring recommended but no immediate action required.",
      "Moderate": "Systemic vigilance required. Early warning stage with elevated stress across multiple indicators.",
      "High": "Elevated stress across financial or supply chain indicators. Increased monitoring and preparation advised.",
      "Critical": "Severe dislocation detected. Immediate attention and decisive action recommended to mitigate risks."
    };
    
    return descriptions[riskLevel.name as keyof typeof descriptions] || "";
  };

  return (
    <>
      <div className="terminal-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-terminal-muted">
              {title}
            </p>
            {tooltip && (
              <Tooltip content={tooltip} placement="top">
                <Info className="w-3 h-3 text-terminal-muted cursor-help" />
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-2">
            {riskLevel && pattern && (
              <Tooltip content={getRiskBandTooltip()} placement="left">
                <StatusBadge variant={badgeVariant} size="sm">
                  {pattern} {riskLevel.name}
                </StatusBadge>
              </Tooltip>
            )}
            {showMethodology && methodologyContent.length > 0 && (
              <Tooltip content="View methodology and calculation details" placement="left">
                <button
                  onClick={handleMethodologyClick}
                  className="p-1 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
                  aria-label={`View ${title} methodology`}
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

      <div className="flex items-baseline gap-3">
        <p className={`text-3xl font-bold ${riskColor}`}>{value}</p>
        {trend && (
          <span className={`text-[10px] font-semibold ${getTrendColor(trend)}`}>
            {trend === "rising" ? "↗" : trend === "falling" ? "↘" : "→"}{" "}
            {trend.toUpperCase()}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-terminal-muted">{description}</p>
      )}

      {timestamp && (
        <p className="text-[11px] text-terminal-muted">
          Last Updated: {new Date(timestamp).toLocaleTimeString()} UTC
        </p>
      )}

        {footer && (
          <p className="text-[11px] uppercase tracking-wide text-terminal-muted">
            {footer}
          </p>
        )}
      </div>
      
      <MethodologyModal
        {...modalProps}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}
