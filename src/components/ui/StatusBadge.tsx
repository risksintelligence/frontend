"use client";

import { ReactNode } from "react";

type Variant = "info" | "good" | "warning" | "critical";

const VARIANT_STYLES: Record<Variant, string> = {
  info: "text-sky-700 bg-sky-50 border-sky-200",
  good: "text-emerald-700 bg-emerald-50 border-emerald-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
  critical: "text-red-700 bg-red-50 border-red-200",
};

interface StatusBadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export default function StatusBadge({
  variant = "info",
  children,
  className,
  size = "md",
}: StatusBadgeProps) {
  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";
  
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${sizeStyles} ${VARIANT_STYLES[variant]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
