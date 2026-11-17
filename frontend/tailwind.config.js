module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c2d6b',
        },
        secondary: {
          500: '#8a2be2',
          600: '#7c2ae8',
          700: '#6b21a8',
        },
        accent: {
          cyan: '#00f0ff',
          'cyan-dark': '#00d4ff',
          purple: '#8a2be2',
          'purple-dark': '#6b1aa0',
        },
        dark: {
          bg: '#0B0F19',
          surface: '#1a1f35',
          'surface-light': '#232d4a',
          border: '#2a3447',
          'border-light': '#3a4457',
        },
        /* Brand palette — derived from the ABUHUB logo (navy mark + green leaf on cream) */
        cream: {
          50: '#FFFFFF',
          100: '#FDFCF8',
          200: '#F7F3EA',
          300: '#F1EBDC',
          400: '#E7DFC9',
          500: '#D9CEAF',
        },
        ink: {
          50: '#EEF1F6',
          100: '#D7DCE8',
          200: '#AEB8CF',
          300: '#8390AF',
          400: '#576389',
          500: '#3B4568',
          600: '#283350',
          700: '#1B2540',
          800: '#111A2E',
          900: '#0A1120',
          950: '#050810',
        },
        brand: {
          50: '#EAF9EE',
          100: '#CCF0D8',
          200: '#99E1B3',
          300: '#63CC8B',
          400: '#38B569',
          500: '#1F9954',
          600: '#177C43',
          700: '#136437',
          800: '#0F4E2C',
          900: '#0B3B22',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #177C43 0%, #1F9954 45%, #63CC8B 100%)',
        'ink-gradient': 'linear-gradient(135deg, #0A1120 0%, #1B2540 100%)',
        'studio-gradient':
          'radial-gradient(135% 130% at 12% -10%, #4FD988 0%, #1F9954 22%, #0F4E2C 42%, #0B2A1C 62%, #0A1120 82%)',
        'studio-gradient-soft':
          'radial-gradient(120% 120% at 85% 0%, rgba(99,204,139,0.35) 0%, rgba(10,17,32,0) 55%)',
        'canvas-gradient': 'linear-gradient(180deg, #0A1120 0%, #070B14 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.6s ease-out',
        slideIn: 'slideIn 0.6s ease-out',
        pageTransitionIn: 'pageTransitionIn 0.5s ease-out',
        pageTransitionOut: 'pageTransitionOut 0.5s ease-in',
        shimmer: 'shimmer 2s infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 4s linear infinite',
        blob: 'blob 12s ease-in-out infinite',
        shine: 'shine 3s linear infinite',
        marquee: 'marquee 30s linear infinite',
        gradientPan: 'gradientPan 6s ease infinite',
        drift: 'drift 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pageTransitionIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pageTransitionOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 240, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(138, 43, 226, 0.8), 0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-30px, 20px) scale(0.94)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tiltIn: {
          '0%': { opacity: '0', transform: 'translateY(40px) rotate(0deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(var(--tilt, 0deg)) scale(1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--tilt, 0deg))' },
          '50%': { transform: 'translateY(-14px) rotate(var(--tilt, 0deg))' },
        },
        gradientPan: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(138, 43, 226, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 240, 255, 0.2)',
        soft: '0 30px 80px -20px rgba(10, 17, 32, 0.18)',
        card: '0 2px 8px rgba(10, 17, 32, 0.04), 0 20px 40px -16px rgba(10, 17, 32, 0.12)',
        'brand-glow': '0 10px 40px -8px rgba(31, 153, 84, 0.45)',
        'ink-glow': '0 10px 40px -8px rgba(10, 17, 32, 0.35)',
      },
    },
  },
  plugins: [],
};

