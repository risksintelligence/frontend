"use client";

import MainLayout from "@/components/layout/MainLayout";
import ScenarioAnalysis from "@/components/analytics/ScenarioAnalysis";
import TourOverlay from "@/components/ui/TourOverlay";
import { useState } from "react";

export default function ScenariosPage() {
  const [showTour, setShowTour] = useState(false);
  const tourSteps = [
    { title: "Scenario Library", description: "Choose predefined shocks or craft custom scenarios with live inputs." },
    { title: "Impact Panels", description: "See GRII deltas, sector impacts, and driver shifts per scenario." },
    { title: "Explainability", description: "Open explain/export buttons to view driver breakdowns or download reports." },
  ];

  return (
    <MainLayout>
      <main className="px-6 py-6 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">Scenario Studio</p>
            <h1 className="text-2xl font-bold uppercase text-terminal-text">Scenario Analysis</h1>
            <p className="text-sm text-terminal-muted">Stress and custom scenario impacts on GRII, regimes, and drivers.</p>
          </div>
          <button
            className="text-xs font-mono text-terminal-green hover:text-terminal-text transition-colors"
            onClick={() => setShowTour(true)}
          >
            Start Tour →
          </button>
        </header>
        <ScenarioAnalysis />
        {showTour && <TourOverlay steps={tourSteps} onClose={() => setShowTour(false)} />}
      </main>
    </MainLayout>
  );
}
