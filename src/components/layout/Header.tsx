"use client";

import Link from "next/link";
import NotificationBell from "@/components/ui/NotificationBell";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-terminal-border bg-terminal-bg/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link href="/risk" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-6 h-6 text-terminal-accent">
              <g clipPath="url(#a)">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h16v16H0z"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-terminal-text font-mono">
              RiskSX
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">
              Observatory Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <Link
            href="/about"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xl:inline">About</span>
          </Link>
          <Link
            href="/methodology"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden xl:inline">Methodology</span>
          </Link>
          <Link
            href="/use-cases"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="hidden xl:inline">Use Cases</span>
          </Link>
          <Link
            href="/getting-started"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden xl:inline">Getting Started</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden xl:inline">Docs</span>
          </Link>
          <Link
            href="/intelligence"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden xl:inline">Intelligence</span>
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/my-desk"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="hidden sm:inline">My Desk</span>
          </Link>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
