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
    <div className="flex min-h-screen bg-terminal-bg text-terminal-text">
      <Navigation />
      <div className="flex-1">
        <Header onShowTour={startTour} />
        <div className="flex">
          <div className="flex-1 px-6 py-6">{children}</div>
          <RightRail />
        </div>
      </div>
      {showTour && (
        <TourOverlay steps={tourSteps} onClose={closeTour} />
      )}
    </div>
  );
}
