/**
 * Footer component for RiskX application
 * Professional footer with regulatory compliance information
 */
import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-navy-blue text-white py-8 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">RiskX Observatory</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Risk Intelligence Observatory providing transparent, data-driven insights 
              for financial institutions and supply chain operators. Built with ethical 
              AI principles and regulatory compliance standards.
            </p>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-md font-semibold mb-4">Data Sources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Federal Reserve Economic Data</li>
              <li>U.S. Census Bureau</li>
              <li>Bureau of Economic Analysis</li>
              <li>Bureau of Labor Statistics</li>
              <li>FDIC Banking Data</li>
              <li>NOAA Climate Data</li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="text-md font-semibold mb-4">Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>SOC 2 Type II Compliant</li>
              <li>GDPR Compliant</li>
              <li>CCPA Compliant</li>
              <li>WCAG 2.1 AA Accessible</li>
              <li>Open Source Transparent</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300">
              © {currentYear} RiskX Observatory. All rights reserved.
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="/privacy" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/methodology" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Methodology
              </a>
              <a 
                href="/api/docs" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                API Documentation
              </a>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>
              Risk assessments are for informational purposes only and should not be 
              considered as financial advice. Please consult with qualified financial 
              professionals before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;