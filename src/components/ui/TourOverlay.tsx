"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
}

interface TourOverlayProps {
  steps: TourStep[];
  onClose: () => void;
}

export default function TourOverlay({ steps, onClose }: TourOverlayProps) {
  const [index, setIndex] = useState(0);
  const step = steps[index];

  const next = () => setIndex((i) => Math.min(steps.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-lg w-full mx-4 bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">Quick Tour</p>
            <h3 className="text-lg font-bold text-terminal-text font-mono">{step.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-terminal-muted">{step.description}</p>
        <div className="flex items-center justify-between text-xs text-terminal-muted font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={index === 0}
              className="flex items-center gap-1 px-3 py-1 rounded border border-terminal-border hover:bg-terminal-surface disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={next}
              disabled={index === steps.length - 1}
              className="flex items-center gap-1 px-3 py-1 rounded border border-terminal-border hover:bg-terminal-surface disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <span>
            Step {index + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
