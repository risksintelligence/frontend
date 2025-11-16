import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://rrio.risksx.com'),
  title: 'RRIO | RiskSX Resilience Intelligence Observatory',
  description: 'Bloomberg-grade economic resilience intelligence powered by GRII methodology. Real-time risk analytics, regime detection, and community-driven explanations for institutional decision-makers.',
  keywords: [
    'economic resilience',
    'risk analytics', 
    'GRII',
    'financial intelligence',
    'regime detection',
    'systemic risk',
    'economic indicators',
    'supply chain risk',
    'financial stress'
  ],
  authors: [{ name: 'RiskSX Observatory Team' }],
  creator: 'RiskSX Observatory',
  publisher: 'RiskSX Observatory',
  openGraph: {
    title: 'RRIO | Economic Resilience Intelligence',
    description: 'Bloomberg-grade risk analytics and regime detection for institutional decision-makers',
    url: 'https://rrio.risksx.com',
    siteName: 'RiskSX Resilience Intelligence Observatory',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RRIO Dashboard - Economic Resilience Intelligence',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RRIO | Economic Resilience Intelligence',
    description: 'Bloomberg-grade risk analytics and regime detection',
    images: ['/twitter-image.png'],
    creator: '@risksx_rrio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://rrio.risksx.com',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RiskSX Resilience Intelligence Observatory',
  description: 'Bloomberg-grade economic resilience intelligence powered by GRII methodology',
  url: 'https://rrio.risksx.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'Organization',
    name: 'RiskSX Observatory',
    url: 'https://risksx.com',
  },
  featureList: [
    'Real-time GRII risk scoring',
    'Economic regime detection',
    'Supply chain stress monitoring', 
    'Financial stress analytics',
    'Community-driven explanations',
    'Bloomberg-grade narratives'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <nav className="flex items-center justify-between bg-[#0f172a] px-6 py-3 font-mono text-white">
          <div>
            <span className="text-lg font-bold">RRIO Dashboard</span>
            <p className="text-xs text-[#94a3b8]">Ethical AI risk intelligence for U.S. finance & supply chain</p>
          </div>
          <div className="text-xs space-x-4">
            <a href="/" className="hover:underline">Dashboard</a>
            <a href="/transparency" className="hover:underline">Transparency</a>
            <a href="/community" className="hover:underline">Community</a>
            <a href="/community/admin" className="hover:underline">Reviewer</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
