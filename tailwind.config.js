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
        // GERI Risk Band Colors per project requirements
        'risk-minimal': '#00C853',
        'risk-low': '#64DD17', 
        'risk-moderate': '#FFD600',
        'risk-high': '#FFAB00',
        'risk-critical': '#D50000',
        
        // Special Indicators
        'anomaly': '#6200EA',
        'financial-stress': '#1B5E20',
        'supply-chain-stress': '#0277BD', 
        'macro-pressure': '#BF360C',
        
        // UI Colors
        'terminal-navy': '#1e3a8a',
        'terminal-muted': '#6b7280',
        'rrio-background': '#f8fafc',
        'rrio-card': '#ffffff',
        'rrio-border': '#e2e8f0',
        'rrio-text': '#0f172a',
        'rrio-text-secondary': '#475569',
        'rrio-text-muted': '#94a3b8',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'geri-score': ['3rem', { lineHeight: '1', fontWeight: '700' }],
        'component-value': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'label': ['0.75rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      animation: {
        'pulse-anomaly': 'pulse-anomaly 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        'pulse-anomaly': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fadeIn': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}