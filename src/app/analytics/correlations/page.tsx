"use client";

import MainLayout from "@/components/layout/MainLayout";
import CorrelationMatrix from "@/components/analytics/CorrelationMatrix";

export default function CorrelationsPage() {
  return (
    <MainLayout>
      <main className="px-6 py-6">
        <CorrelationMatrix />
      </main>
    </MainLayout>
  );
}
