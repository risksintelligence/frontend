"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { Settings } from "lucide-react";

export default function SystemConfigPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  SYSTEM CONFIGURATION
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Infrastructure settings, API parameters, and system configuration management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="warning">CAUTION REQUIRED</StatusBadge>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        <div className="terminal-card">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-orange-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-terminal-text font-mono mb-4">
              SYSTEM CONFIGURATION PANEL
            </h2>
            <p className="text-terminal-muted font-mono mb-6 max-w-2xl mx-auto">
              Configure system parameters, API settings, cache layer behavior, 
              and infrastructure components. Modify polling intervals, timeout 
              values, and integration settings.
            </p>
            <div className="space-y-2 text-sm font-mono text-terminal-muted">
              <p>• 127 configurable parameters</p>
              <p>• Real-time configuration validation</p>
              <p>• Configuration backup and rollback</p>
              <p>• Change impact assessment</p>
            </div>
            <div className="mt-8 space-y-4">
              <StatusBadge variant="warning">HIGH IMPACT CHANGES</StatusBadge>
              <p className="text-xs text-terminal-muted font-mono">
                System configuration changes affect all users and may require service restart
              </p>
              <div className="border border-orange-500/50 bg-orange-50 rounded p-4">
                <p className="text-xs text-orange-800 font-mono">
                  ⚠️ Warning: Modifying core system settings may impact platform availability. 
                  Always create configuration backups before making changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}