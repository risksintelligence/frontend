"use client";

import { ReactNode } from "react";
import Navigation from "./Navigation";
import Header from "./Header";
import RightRail from "./RightRail";
import TourOverlay from "../ui/TourOverlay";
import { useGuidedTour } from "@/hooks/useGuidedTour";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { showTour, tourSteps, closeTour, startTour } = useGuidedTour();

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      <div className="lg:flex lg:min-h-screen">
        <Navigation />
        <div className="flex-1 lg:flex lg:flex-col">
          <Header onShowTour={startTour} />
          <div className="flex-1 lg:flex">
            <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
            <RightRail />
          </div>
        </div>
      </div>
      {showTour && (
        <TourOverlay steps={tourSteps} onClose={closeTour} />
      )}
    </div>
  );
}
