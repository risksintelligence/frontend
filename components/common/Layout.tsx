import React from 'react';
import Header from './Header';
import { ComponentErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  apiUrl?: string;
}

export default function Layout({ children, apiUrl }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ComponentErrorBoundary>
        <Header apiUrl={apiUrl} />
      </ComponentErrorBoundary>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComponentErrorBoundary>
          {children}
        </ComponentErrorBoundary>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>
                RiskX Risk Intelligence Observatory - Professional economic risk assessment and monitoring system
              </p>
              <p className="mt-1">
                Built with transparent methodology and explainable analytics for informed decision-making
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Powered by real-time economic data</p>
              <p className="mt-1">Federal Reserve, BEA, BLS sources</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span>Professional risk intelligence platform</span>
              <span>•</span>
              <span>Ethical AI principles</span>
              <span>•</span>
              <span>Transparent methodology</span>
              <span>•</span>
              <span>Open source approach</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}