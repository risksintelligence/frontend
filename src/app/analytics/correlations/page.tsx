"use client";

import MainLayout from "@/components/layout/MainLayout";
import CorrelationMatrix from "@/components/analytics/CorrelationMatrix";

export default function CorrelationsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <CorrelationMatrix />
      </div>
    </MainLayout>
  );
}
