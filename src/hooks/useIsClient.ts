"use client";

import { useEffect, useState } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Use a microtask to avoid synchronous setState within effect
    Promise.resolve().then(() => {
      setIsClient(true);
    });
  }, []);

  return isClient;
}
