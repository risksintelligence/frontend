// Bloomberg Terminal Professional Theme Configuration
// Navy blue (#1e3a8a) and charcoal gray (#374151) color scheme
// JetBrains Mono typography for terminal aesthetics

export const bloombergTheme = {
  colors: {
    primary: {
      navy: '#1e3a8a',           // Bloomberg Terminal navy blue
      charcoal: '#374151',       // Professional charcoal gray
      navyLight: '#2563eb',      // Lighter navy for highlights
      navyDark: '#1e40af',       // Darker navy for depth
      charcoalLight: '#4b5563',  // Lighter charcoal
      charcoalDark: '#1f2937',   // Darker charcoal
    },
    background: {
      terminal: '#0f172a',       // Dark terminal background
      panel: '#1e293b',          // Panel background
      card: '#334155',           // Card background
      surface: '#475569',        // Surface elements
    },
    text: {
      primary: '#f8fafc',        // Primary text (white)
      secondary: '#e2e8f0',      // Secondary text
      accent: '#38bdf8',         // Accent text (cyan)
      warning: '#fbbf24',        // Warning text (amber)
      error: '#ef4444',          // Error text (red)
      success: '#10b981',        // Success text (green)
    },
    data: {
      positive: '#10b981',       // Green for positive values
      negative: '#ef4444',       // Red for negative values
      neutral: '#6b7280',        // Gray for neutral values
      highlight: '#38bdf8',      // Cyan for highlights
    },
    border: {
      primary: '#475569',        // Primary borders
      secondary: '#64748b',      // Secondary borders
      accent: '#38bdf8',         // Accent borders
    }
  },
  typography: {
    fontFamily: {
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
} as const;

// CSS Classes for Bloomberg Terminal styling
export const bloombergClasses = {
  // Terminal containers
  terminal: {
    main: 'bg-slate-900 text-slate-100 font-mono min-h-screen',
    panel: 'bg-slate-800 border border-slate-600 rounded-lg',
    card: 'bg-slate-700 border border-slate-500 rounded-md p-4',
    surface: 'bg-slate-600 border border-slate-400',
  },
  
  // Navigation
  nav: {
    main: 'bg-blue-800 border-b border-slate-600 shadow-lg',
    item: 'text-slate-200 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors',
    active: 'bg-blue-600 text-white',
    group: 'border-l-2 border-cyan-400 pl-3 ml-2',
  },
  
  // Text styles
  text: {
    primary: 'text-slate-100 font-mono',
    secondary: 'text-slate-300 font-mono',
    accent: 'text-cyan-400 font-mono font-semibold',
    warning: 'text-amber-400 font-mono',
    error: 'text-red-400 font-mono',
    success: 'text-green-400 font-mono',
    muted: 'text-slate-500 font-mono text-sm',
  },
  
  // Data display
  data: {
    positive: 'text-green-400 font-mono font-semibold',
    negative: 'text-red-400 font-mono font-semibold',
    neutral: 'text-slate-400 font-mono',
    highlight: 'text-cyan-400 font-mono font-bold',
    metric: 'text-slate-100 font-mono text-lg',
    label: 'text-slate-300 font-mono text-sm uppercase tracking-wide',
  },
  
  // Interactive elements
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-mono px-4 py-2 rounded-md transition-colors border border-blue-500',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-slate-200 font-mono px-4 py-2 rounded-md transition-colors border border-slate-500',
    accent: 'bg-cyan-600 hover:bg-cyan-700 text-white font-mono px-4 py-2 rounded-md transition-colors border border-cyan-500',
    ghost: 'hover:bg-slate-700 text-slate-300 font-mono px-4 py-2 rounded-md transition-colors',
  },
  
  // Status indicators
  status: {
    online: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-green-900 text-green-300 border border-green-600',
    offline: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-red-900 text-red-300 border border-red-600',
    warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-900 text-amber-300 border border-amber-600',
    loading: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-900 text-blue-300 border border-blue-600',
  },
  
  // Grid and layout
  grid: {
    container: 'grid gap-6 p-6',
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 lg:grid-cols-2',
    cols3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    cols4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
  },
  
  // Charts and visualizations
  chart: {
    container: 'bg-slate-800 border border-slate-600 rounded-lg p-4',
    title: 'text-slate-200 font-mono font-semibold text-lg mb-4',
    legend: 'text-slate-400 font-mono text-sm',
    axis: 'text-slate-400 font-mono text-xs',
  },
  
  // Tables
  table: {
    container: 'bg-slate-800 border border-slate-600 rounded-lg overflow-hidden',
    header: 'bg-slate-700 border-b border-slate-600',
    headerCell: 'px-4 py-3 text-slate-200 font-mono font-semibold text-sm uppercase tracking-wide text-left',
    row: 'border-b border-slate-700 hover:bg-slate-750 transition-colors',
    cell: 'px-4 py-3 text-slate-300 font-mono text-sm',
    zebra: 'even:bg-slate-800 odd:bg-slate-750',
  },
  
  // Forms
  form: {
    label: 'block text-slate-300 font-mono text-sm font-medium mb-2',
    input: 'bg-slate-700 border border-slate-500 text-slate-100 font-mono rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent',
    select: 'bg-slate-700 border border-slate-500 text-slate-100 font-mono rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400',
    textarea: 'bg-slate-700 border border-slate-500 text-slate-100 font-mono rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none',
  },
  
  // Animations
  animation: {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
  }
} as const;

// Helper functions for dynamic styling
export const getStatusColor = (status: 'positive' | 'negative' | 'neutral' | 'warning' | 'error') => {
  const colorMap = {
    positive: bloombergClasses.data.positive,
    negative: bloombergClasses.data.negative,
    neutral: bloombergClasses.data.neutral,
    warning: bloombergClasses.text.warning,
    error: bloombergClasses.text.error,
  };
  return colorMap[status];
};

export const getMetricChange = (current: number, previous: number) => {
  const change = current - previous;
  const percentage = ((change / previous) * 100).toFixed(2);
  
  if (change > 0) {
    return {
      value: `+${percentage}%`,
      className: bloombergClasses.data.positive,
      trend: 'up' as const
    };
  } else if (change < 0) {
    return {
      value: `${percentage}%`,
      className: bloombergClasses.data.negative,
      trend: 'down' as const
    };
  } else {
    return {
      value: '0.00%',
      className: bloombergClasses.data.neutral,
      trend: 'neutral' as const
    };
  }
};

// Terminal-style data formatting
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 2) => {
  return `${formatNumber(value, decimals)}%`;
};

// Bloomberg Terminal component variants
export const terminalVariants = {
  panel: `${bloombergClasses.terminal.panel} shadow-lg`,
  card: `${bloombergClasses.terminal.card} shadow-md`,
  metric: `${bloombergClasses.terminal.card} text-center`,
  chart: `${bloombergClasses.chart.container} shadow-lg`,
  table: bloombergClasses.table.container,
} as const;