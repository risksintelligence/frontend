// Clean Modern Web Dashboard Theme Configuration
// Light gray backgrounds with white cards and professional status colors
// Clean typography for modern dashboard aesthetics

export const bloombergTheme = {
  colors: {
    background: {
      primary: '#f9fafb',        // Light gray background (bg-gray-50)
      secondary: '#ffffff',      // White backgrounds for cards and panels (bg-white)
      hover: '#f3f4f6',          // Light hover state (bg-gray-100)
    },
    text: {
      primary: '#111827',        // Dark text for headings (text-gray-900)
      secondary: '#4b5563',      // Medium gray for secondary text (text-gray-600)
      muted: '#6b7280',          // Lighter gray for muted text (text-gray-500)
    },
    border: {
      primary: '#e5e7eb',        // Light gray borders (border-gray-200)
      secondary: '#d1d5db',      // Slightly darker borders (border-gray-300)
    },
    status: {
      error: {
        text: '#dc2626',         // text-red-600
        bg: '#fef2f2',           // bg-red-100
      },
      warning: {
        text: '#d97706',         // text-yellow-600
        bg: '#fefce8',           // bg-yellow-100
      },
      success: {
        text: '#059669',         // text-green-600
        bg: '#f0fdf4',           // bg-green-100
      },
      info: {
        text: '#2563eb',         // text-blue-600
        bg: '#eff6ff',           // bg-blue-100
      }
    },
    data: {
      positive: '#059669',       // Green for positive values
      negative: '#dc2626',       // Red for negative values
      neutral: '#6b7280',        // Gray for neutral values
      highlight: '#2563eb',      // Blue for highlights
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

// CSS Classes for clean modern web dashboard styling
export const bloombergClasses = {
  // Main containers
  container: {
    primary: 'min-h-screen bg-gray-50 p-6',
    secondary: 'bg-white rounded-lg shadow p-6',
    card: 'bg-white rounded-lg shadow p-4',
  },
  
  // Legacy terminal compatibility (now uses clean dashboard styling)
  terminal: {
    main: 'min-h-screen bg-gray-50 p-6',
    panel: 'bg-white rounded-lg shadow p-6',
    card: 'bg-white rounded-lg shadow p-4',
    surface: 'bg-white border border-gray-200',
  },
  
  // Text styling
  text: {
    primary: 'text-gray-900 font-semibold',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    heading: 'text-gray-900 font-bold',
    // Legacy support for existing components
    success: 'text-green-600',
    warning: 'text-yellow-600', 
    error: 'text-red-600',
    accent: 'text-blue-600',
  },
  
  // Status colors
  status: {
    error: 'text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm',
    warning: 'text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm',
    success: 'text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm',
    info: 'text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm',
  },
  
  // Borders
  border: {
    primary: 'border-gray-200',
    secondary: 'border-gray-300',
  },
  
  // Interactive elements
  button: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-200 transition-colors',
  },
  
  // Background styles
  background: {
    primary: 'bg-gray-50',
    secondary: 'bg-white',
    hover: 'hover:bg-gray-100',
  },
  
  // Data visualization
  chart: {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
    highlight: 'text-blue-600',
  },
  
  // Legacy data compatibility
  data: {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
    highlight: 'text-blue-600',
    metric: 'text-gray-900 text-lg',
    label: 'text-gray-500 text-sm uppercase tracking-wide',
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
  
  // Tables
  table: {
    container: 'bg-white border border-gray-200 rounded-lg overflow-hidden',
    header: 'bg-gray-50 border-b border-gray-200',
    headerCell: 'px-4 py-3 text-gray-900 font-semibold text-sm uppercase tracking-wide text-left',
    row: 'border-b border-gray-200 hover:bg-gray-50 transition-colors',
    cell: 'px-4 py-3 text-gray-600 text-sm',
    zebra: 'even:bg-white odd:bg-gray-50',
  },
  
  // Forms
  form: {
    label: 'block text-gray-700 text-sm font-medium mb-2',
    input: 'bg-white border border-gray-200 text-gray-900 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    select: 'bg-white border border-gray-200 text-gray-900 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
    textarea: 'bg-white border border-gray-200 text-gray-900 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
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