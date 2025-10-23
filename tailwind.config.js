/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Bloomberg Terminal Color Scheme
      colors: {
        // Legacy risk colors (kept for compatibility)
        'risk': {
          'primary': '#0A0F1C',
          'secondary': '#1A2332',
          'accent': '#FF6B35',
          'success': '#22C55E',
          'warning': '#F59E0B',
          'danger': '#EF4444',
          'info': '#3B82F6'
        },
        
        // Bloomberg Terminal colors (updated)
        'terminal': {
          'bg': '#0f172a',           // Dark slate background
          'surface': '#1e293b',      // Panel background
          'border': '#475569',       // Border color
          'text': '#f8fafc',         // Primary text
          'muted': '#64748b',        // Muted text
          'green': '#10b981',        // Success/positive
          'orange': '#f59e0b',       // Warning
          'red': '#ef4444',          // Error/negative
          'blue': '#38bdf8',         // Accent/info
          'purple': '#8b5cf6',       // Secondary accent
          'cyan': '#06b6d4',         // Tertiary accent
          'pink': '#ec4899'          // Quaternary accent
        },
        
        // Primary Bloomberg Terminal colors
        'bloomberg-navy': '#1e3a8a',
        'bloomberg-charcoal': '#374151',
        'bloomberg-navy-light': '#2563eb',
        'bloomberg-navy-dark': '#1e40af',
        'bloomberg-charcoal-light': '#4b5563',
        'bloomberg-charcoal-dark': '#1f2937',
      },
      
      // Bloomberg Terminal Typography
      fontFamily: {
        'mono': ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'terminal': ['JetBrains Mono', 'monospace'],
      },
      
      // Enhanced animations for terminal aesthetics
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'terminal-blink': 'blink 1s infinite',
        'terminal-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-fade-in': 'fadeIn 0.3s ease-in-out',
        'terminal-slide-in': 'slideIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      
      // Terminal-style spacing
      spacing: {
        'terminal-xs': '0.25rem',
        'terminal-sm': '0.5rem',
        'terminal-md': '1rem',
        'terminal-lg': '1.5rem',
        'terminal-xl': '2rem',
      },
      
      // Terminal borders
      borderRadius: {
        'terminal': '0.375rem',
        'terminal-lg': '0.5rem',
        'terminal-xl': '0.75rem',
      },
      
      // Terminal shadows
      boxShadow: {
        'terminal': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'terminal-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'terminal-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'terminal-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}