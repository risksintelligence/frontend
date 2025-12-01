"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import OfflineDetector from "@/components/error/OfflineDetector";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchInterval: 30_000,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <ErrorBoundary context="RootApplication">
        <OfflineDetector>
          {children}
        </OfflineDetector>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
