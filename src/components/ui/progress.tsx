"use client";

import * as React from "react";
import clsx from "clsx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({ value = 0, max = 100, className, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={clsx(
        "w-full h-2 rounded bg-terminal-border overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-terminal-accent"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
