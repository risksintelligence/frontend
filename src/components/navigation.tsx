'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    description: 'Real-time GERII score and risk analytics'
  },
  {
    label: 'Analytics',
    href: '#',
    description: 'Historical data and trends',
    children: [
      { label: 'GERII History', href: '/analytics/history', description: 'Historical GERII scores and trends' },
      { label: 'Component Analysis', href: '/analytics/components', description: 'Individual component breakdowns' },
      { label: 'Regime Detection', href: '/analytics/regimes', description: 'Economic regime classification history' },
      { label: 'Forecasting', href: '/analytics/forecasts', description: 'Prediction models and accuracy' }
    ]
  },
  {
    label: 'Transparency',
    href: '/transparency',
    description: 'Data sources, methodology, and system status',
    children: [
      { label: 'Data Freshness', href: '/transparency#freshness', description: 'Real-time data status' },
      { label: 'Update Log', href: '/transparency#updates', description: 'System and methodology changes' },
      { label: 'Attribution', href: '/transparency#attribution', description: 'Data sources and licenses' },
      { label: 'RAS History', href: '/transparency#ras', description: 'Resilience Activation Score trends' }
    ]
  },
  {
    label: 'Community',
    href: '/community',
    description: 'Partner labs, submissions, and collaboration',
    children: [
      { label: 'Partner Labs', href: '/community#partners', description: 'Academic and research partnerships' },
      { label: 'Submissions', href: '/community#submissions', description: 'Community contributions and analyses' },
      { label: 'Scenario Studio', href: '/community#scenarios', description: 'Interactive risk scenario modeling' },
      { label: 'Admin Portal', href: '/community/admin', description: 'Review and manage submissions' }
    ]
  },
  {
    label: 'Communication',
    href: '#',
    description: 'Newsletter and publishing tools',
    children: [
      { label: 'Newsletter Status', href: '/communication/newsletter', description: 'Publication status and automation' },
      { label: 'Publishing Calendar', href: '/communication/calendar', description: 'Content scheduling and timeline' },
      { label: 'Media Kit', href: '/communication/media', description: 'Press resources and assets' }
    ]
  }
];

interface NavigationProps {
  className?: string;
  variant?: 'header' | 'sidebar' | 'mobile';
}

export default function Navigation({ className = '', variant = 'header' }: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  if (variant === 'header') {
    return (
      <nav className={`flex items-center space-x-6 ${className}`}>
        {navigationItems.map((item) => (
          <div key={item.label} className="relative">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="nav-link flex items-center gap-1"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg 
                    className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="font-medium text-gray-900">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href} className="nav-link">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }

  if (variant === 'sidebar') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {navigationItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <span>{item.label}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === item.label && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Mobile variant
  return (
    <nav className={`space-y-1 ${className}`}>
      {navigationItems.map((item) => (
        <div key={item.label}>
          {item.children ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-white border-b border-gray-700"
              >
                <div>
                  <div>{item.label}</div>
                  <div className="text-sm text-gray-300">{item.description}</div>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === item.label && (
                <div className="bg-gray-800">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <div className="font-medium">{child.label}</div>
                      {child.description && (
                        <div className="text-xs text-gray-400 mt-1">{child.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.href}
              className="block px-4 py-3 text-base font-medium text-white border-b border-gray-700 hover:bg-gray-700"
            >
              <div>{item.label}</div>
              <div className="text-sm text-gray-300">{item.description}</div>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// Export navigation items for use in other components
export { navigationItems };
export type { NavItem };