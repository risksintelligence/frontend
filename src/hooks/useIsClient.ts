"use client";

import { useEffect, useState } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(
    () => typeof window !== "undefined",
  );

  useEffect(() => {
    if (!isClient) {
      const id = requestAnimationFrame(() => setIsClient(true));
      return () => cancelAnimationFrame(id);
    }
    return;
  }, [isClient]);

  return isClient;
}
