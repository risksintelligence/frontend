'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { navigationStructure } from '@/lib/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Risk Intelligence']);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="h-full bg-terminal-bg border-r border-terminal-border">
      <div className="p-4">
        <div className="text-terminal-text font-mono text-sm font-semibold mb-6">
          RISKX PLATFORM
        </div>
        
        {/* Main Dashboard */}
        <Link 
          href={navigationStructure.dashboard.href}
          className={`
            flex items-center gap-3 px-3 py-2 rounded text-sm font-mono mb-4
            transition-colors duration-150
            ${isActive('/') 
              ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30' 
              : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface'
            }
          `}
        >
          <navigationStructure.dashboard.icon className="w-4 h-4" />
          <span>{navigationStructure.dashboard.title}</span>
        </Link>

        {/* Feature Groups */}
        <div className="space-y-2">
          {navigationStructure.groups.map((group) => {
            const isGroupExpanded = expandedGroups.includes(group.title);
            const hasActiveItem = group.items.some(item => isActive(item.href));
            
            return (
              <div key={group.title} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-mono
                    transition-colors duration-150
                    ${hasActiveItem 
                      ? 'text-terminal-green' 
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface'
                    }
                  `}
                >
                  <group.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{group.title}</span>
                  {isGroupExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                {/* Group Items */}
                {isGroupExpanded && (
                  <div className="ml-6 space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          block px-3 py-2 rounded text-xs font-mono
                          transition-colors duration-150
                          ${isActive(item.href)
                            ? 'bg-terminal-green/20 text-terminal-green border-l-2 border-terminal-green'
                            : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface border-l-2 border-transparent'
                          }
                        `}
                        title={item.description}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 p-3 bg-terminal-surface rounded border border-terminal-border">
          <div className="text-xs text-terminal-muted">
            <div className="font-medium text-terminal-text mb-1 font-mono">
              RiskX Intelligence v1.0
            </div>
            <div className="font-mono">
              Risk Intelligence Observatory
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
              <span className="font-mono">Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}