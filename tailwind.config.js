/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'risk': {
          'primary': '#0A0F1C',
          'secondary': '#1A2332',
          'accent': '#FF6B35',
          'success': '#22C55E',
          'warning': '#F59E0B',
          'danger': '#EF4444',
          'info': '#3B82F6'
        },
        'terminal': {
          'bg': '#0D1117',
          'surface': '#161B22',
          'border': '#21262D',
          'text': '#E6EDF3',
          'muted': '#7D8590',
          'green': '#238636',
          'orange': '#DA8548',
          'red': '#F85149',
          'blue': '#58A6FF'
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}