"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { Shield } from "lucide-react";

export default function UserManagementPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  USER MANAGEMENT
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Account administration, access control, and permission management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="critical">RESTRICTED ACCESS</StatusBadge>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        <div className="terminal-card">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-red-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-terminal-text font-mono mb-4">
              USER ADMINISTRATION INTERFACE
            </h2>
            <p className="text-terminal-muted font-mono mb-6 max-w-2xl mx-auto">
              Manage user accounts, permissions, and access levels across the 
              RRIO platform. Control reviewer privileges, admin access, and 
              system authentication settings.
            </p>
            <div className="space-y-2 text-sm font-mono text-terminal-muted">
              <p>• 847 active user accounts</p>
              <p>• Role-based access control</p>
              <p>• Permission audit trails</p>
              <p>• Multi-factor authentication</p>
            </div>
            <div className="mt-8">
              <StatusBadge variant="critical">MAXIMUM SECURITY REQUIRED</StatusBadge>
              <p className="text-xs text-terminal-muted font-mono mt-2">
                High-privilege administrative function - additional authorization required
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}