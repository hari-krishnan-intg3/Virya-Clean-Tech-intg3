/** @type {import('tailwindcss').Config} */

/**
 * Virya Clean Tech design system.
 *
 * Structure follows the reference (isisecurity.in): a cool hue-220 neutral
 * ramp, one dominant brand colour, soft "squircle" radii, a 1400px shell and
 * gradient section bands. The brand hue is Virya's energy green rather than
 * the reference's corporate blue — the reference blue is kept as `signal`
 * for informational and link accents.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Brand green. `emerald-500` / `emerald-900` stay the two anchor
           values because the component layer leans on them directly. */
        emerald: {
          50: '#ECFDF6',
          100: '#D1FAE9',
          200: '#A7F3D6',
          300: '#6EE7BE',
          400: '#34D3A2',
          500: '#0FA97A',
          600: '#0B8A64',
          700: '#0A6E52',
          800: '#095741',
          900: '#064634',
          950: '#03291E',
        },
        /* Reference-site blue, reserved for informational accents. */
        signal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#4C8DF6',
          500: '#1754CF',
          600: '#1448B2',
          700: '#123A90',
          800: '#133274',
          900: '#142D5C',
        },
        sky: {
          500: '#0EA5E9',
          800: '#0369A1',
        },
        /* Cool hue-220 neutral ramp, matching the reference's ink family. */
        ink: {
          DEFAULT: '#16202E',
          muted: '#5B6676',
          faint: '#8B95A5',
        },
        mist: '#F7F9FA',
        line: '#E3E8EE',
      },
      fontFamily: {
        /* The reference loads exactly one family (Inter). We match that and
           drop Manrope so weights never synthesise. */
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        /* Reference's soft "squircle" scale. */
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        /* Reference's --card-shadow / --card-hover-shadow, actually wired. */
        soft: '0 4px 20px -4px rgba(22, 32, 46, 0.08)',
        lift: '0 8px 30px -6px rgba(22, 32, 46, 0.12)',
        glow: '0 18px 50px -20px rgba(15, 169, 122, 0.45)',
        panel: '0 -10px 40px -15px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        grid:
          'linear-gradient(to right, rgba(15,169,122,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,169,122,0.06) 1px, transparent 1px)',
        'section-band': 'linear-gradient(180deg, #F7F9FA 0%, #FFFFFF 100%)',
      },
      keyframes: {
        dash: { to: { strokeDashoffset: '-30' } },
        flowDash: { to: { strokeDashoffset: '-60' } },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
      },
      animation: {
        dash: 'dash 3s linear infinite',
        flowDash: 'flowDash 2.4s linear infinite',
        floatY: 'floatY 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'dot-pulse': 'dot-pulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};