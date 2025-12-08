"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { Users } from "lucide-react";

export default function ReviewerPortalPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  REVIEWER PORTAL
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Peer review system for research submissions and quality assurance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="warning">AUTH REQUIRED</StatusBadge>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        <div className="terminal-card">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-purple-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-terminal-text font-mono mb-4">
              PEER REVIEW DASHBOARD
            </h2>
            <p className="text-terminal-muted font-mono mb-6 max-w-2xl mx-auto">
              Access submission queue, review assignments, and evaluation 
              dashboards. Manage peer review workflow for research submissions 
              and maintain quality standards.
            </p>
            <div className="space-y-2 text-sm font-mono text-terminal-muted">
              <p>• 5 submissions pending review</p>
              <p>• Expert reviewer network</p>
              <p>• Structured evaluation forms</p>
              <p>• Review timeline tracking</p>
            </div>
            <div className="mt-8">
              <StatusBadge variant="warning">AUTHENTICATION REQUIRED</StatusBadge>
              <p className="text-xs text-terminal-muted font-mono mt-2">
                Please contact administration for reviewer access credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}