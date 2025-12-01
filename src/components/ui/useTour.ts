"use client";

import { useState } from "react";

export interface TourStep {
  title: string;
  description: string;
}

export function useTour(steps: TourStep[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const start = () => {
    setIndex(0);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);
  const next = () => setIndex((i) => Math.min(steps.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return { isOpen, index, step: steps[index], steps, start, close, next, prev };
}
