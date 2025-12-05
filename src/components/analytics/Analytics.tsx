"/* eslint-disable @typescript-eslint/no-explicit-any */\n"
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export default function Analytics() {
  const pathname = usePathname();

  const trackPageView = async (path: string) => {
    // Only run on client side to avoid hydration issues
    if (typeof window === "undefined") return;
    
    try {
      const response = await fetch("/api/v1/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          timestamp: new Date().toISOString(),
          userAgent: navigator?.userAgent || "",
          referrer: document?.referrer || "",
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        }),
      });
      
      // Log errors for debugging in development
      if (!response.ok && process.env.NODE_ENV === 'development') {
        console.warn(`Analytics page-view tracking failed: ${response.status}`);
      }
    } catch (error) {
      // Silent fail for analytics in production, log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics page-view tracking error:', error);
      }
    }
  };

  useEffect(() => {
    if (MEASUREMENT_ID && typeof window !== "undefined" && typeof window.gtag !== "undefined") {
      window.gtag("config", MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
    void trackPageView(pathname);
  }, [pathname]);

  return null;
}

// Hook for custom event tracking
export const useAnalytics = () => {
  const trackEvent = (
    eventName: string,
    parameters: Record<string, unknown> = {}
  ) => {
    if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
      window.gtag("event", eventName, {
        custom_parameter: parameters,
        event_category: "user_interaction",
        event_label: (parameters as { label?: string }).label || eventName,
      });
    }

    // Only track on client side to avoid hydration issues
    if (typeof window !== "undefined") {
      fetch("/api/v1/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventName,
          parameters,
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
        }),
      }).then(response => {
        // Log errors for debugging in development
        if (!response.ok && process.env.NODE_ENV === 'development') {
          console.warn(`Analytics event tracking failed: ${response.status}`);
        }
      }).catch((error) => {
        // Silent fail for analytics in production, log in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Analytics event tracking error:', error);
        }
      });
    }
  };

  const trackGRIIInteraction = (action: string, value?: number) => {
    trackEvent("grii_interaction", {
      action,
      value,
      label: `GRII ${action}`,
    });
  };

  const trackSimulationRun = (type: "monte_carlo" | "stress_test", parameters: Record<string, unknown>) => {
    trackEvent("simulation_run", {
      simulation_type: type,
      parameters,
      label: `${type} simulation`,
    });
  };

  const trackExplainabilityUsage = (method: "shap" | "lime", feature: string) => {
    trackEvent("explainability_usage", {
      method,
      feature,
      label: `${method} analysis`,
    });
  };

  const trackExport = (type: string, format: string) => {
    trackEvent("data_export", {
      export_type: type,
      format,
      label: `Export ${type}`,
    });
  };

  const trackPrimerInteraction = (action: "expand" | "view_dataflow", page: string) => {
    trackEvent("primer_interaction", {
      action,
      page,
      label: `Primer ${action}`,
    });
  };

  return {
    trackEvent,
    trackGRIIInteraction,
    trackSimulationRun,
    trackExplainabilityUsage,
    trackExport,
    trackPrimerInteraction,
  };
};
