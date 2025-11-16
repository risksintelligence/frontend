'use client';

import React, { lazy, Suspense } from 'react';
import { ChartSkeleton } from './ui/loading-skeleton';

// Lazy load chart components for better performance
const ZScoreChart = lazy(() => import('./charts/z-score-chart'));

interface LazyChartProps {
  type: 'zscore';
  data: any;
  component: string;
}

export default function LazyChart({ type, data, component }: LazyChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height="200px" />}>
      {type === 'zscore' && <ZScoreChart data={data} component={component} />}
    </Suspense>
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  threshold = 0.1,
  rootMargin = '50px'
) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
}