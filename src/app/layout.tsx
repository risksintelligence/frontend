import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'RiskX Intelligence Platform',
  description: 'Professional risk intelligence observatory providing real-time analytics and insights',
  keywords: 'risk management, financial analytics, economic data, risk intelligence observatory',
  authors: [{ name: 'RiskX Intelligence' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Navigation Sidebar */}
            <Navigation />
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}