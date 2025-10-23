// Sophisticated White Background Design System
// Pure white main background with subtle slate hierarchy for maximum elegance
// Professional typography and enhanced visual contrast

export const bloombergTheme = {
  colors: {
    background: {
      primary: '#ffffff',        // Pure white main background
      secondary: '#f8fafc',      // Very subtle off-white for cards (bg-slate-50)
      tertiary: '#f1f5f9',       // Slightly more distinct sections (bg-slate-100)
      hover: '#f8fafc',          // Subtle hover state (bg-slate-50)
      accent: '#f0f9ff',         // Very light blue accent backgrounds (bg-sky-50)
    },
    text: {
      primary: '#0f172a',        // Deep slate for maximum readability (text-slate-900)
      secondary: '#334155',      // Medium slate for secondary text (text-slate-700)
      muted: '#64748b',          // Lighter slate for muted text (text-slate-500)
      accent: '#0369a1',         // Professional blue for links/accents (text-sky-700)
    },
    border: {
      primary: '#e2e8f0',        // Subtle slate borders (border-slate-200)
      secondary: '#cbd5e1',      // More defined borders (border-slate-300)
      accent: '#bae6fd',         // Light blue accent borders (border-sky-200)
    },
    status: {
      error: {
        text: '#b91c1c',         // Deep red for errors (text-red-700)
        bg: '#fef2f2',           // Very light red background (bg-red-50)
        border: '#fecaca',       // Light red border (border-red-200)
      },
      warning: {
        text: '#a16207',         // Deep amber for warnings (text-amber-700)
        bg: '#fffbeb',           // Very light amber background (bg-amber-50)
        border: '#fed7aa',       // Light amber border (border-amber-200)
      },
      success: {
        text: '#047857',         // Deep emerald for success (text-emerald-700)
        bg: '#ecfdf5',           // Very light emerald background (bg-emerald-50)
        border: '#a7f3d0',       // Light emerald border (border-emerald-200)
      },
      info: {
        text: '#1d4ed8',         // Deep blue for info (text-blue-700)
        bg: '#eff6ff',           // Very light blue background (bg-blue-50)
        border: '#bfdbfe',       // Light blue border (border-blue-200)
      }
    },
    data: {
      positive: '#047857',       // Deep emerald for positive values (text-emerald-700)
      negative: '#b91c1c',       // Deep red for negative values (text-red-700)
      neutral: '#64748b',        // Medium slate for neutral values (text-slate-500)
      highlight: '#1d4ed8',      // Deep blue for highlights (text-blue-700)
      accent: '#0369a1',         // Professional sky blue (text-sky-700)
    },
    ui: {
      primary: '#1e40af',        // Primary button color (bg-blue-700)
      primaryHover: '#1d4ed8',   // Primary button hover (bg-blue-800)
      secondary: '#f1f5f9',      // Secondary button background (bg-slate-100)
      secondaryHover: '#e2e8f0', // Secondary button hover (bg-slate-200)
      focus: '#3b82f6',          // Focus ring color (ring-blue-500)
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

// CSS Classes for sophisticated white background design system
export const bloombergClasses = {
  // Main containers with visual hierarchy
  container: {
    primary: 'min-h-screen bg-white p-6',                           // Pure white main background
    secondary: 'bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6',  // Subtle off-white cards
    card: 'bg-white rounded-lg shadow-sm border border-slate-200 p-4',          // White cards with subtle borders
    accent: 'bg-sky-50 rounded-lg border border-sky-200 p-4',       // Light blue accent containers
  },
  
  // Legacy terminal compatibility (sophisticated white theme)
  terminal: {
    main: 'min-h-screen bg-white p-6',
    panel: 'bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6',
    card: 'bg-white rounded-lg shadow-sm border border-slate-200 p-4',
    surface: 'bg-white border border-slate-200',
  },
  
  // Sophisticated text hierarchy
  text: {
    primary: 'text-slate-900 font-semibold',         // Deep slate for maximum readability
    secondary: 'text-slate-700',                     // Medium slate for secondary content
    muted: 'text-slate-500',                         // Light slate for muted text
    heading: 'text-slate-900 font-bold',             // Bold deep slate for headings
    accent: 'text-sky-700',                          // Professional blue for links/accents
    // Legacy support with updated colors
    success: 'text-emerald-700',                     // Deep emerald for success
    warning: 'text-amber-700',                       // Deep amber for warnings
    error: 'text-red-700',                           // Deep red for errors
  },
  
  // Professional status indicators
  status: {
    error: 'text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm',
    warning: 'text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-sm',
    success: 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-sm',
    info: 'text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-sm',
  },
  
  // Sophisticated border system
  border: {
    primary: 'border-slate-200',        // Subtle slate borders
    secondary: 'border-slate-300',      // More defined borders
    accent: 'border-sky-200',           // Light blue accent borders
    focus: 'border-blue-500',           // Focus state borders
  },
  
  // Professional interactive elements
  button: {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2 rounded-lg transition-all',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 px-4 py-2 rounded-lg border border-slate-200 transition-all',
    accent: 'bg-sky-100 text-sky-700 hover:bg-sky-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 px-4 py-2 rounded-lg border border-sky-200 transition-all',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 px-4 py-2 rounded-lg transition-all',
  },
  
  // Sophisticated background hierarchy
  background: {
    primary: 'bg-white',              // Pure white main areas
    secondary: 'bg-slate-50',         // Very subtle off-white sections
    tertiary: 'bg-slate-100',         // Slightly more distinct areas
    hover: 'hover:bg-slate-50',       // Subtle hover effects
    accent: 'bg-sky-50',              // Light blue accent backgrounds
  },
  
  // Professional data visualization colors
  chart: {
    positive: 'text-emerald-700',     // Deep emerald for positive trends
    negative: 'text-red-700',         // Deep red for negative trends
    neutral: 'text-slate-500',        // Medium slate for neutral
    highlight: 'text-blue-700',       // Deep blue for highlights
    accent: 'text-sky-700',           // Professional sky blue
  },
  
  // Enhanced data display
  data: {
    positive: 'text-emerald-700',              // Deep emerald for positive values
    negative: 'text-red-700',                  // Deep red for negative values
    neutral: 'text-slate-500',                 // Medium slate for neutral
    highlight: 'text-blue-700',                // Deep blue for highlights
    metric: 'text-slate-900 text-lg font-bold', // Bold slate for metrics
    label: 'text-slate-500 text-sm uppercase tracking-wide', // Consistent labeling
    accent: 'text-sky-700',                    // Professional accent color
  },
  
  // Grid and layout
  grid: {
    container: 'grid gap-6 p-6',
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 lg:grid-cols-2',
    cols3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    cols4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
  },
  
  // Charts and visualizations styling (legacy compatibility)
  chartContainer: {
    container: 'bg-white border border-gray-200 rounded-lg p-4',
    title: 'text-gray-900 font-semibold text-lg mb-4',
    legend: 'text-gray-600 text-sm',
    axis: 'text-gray-500 text-xs',
  },
  
  // Sophisticated table styling
  table: {
    container: 'bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm',
    header: 'bg-slate-50 border-b border-slate-200',
    headerCell: 'px-4 py-3 text-slate-900 font-semibold text-sm uppercase tracking-wide text-left',
    row: 'border-b border-slate-200 hover:bg-slate-50 transition-colors',
    cell: 'px-4 py-3 text-slate-700 text-sm',
    zebra: 'even:bg-white odd:bg-slate-50',
    accent: 'bg-sky-50 border-sky-200',  // Accent row styling
  },
  
  // Professional form styling
  form: {
    label: 'block text-slate-700 text-sm font-medium mb-2',
    input: 'bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400',
    select: 'bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
    textarea: 'bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500',
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
  chart: `${bloombergClasses.chartContainer.container} shadow-lg`,
  table: bloombergClasses.table.container,
} as const;