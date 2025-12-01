"use client";

import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";
import { BookOpen, Users, FileText, Award } from "lucide-react";
import Link from "next/link";

export default function ResearchPage() {
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold text-terminal-text">
                  RESEARCH HUB
                </h1>
                <p className="text-terminal-muted font-mono text-sm">
                  Academic research coordination, publication management, and peer review infrastructure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 text-pink-700 border border-pink-600/30 rounded font-mono text-sm hover:bg-pink-600/30 transition-colors">
                <FileText className="w-4 h-4" />
                NEW SUBMISSION
              </button>
              <div className="text-terminal-muted font-mono text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        {/* Research Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Papers"
            value="23"
            description="In review pipeline"
          />
          <MetricCard
            title="Research Fellows"
            value="8"
            description="Current cohort"
          />
          <MetricCard
            title="Publications"
            value="47"
            description="Total published"
          />
          <MetricCard
            title="Citations"
            value="312"
            description="Academic impact"
          />
        </div>

        {/* Research Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/research/publications"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-pink-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">PUBLICATIONS</h3>
                <p className="text-xs text-terminal-muted font-mono">Research library</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Browse published research papers, working papers, and methodology documentation
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="good">LIVE</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">47 papers</span>
            </div>
          </Link>

          <Link
            href="/research/reviewer"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">REVIEWER PORTAL</h3>
                <p className="text-xs text-terminal-muted font-mono">Peer review system</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Access submission queue, review assignments, and evaluation dashboards
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="warning">AUTH REQUIRED</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">5 pending</span>
            </div>
          </Link>

          <Link
            href="/missions/fellowship"
            className="terminal-card hover:bg-terminal-surface/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-terminal-text font-mono">INSIGHT FELLOWSHIP</h3>
                <p className="text-xs text-terminal-muted font-mono">Research program</p>
              </div>
            </div>
            <p className="text-sm text-terminal-muted font-mono mb-4">
              Track fellowship cohorts, research progress, and program impact metrics
            </p>
            <div className="flex items-center justify-between">
              <StatusBadge variant="good">ACTIVE</StatusBadge>
              <span className="text-xs font-mono text-terminal-muted">Cohort 3</span>
            </div>
          </Link>
        </div>

        {/* Research Pipeline */}
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              RESEARCH PIPELINE STATUS
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Current submission and review workflow status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Submissions Queue</span>
                <span className="font-mono text-sm text-terminal-text">12 pending</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Under Review</span>
                <span className="font-mono text-sm text-terminal-text">8 active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Revision Required</span>
                <span className="font-mono text-sm text-terminal-text">3 papers</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Ready to Publish</span>
                <span className="font-mono text-sm text-terminal-text">2 papers</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Published This Month</span>
                <span className="font-mono text-sm text-terminal-text">4 papers</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-terminal-text">Citation Impact</span>
                <span className="font-mono text-sm text-terminal-text">+18 citations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              RECENT PUBLICATIONS
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Latest research outputs and methodology papers
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-terminal-surface rounded border border-terminal-border p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-mono text-sm font-semibold text-terminal-text">
                  Systemic Risk Propagation in Global Supply Networks
                </h4>
                <StatusBadge variant="good">PUBLISHED</StatusBadge>
              </div>
              <p className="text-xs text-terminal-muted font-mono mb-2">
                Dr. Sarah Chen, Dr. Michael Rodriguez | Risk Networks Quarterly
              </p>
              <p className="text-xs text-terminal-text font-mono">
                Published: 2024-11-20 | 7 citations
              </p>
            </div>

            <div className="bg-terminal-surface rounded border border-terminal-border p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-mono text-sm font-semibold text-terminal-text">
                  Machine Learning Approaches to Economic Regime Classification
                </h4>
                <StatusBadge variant="warning">UNDER REVIEW</StatusBadge>
              </div>
              <p className="text-xs text-terminal-muted font-mono mb-2">
                Dr. Alex Kim, Prof. Jennifer Liu | Computational Economics
              </p>
              <p className="text-xs text-terminal-text font-mono">
                Submitted: 2024-11-09 | Reviewer: Dr. Thompson
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 text-pink-700 border border-pink-600/30 rounded font-mono text-sm hover:bg-pink-600/30 transition-colors">
            Submit Research →
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
            Export Bibliography
          </button>
        </div>
      </main>
    </MainLayout>
  );
}
