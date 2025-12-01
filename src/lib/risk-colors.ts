export type RiskLevelName =
  | "CRITICAL"
  | "HIGH"
  | "MODERATE"
  | "LOW"
  | "MINIMAL";

export interface RiskLevel {
  name: RiskLevelName;
  scoreRange: [number, number];
  semanticColor: "red" | "amber" | "green";
  meaning: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

const RISK_LEVELS: RiskLevel[] = [
  {
    name: "CRITICAL",
    scoreRange: [80, 100],
    semanticColor: "red",
    meaning: "Immediate action required",
    urgency: "HIGH",
  },
  {
    name: "HIGH",
    scoreRange: [60, 79],
    semanticColor: "red",
    meaning: "High attention needed",
    urgency: "HIGH",
  },
  {
    name: "MODERATE",
    scoreRange: [40, 59],
    semanticColor: "amber",
    meaning: "Monitor closely",
    urgency: "MEDIUM",
  },
  {
    name: "LOW",
    scoreRange: [20, 39],
    semanticColor: "green",
    meaning: "Acceptable risk",
    urgency: "LOW",
  },
  {
    name: "MINIMAL",
    scoreRange: [0, 19],
    semanticColor: "green",
    meaning: "Negligible risk",
    urgency: "LOW",
  },
];

export const ACCESSIBILITY_PATTERNS: Record<
  RiskLevel["semanticColor"],
  string
> = {
  red: "●",
  amber: "▲",
  green: "■",
};

export function getRiskLevel(score: number): RiskLevel {
  const normalized = Number.isFinite(score)
    ? Math.max(0, Math.min(100, score))
    : 0;

  return (
    RISK_LEVELS.find(
      (level) =>
        normalized >= level.scoreRange[0] && normalized <= level.scoreRange[1],
    ) ?? RISK_LEVELS[0]
  );
}

export function getRiskTextColor(score: number): string {
  const { semanticColor } = getRiskLevel(score);
  if (semanticColor === "red") return "text-terminal-red";
  if (semanticColor === "amber") return "text-terminal-orange";
  return "text-terminal-green";
}

export function getRiskBgColor(score: number): string {
  const { semanticColor } = getRiskLevel(score);
  if (semanticColor === "red") return "bg-terminal-red/10";
  if (semanticColor === "amber") return "bg-terminal-orange/10";
  return "bg-terminal-green/10";
}

export function getRiskBorderColor(score: number): string {
  const { semanticColor } = getRiskLevel(score);
  if (semanticColor === "red") return "border-terminal-red/40";
  if (semanticColor === "amber") return "border-terminal-orange/40";
  return "border-terminal-green/40";
}

export function getGaugeColor(score: number): string {
  const { semanticColor } = getRiskLevel(score);
  if (semanticColor === "red") return "#dc2626";
  if (semanticColor === "amber") return "#f59e0b";
  return "#10b981";
}

export function getStatusBadgeVariant(
  score: number,
): "critical" | "warning" | "good" | "info" {
  const { semanticColor } = getRiskLevel(score);
  if (semanticColor === "red") return "critical";
  if (semanticColor === "amber") return "warning";
  return "good";
}

export function getAccessibilityPattern(score: number): string {
  const { semanticColor } = getRiskLevel(score);
  return ACCESSIBILITY_PATTERNS[semanticColor];
}

export function getTrendColor(trend: "rising" | "falling" | "stable"): string {
  if (trend === "rising") return "text-terminal-red";
  if (trend === "falling") return "text-terminal-green";
  return "text-terminal-muted";
}
