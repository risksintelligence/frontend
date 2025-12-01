"use client";

interface SkeletonLoaderProps {
  variant?: "card" | "text" | "chart" | "table" | "gauge";
  rows?: number;
  columns?: number;
  height?: string;
  className?: string;
}

const SkeletonShimmer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    {children}
  </div>
);

const CHART_BAR_HEIGHTS = [70, 40, 55, 80, 35, 60, 45, 50];

export default function SkeletonLoader({
  variant = "card",
  rows = 3,
  columns = 1,
  height = "200px",
  className = ""
}: SkeletonLoaderProps) {
  
  if (variant === "card") {
    return (
      <SkeletonShimmer className={`terminal-card ${className}`}>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-3 w-24 bg-terminal-surface rounded font-mono mb-2"></div>
            <div className="h-4 w-32 bg-terminal-surface rounded font-mono"></div>
          </div>
          <div className="h-6 w-16 bg-terminal-surface rounded"></div>
        </div>

        {/* Card Content */}
        <div className="space-y-3 mb-4">
          <div className="h-8 w-20 bg-terminal-surface rounded font-mono"></div>
          <div className="h-4 w-full bg-terminal-surface rounded"></div>
          <div className="h-4 w-3/4 bg-terminal-surface rounded"></div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-terminal-border pt-2">
          <div className="h-3 w-48 bg-terminal-surface rounded font-mono"></div>
        </div>
      </SkeletonShimmer>
    );
  }

  if (variant === "chart") {
    return (
      <SkeletonShimmer className={`terminal-card ${className}`}>
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-3 w-20 bg-terminal-surface rounded font-mono mb-2"></div>
            <div className="h-4 w-28 bg-terminal-surface rounded font-mono"></div>
          </div>
          <div className="h-6 w-12 bg-terminal-surface rounded"></div>
        </div>

        {/* Chart Area */}
        <div className="bg-terminal-surface rounded border border-terminal-border p-4 mb-4" style={{ height }}>
          {/* Y-axis labels */}
          <div className="flex h-full">
            <div className="flex flex-col justify-between w-8 mr-2">
              <div className="h-3 w-6 bg-white/50 rounded"></div>
              <div className="h-3 w-6 bg-white/50 rounded"></div>
              <div className="h-3 w-6 bg-white/50 rounded"></div>
              <div className="h-3 w-6 bg-white/50 rounded"></div>
            </div>
            
            {/* Chart bars/lines */}
            <div className="flex-1 flex items-end justify-between">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 bg-white/30 rounded"
                  style={{ height: `${CHART_BAR_HEIGHTS[i % CHART_BAR_HEIGHTS.length]}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Footer */}
        <div className="border-t border-terminal-border pt-2">
          <div className="h-3 w-44 bg-terminal-surface rounded font-mono"></div>
        </div>
      </SkeletonShimmer>
    );
  }

  if (variant === "table") {
    return (
      <SkeletonShimmer className={`terminal-card ${className}`}>
        {/* Table Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-3 w-20 bg-terminal-surface rounded font-mono mb-2"></div>
            <div className="h-4 w-32 bg-terminal-surface rounded font-mono"></div>
          </div>
          <div className="h-6 w-16 bg-terminal-surface rounded"></div>
        </div>

        {/* Table Content */}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-terminal-surface rounded border border-terminal-border">
              <div className="flex-1">
                <div className="h-4 w-24 bg-white/30 rounded font-mono mb-1"></div>
                <div className="h-3 w-32 bg-white/20 rounded"></div>
              </div>
              <div className="text-right">
                <div className="h-5 w-12 bg-white/30 rounded font-mono mb-1"></div>
                <div className="h-3 w-16 bg-white/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="border-t border-terminal-border pt-2 mt-4">
          <div className="h-3 w-48 bg-terminal-surface rounded font-mono"></div>
        </div>
      </SkeletonShimmer>
    );
  }

  if (variant === "gauge") {
    return (
      <SkeletonShimmer className={`terminal-card ${className}`}>
        {/* Gauge Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-3 w-20 bg-terminal-surface rounded font-mono mb-2"></div>
            <div className="h-4 w-32 bg-terminal-surface rounded font-mono"></div>
          </div>
          <div className="h-6 w-16 bg-terminal-surface rounded"></div>
        </div>

        {/* Gauge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: columns || 3 }).map((_, i) => (
            <div key={i} className="bg-terminal-surface rounded border border-terminal-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-16 bg-white/30 rounded font-mono"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
              </div>
              
              {/* Gauge Circle */}
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white/50"></div>
              </div>
              
              <div className="text-center">
                <div className="h-5 w-12 bg-white/30 rounded font-mono mx-auto mb-1"></div>
                <div className="h-3 w-16 bg-white/20 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Gauge Footer */}
        <div className="border-t border-terminal-border pt-2">
          <div className="h-3 w-48 bg-terminal-surface rounded font-mono"></div>
        </div>
      </SkeletonShimmer>
    );
  }

  if (variant === "text") {
    return (
      <SkeletonShimmer className={className}>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-terminal-surface rounded"
              style={{ 
                width: i === rows - 1 ? "60%" : "100%" 
              }}
            ></div>
          ))}
        </div>
      </SkeletonShimmer>
    );
  }

  return null;
}
