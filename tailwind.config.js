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
      // Professional White Background Design System with Navy Blue & Charcoal Gray
      colors: {
        // Modern Professional Color Palette
        'risk': {
          'primary': '#1e3a8a',      // Navy blue for primary headings
          'secondary': '#374151',    // Charcoal gray for body text  
          'accent': '#3b82f6',       // Professional blue for links/accents
          'success': '#10b981',      // Modern green for success states
          'warning': '#f59e0b',      // Vibrant amber for warnings
          'danger': '#dc2626',       // Improved red for errors (more vibrant)
          'info': '#1e3a8a'          // Navy blue for info (brand consistency)
        },
        
        // Sophisticated White Background colors
        'terminal': {
          'bg': '#ffffff',           // Pure white main background
          'surface': '#f8fafc',      // Very subtle off-white for cards (bg-slate-50)
          'border': '#e2e8f0',       // Subtle slate borders (border-slate-200)
          'text': '#1e3a8a',         // Navy blue for primary text
          'muted': '#6b7280',        // Light gray for muted text (improved readability)
          'green': '#10b981',        // Modern green for success
          'orange': '#f59e0b',       // Vibrant amber for warnings
          'red': '#dc2626',          // Improved red for errors
          'blue': '#1e3a8a',         // Navy blue for info
          'purple': '#7c3aed',       // Deep purple accent
          'cyan': '#06b6d4',         // Modern cyan accent
          'pink': '#ec4899'          // Modern pink accent
        },
        
        // Professional white background hierarchy
        'white-bg': {
          'primary': '#ffffff',      // Pure white main background
          'secondary': '#f8fafc',    // Very subtle off-white (bg-slate-50)
          'tertiary': '#f1f5f9',     // Slightly more distinct (bg-slate-100)
          'accent': '#f0f9ff',       // Light blue accent (bg-sky-50)
        },
        
        // Professional typography hierarchy (Navy Blue & Charcoal Gray)
        'text-hierarchy': {
          'primary': '#1e3a8a',      // Navy blue for headings (strong, authoritative)
          'secondary': '#374151',    // Charcoal gray for body text (professional)
          'muted': '#6b7280',        // Light gray for descriptions/labels
          'accent': '#3b82f6',       // Professional blue for links
        },
        
        // Professional border system
        'border-system': {
          'primary': '#e2e8f0',      // Subtle slate borders (border-slate-200)
          'secondary': '#cbd5e1',    // More defined borders (border-slate-300)
          'accent': '#bfdbfe',       // Light blue accent borders (border-blue-200)
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