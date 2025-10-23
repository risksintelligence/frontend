'use client';

import { StatusBadgeProps } from '@/types';

export default function StatusBadge({ 
  status, 
  text, 
  size = 'md' 
}: StatusBadgeProps) {
  const statusClasses = {
    online: 'status-online',
    offline: 'status-offline',
    warning: 'status-warning',
    error: 'status-offline'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const displayText = text || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`
      status-indicator 
      ${statusClasses[status]} 
      ${sizeClasses[size]}
      inline-flex items-center gap-1
    `}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'online' ? 'bg-terminal-green' :
        status === 'warning' ? 'bg-terminal-orange' :
        'bg-terminal-red'
      }`} />
      {displayText}
    </span>
  );
}