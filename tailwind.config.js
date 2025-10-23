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
      // Sophisticated White Background Design System
      colors: {
        // Legacy risk colors (kept for compatibility)
        'risk': {
          'primary': '#0f172a',      // Deep slate for maximum readability
          'secondary': '#334155',    // Medium slate for secondary content  
          'accent': '#0369a1',       // Professional blue for links/accents
          'success': '#047857',      // Deep emerald for success
          'warning': '#a16207',      // Deep amber for warnings
          'danger': '#b91c1c',       // Deep red for errors
          'info': '#1d4ed8'          // Deep blue for info
        },
        
        // Sophisticated White Background colors
        'terminal': {
          'bg': '#ffffff',           // Pure white main background
          'surface': '#f8fafc',      // Very subtle off-white for cards (bg-slate-50)
          'border': '#e2e8f0',       // Subtle slate borders (border-slate-200)
          'text': '#0f172a',         // Deep slate for maximum readability (text-slate-900)
          'muted': '#64748b',        // Light slate for muted text (text-slate-500)
          'green': '#047857',        // Deep emerald for success (text-emerald-700)
          'orange': '#a16207',       // Deep amber for warnings (text-amber-700)
          'red': '#b91c1c',          // Deep red for errors (text-red-700)
          'blue': '#1d4ed8',         // Deep blue for info (text-blue-700)
          'purple': '#7c3aed',       // Deep purple accent
          'cyan': '#0891b2',         // Deep cyan accent
          'pink': '#be185d'          // Deep pink accent
        },
        
        // Professional white background hierarchy
        'white-bg': {
          'primary': '#ffffff',      // Pure white main background
          'secondary': '#f8fafc',    // Very subtle off-white (bg-slate-50)
          'tertiary': '#f1f5f9',     // Slightly more distinct (bg-slate-100)
          'accent': '#f0f9ff',       // Light blue accent (bg-sky-50)
        },
        
        // Professional typography colors
        'text-hierarchy': {
          'primary': '#0f172a',      // Deep slate for headings (text-slate-900)
          'secondary': '#334155',    // Medium slate for body text (text-slate-700)
          'muted': '#64748b',        // Light slate for descriptions (text-slate-500)
          'accent': '#0369a1',       // Professional blue for links (text-sky-700)
        },
        
        // Professional border system
        'border-system': {
          'primary': '#e2e8f0',      // Subtle slate borders (border-slate-200)
          'secondary': '#cbd5e1',    // More defined borders (border-slate-300)
          'accent': '#bae6fd',       // Light blue accent borders (border-sky-200)
          'focus': '#3b82f6',        // Focus state borders (border-blue-500)
        },
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