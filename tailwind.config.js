/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.833rem', { lineHeight: '1.5' }],      // ~15px
        'sm': ['0.889rem', { lineHeight: '1.6' }],      // ~16px
        'base': ['1rem', { lineHeight: '1.7' }],        // 18px (base)
        'lg': ['1.111rem', { lineHeight: '1.7' }],      // ~20px
        'xl': ['1.222rem', { lineHeight: '1.6' }],      // ~22px
        '2xl': ['1.444rem', { lineHeight: '1.5' }],     // ~26px
        '3xl': ['1.778rem', { lineHeight: '1.4' }],     // ~32px
        '4xl': ['2.222rem', { lineHeight: '1.3' }],     // ~40px
        '5xl': ['2.778rem', { lineHeight: '1.2' }],     // ~50px
        '6xl': ['3.333rem', { lineHeight: '1.1' }],     // ~60px
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '1.85',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
