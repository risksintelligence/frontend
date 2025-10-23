'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    description: 'Risk overview and key metrics',
    icon: '📊'
  },
  {
    name: 'Risk Analysis',
    href: '/risk',
    description: 'Detailed risk assessment and factors',
    icon: '⚠️'
  },
  {
    name: 'Economic Data',
    href: '/economic',
    description: 'Economic indicators and trends',
    icon: '📈'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    description: 'Advanced analytics and insights',
    icon: '🔍'
  },
  {
    name: 'Alerts',
    href: '/alerts',
    description: 'Risk alerts and notifications',
    icon: '🔔'
  },
  {
    name: 'System',
    href: '/system',
    description: 'System health and monitoring',
    icon: '⚙️'
  }
];

export default function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={`bg-terminal-surface border-r border-terminal-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-4 p-2 text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg rounded transition-colors"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <div className="flex items-center justify-center">
            <span className="text-lg">
              {isCollapsed ? '→' : '←'}
            </span>
          </div>
        </button>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  block p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/30' 
                    : 'text-terminal-text hover:bg-terminal-bg hover:text-terminal-blue'
                  }
                `}
                title={isCollapsed ? `${item.name} - ${item.description}` : undefined}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-terminal-muted truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-8 p-3 bg-terminal-bg rounded-lg border border-terminal-border">
            <div className="text-xs text-terminal-muted">
              <div className="font-medium text-terminal-text mb-1">
                RiskX Intelligence v1.0
              </div>
              <div>
                Real-time risk assessment platform
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
                <span>Live data feed active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}