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
    <nav className="h-full bg-white border-r border-slate-200">
      <div className="p-4">
        <div className="text-slate-900 font-mono text-sm font-semibold mb-6">
          RISKX PLATFORM
        </div>
        
        {/* Main Dashboard */}
        <Link 
          href={navigationStructure.dashboard.href}
          className={`
            nav-item font-mono mb-4
            ${isActive('/') 
              ? 'nav-item-active' 
              : 'nav-item-inactive'
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
                    nav-group-header font-mono
                    ${hasActiveItem 
                      ? 'nav-group-active' 
                      : 'nav-group-inactive'
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
                          block px-3 py-2 rounded text-xs font-mono transition-colors duration-150 border-l-2
                          ${isActive(item.href)
                            ? 'bg-blue-50 text-blue-700 border-blue-700'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
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
        <div className="mt-8 p-3 bg-slate-50 rounded border border-slate-200">
          <div className="text-xs text-slate-500">
            <div className="font-medium text-slate-900 mb-1 font-mono">
              RiskX Intelligence v1.0
            </div>
            <div className="font-mono">
              Risk Intelligence Observatory
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-700 rounded-full animate-pulse"></div>
              <span className="font-mono">Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}