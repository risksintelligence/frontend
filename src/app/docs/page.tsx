"use client";

import MainLayout from "@/components/layout/MainLayout";
import PagePrimer from "@/components/ui/PagePrimer";

export default function DocsPage() {
  return (
    <MainLayout>
      <main className="space-y-8 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Documentation & API Reference
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            RRIO Documentation
          </h1>
          <p className="text-sm text-terminal-muted">
            Comprehensive documentation for the Risk Research Intelligence Observatory.
          </p>
        </header>

        <PagePrimer
          kicker="Documentation"
          title="API Reference & Guides"
          description="Complete documentation for RRIO APIs, models, and integrations."
          expandable={true}
          items={[
            { 
              title: "API Reference", 
              content: "Complete REST API documentation with examples.",
              tooltip: "Detailed API endpoints, parameters, and response formats"
            },
            { 
              title: "Data Models", 
              content: "Risk models, regime analysis, and forecasting documentation.",
              tooltip: "Technical documentation for GRII, regime models, and ML components"
            },
            { 
              title: "Integration Guides", 
              content: "Step-by-step integration guides for external systems.",
              tooltip: "Integration patterns and best practices"
            },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="terminal-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Quick Start
              </h3>
              <p className="text-xs text-terminal-muted">Get started with RRIO APIs</p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-sm">
                <span className="text-terminal-muted"># Get current GRII score</span>
                <br />
                <span className="text-terminal-green">GET</span> /api/v1/analytics/geri
              </div>
              <div className="font-mono text-sm">
                <span className="text-terminal-muted"># Get regime probabilities</span>
                <br />
                <span className="text-terminal-green">GET</span> /api/v1/ai/regime/current
              </div>
              <div className="font-mono text-sm">
                <span className="text-terminal-muted"># Get 24h forecast</span>
                <br />
                <span className="text-terminal-green">GET</span> /api/v1/ai/forecast/next-24h
              </div>
            </div>
          </section>

          <section className="terminal-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Model Documentation
              </h3>
              <p className="text-xs text-terminal-muted">Understanding RRIO models</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-mono text-sm text-terminal-text">GRII Composite</p>
                <p className="text-xs text-terminal-muted">Global Risk Intelligence Index methodology</p>
              </div>
              <div>
                <p className="font-mono text-sm text-terminal-text">Regime Classification</p>
                <p className="text-xs text-terminal-muted">Hidden Markov Model regime detection</p>
              </div>
              <div>
                <p className="font-mono text-sm text-terminal-text">Forecast Engine</p>
                <p className="text-xs text-terminal-muted">24-hour Monte Carlo simulation</p>
              </div>
            </div>
          </section>
        </div>

        <section className="terminal-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase text-terminal-text">
              Documentation Status
            </h3>
            <p className="text-xs text-terminal-muted">Current documentation coverage</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono text-sm">API Reference</span>
              <span className="text-terminal-green text-sm">Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-sm">Model Documentation</span>
              <span className="text-terminal-orange text-sm">In Progress</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-sm">Integration Guides</span>
              <span className="text-terminal-orange text-sm">In Progress</span>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}