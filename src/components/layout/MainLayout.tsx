"use client";

import { ReactNode } from "react";
import Navigation from "./Navigation";
import Header from "./Header";
import RightRail from "./RightRail";
import TourOverlay from "../ui/TourOverlay";
import LiveIntelligenceHeader from "../ui/LiveIntelligenceHeader";
import { useGuidedTour } from "@/hooks/useGuidedTour";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { showTour, tourSteps, closeTour, startTour } = useGuidedTour();

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Fixed Global Header - Full Width */}
      <Header />
      <LiveIntelligenceHeader onShowTour={startTour} />
      
      {/* Main Layout with Navigation */}
      <div className="lg:flex lg:min-h-[calc(100vh-theme(spacing.32))]">
        <Navigation />
        <div className="flex-1 lg:flex">
          <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
          <RightRail />
        </div>
      </div>
      
      {showTour && (
        <TourOverlay steps={tourSteps} onClose={closeTour} />
      )}
    </div>
  );
}
