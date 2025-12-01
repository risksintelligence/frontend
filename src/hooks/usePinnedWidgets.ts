"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rrio_my_desk_pins_v1";
const DEFAULT_PINS = ["grii", "forecast", "network", "transparency"];

function loadInitialPins() {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      }
    }
  } catch {
    // ignore and fall back
  }
  return DEFAULT_PINS;
}

export function usePinnedWidgets() {
  const [pins, setPins] = useState<string[]>(loadInitialPins);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
      }
    } catch {
      // ignore storage errors
    }
  }, [pins]);

  const isPinned = useCallback((id: string) => pins.includes(id), [pins]);

  const togglePin = useCallback((id: string) => {
    setPins((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  }, []);

  return { pins, isPinned, togglePin, setPins };
}
