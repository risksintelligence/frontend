import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Analytics from "@/components/analytics/Analytics";
import FeedbackWidget from "@/components/ui/FeedbackWidget";
import NotificationBell from "@/components/ui/NotificationBell";
import AboutRRIOButtons from "@/components/ui/AboutRRIOButtons";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RRIO Intelligence Dashboard",
  description:
    "Real-time resilience intelligence for analysts, policymakers, and decision-makers.",
  keywords: [
    "risk intelligence",
    "economic analytics", 
    "financial modeling",
    "Monte Carlo simulation",
    "stress testing",
    "regime analysis",
    "GRII",
    "economic forecasting",
    "market volatility",
    "supply chain risk"
  ],
  authors: [{ name: "RRIO Observatory" }],
  openGraph: {
    title: "RRIO Intelligence Dashboard",
    description: "Real-time resilience intelligence for analysts, policymakers, and decision-makers.",
    type: "website",
    locale: "en_US",
    siteName: "RRIO Observatory"
  },
  twitter: {
    card: "summary_large_image",
    title: "RRIO Intelligence Dashboard",
    description: "Real-time resilience intelligence for analysts, policymakers, and decision-makers."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_title: 'RRIO Observatory',
                    send_page_view: true
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} bg-terminal-bg text-terminal-text`}
      >
        <Analytics />
        <Providers>
          <div className="flex items-center justify-between px-6 py-2 border-b border-terminal-border">
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
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <AboutRRIOButtons />
            </div>
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
          {children}
          <FeedbackWidget page="global" />
        </Providers>
      </body>
    </html>
  );
}
