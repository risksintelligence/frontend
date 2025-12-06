"use client";

import { AlertTriangle } from "lucide-react";

interface FallbackDataWarningProps {
  title?: string;
  description?: string;
  reason?: string;
  className?: string;
}

export default function FallbackDataWarning({ 
  title = "Displaying Synthetic Data",
  description = "External API services are currently unavailable. The data shown is simulated for demonstration purposes.",
  reason,
  className = "" 
}: FallbackDataWarningProps) {
  return (
    <div className={`bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h3 className="text-amber-400 font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-amber-200 text-sm">
        {description}
        {reason && (
          <span className="block text-xs text-amber-300 mt-1">
            Reason: {reason}
          </span>
        )}
      </p>
    </div>
  );
}