import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Analytics from "@/components/analytics/Analytics";
import FeedbackWidget from "@/components/ui/FeedbackWidget";

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
          {children}
          <FeedbackWidget page="global" />
        </Providers>
      </body>
    </html>
  );
}
