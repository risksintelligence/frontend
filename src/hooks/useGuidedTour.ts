"use client";

import { useState, useEffect } from "react";

interface TourStep {
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to RRIO",
    description: "The RiskSX Resilience Intelligence Observatory provides AI-powered risk intelligence for finance and supply chain professionals. Let's take a quick tour of the key features.",
  },
  {
    title: "Real-Time Risk Intelligence",
    description: "Monitor global economic resilience with our GERI score (0-100), updated every 30 seconds using advanced Hidden Markov Models and neural networks.",
  },
  {
    title: "Professional Navigation",
    description: "The 'About RRIO' section provides comprehensive guides for finance and supply chain professionals, including methodology explanations and practical use cases.",
  },
  {
    title: "Risk Analytics Dashboard",
    description: "Access regime classification, anomaly detection, and 24-hour Monte Carlo forecasts to anticipate market disruptions and supply chain vulnerabilities.",
  },
  {
    title: "Explainable AI Insights",
    description: "Understand the 'why' behind risk signals with SHAP and LIME analysis, providing transparency into our AI models' decision-making process.",
  },
  {
    title: "Network Dependencies",
    description: "Visualize critical supply chain dependencies and partner reliability metrics to identify potential cascade risks before they impact operations.",
  },
  {
    title: "Scenario Planning & Stress Testing",
    description: "Run Monte Carlo simulations and stress tests to evaluate portfolio resilience and supply chain robustness under various economic scenarios.",
  },
  {
    title: "Get Started Today",
    description: "Ready to transform your risk intelligence? Visit 'Getting Started' in the About RRIO section for role-specific implementation guides.",
  },
];

const TOUR_STORAGE_KEY = "rrio_tour_completed";

export function useGuidedTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      // Show tour after a short delay to let the page load
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowTour(true);
  };

  return {
    showTour,
    tourSteps: TOUR_STEPS,
    startTour,
    closeTour,
    resetTour,
  };
}