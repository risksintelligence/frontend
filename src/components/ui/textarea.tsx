"use client";

import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm font-mono text-terminal-text placeholder:text-terminal-muted focus:border-terminal-green focus:outline-none ${className}`}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
