import type { Metadata } from 'next'
import './globals.css';
import { JetBrains_Mono } from 'next/font/google';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains'
});

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
      <body className={jetbrains.className}>
        <nav className="flex items-center justify-between px-6 py-3 text-white" style={{ backgroundColor: '#0f172a' }}>
          <div>
            <span className="text-lg font-bold">RRIO Dashboard</span>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Ethical AI risk intelligence for U.S. finance & supply chain</p>
          </div>
          <div className="text-xs flex gap-4">
            <a href="/" className="nav-link hover:text-blue-300 transition-colors">Dashboard</a>
            <a href="/grii" className="nav-link hover:text-blue-300 transition-colors">GRII Intelligence</a>
            <a href="/rrio" className="nav-link hover:text-blue-300 transition-colors">RRIO Hub</a>
            <div className="relative group">
              <a href="/analytics" className="nav-link hover:text-blue-300 transition-colors">Analytics ▾</a>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a href="/analytics/history" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">GERII History</a>
                <a href="/analytics/components" className="block px-4 py-2 hover:bg-gray-100">Component Analysis</a>
                <a href="/analytics/regimes" className="block px-4 py-2 hover:bg-gray-100">Regime Detection</a>
                <a href="/analytics/forecasts" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg">Forecasting</a>
              </div>
            </div>
            <a href="/transparency" className="nav-link hover:text-blue-300 transition-colors">Transparency</a>
            <a href="/communication" className="nav-link hover:text-blue-300 transition-colors">Communication</a>
            <a href="/community" className="nav-link hover:text-blue-300 transition-colors">Community</a>
            <a href="/community/admin" className="nav-link hover:text-blue-300 transition-colors">Reviewer</a>
          </div>
        </nav>
        <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
