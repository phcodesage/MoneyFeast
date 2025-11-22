/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
