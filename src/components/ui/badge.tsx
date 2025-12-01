"use client";

import * as React from "react";
import clsx from "clsx";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "outline"
          ? "border border-terminal-border text-terminal-text"
          : "bg-terminal-accent text-black",
        className
      )}
      {...props}
    />
  );
}
