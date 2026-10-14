/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10B981',
          900: '#064E3B',
        },
        sky: {
          500: '#0EA5E9',
          800: '#0369A1',
        },
        ink: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        mist: '#F5F8F7',
        line: '#E3EBE8',
      },
      fontFamily: {
        heading: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(6, 78, 59, 0.04), 0 8px 24px -12px rgba(6, 78, 59, 0.12)',
        lift: '0 2px 4px rgba(6, 78, 59, 0.05), 0 24px 48px -20px rgba(6, 78, 59, 0.22)',
      },
      backgroundImage: {
        grid:
          'linear-gradient(to right, rgba(16,185,129,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.07) 1px, transparent 1px)',
      },
      keyframes: {
        dash: { to: { strokeDashoffset: '-30' } },
        flowDash: { to: { strokeDashoffset: '-60' } },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        dash: 'dash 3s linear infinite',
        flowDash: 'flowDash 2.4s linear infinite',
        floatY: 'floatY 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};