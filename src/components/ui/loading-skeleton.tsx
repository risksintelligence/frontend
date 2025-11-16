interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}
      aria-label="Loading content"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="Loading card">
      <div className="space-y-3">
        <Skeleton height="h-4" width="w-1/3" />
        <Skeleton height="h-8" width="w-1/2" />
        <div className="space-y-2">
          <Skeleton height="h-3" width="w-full" />
          <Skeleton height="h-3" width="w-3/4" />
        </div>
        <Skeleton height="h-3" width="w-1/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-label="Loading table">
      <div className="flex justify-between">
        <Skeleton height="h-3" width="w-1/4" />
        <Skeleton height="h-3" width="w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex justify-between border-t border-[#e2e8f0] pt-2">
          <Skeleton height="h-3" width="w-1/3" />
          <Skeleton height="h-3" width="w-1/5" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = '200px' }: { height?: string }) {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded animate-pulse"
      style={{ height }}
      aria-label="Loading chart"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span className="text-xs text-gray-500">Loading chart...</span>
      </div>
    </div>
  );
}