"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { FileText } from "lucide-react";

export default function PublicationsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  PUBLICATIONS LIBRARY
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Research papers, methodology documentation, and academic publications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="good">LIVE</StatusBadge>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        <div className="terminal-card">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-pink-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-terminal-text font-mono mb-4">
              RESEARCH PUBLICATIONS REPOSITORY
            </h2>
            <p className="text-terminal-muted font-mono mb-6 max-w-2xl mx-auto">
              Browse published research papers, working papers, and methodology 
              documentation. Access citation data, abstracts, and full-text 
              publications from the RRIO research community.
            </p>
            <div className="space-y-2 text-sm font-mono text-terminal-muted">
              <p>• 47 published research papers</p>
              <p>• 312 total citations</p>
              <p>• Full-text search capability</p>
              <p>• Citation impact tracking</p>
            </div>
            <div className="mt-8">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded font-mono text-sm transition-colors">
                Browse Publications
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}