/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sand: {
          50: '#faf8f4',
          100: '#f4efe6',
          200: '#e8ddc9',
          300: '#d9c6a3',
          400: '#c9a96a',
          500: '#b8914a',
          600: '#9c763a',
          700: '#7a5c30',
          800: '#5e4729',
          900: '#4a3923',
        },
        clay: {
          50: '#fbf6f3',
          100: '#f5e8e1',
          200: '#e9cbbd',
          300: '#d7a088',
          400: '#c47a5c',
          500: '#b25e3d',
          600: '#974a30',
          700: '#7a3a26',
          800: '#5e2e20',
          900: '#47241a',
        },
        sage: {
          50: '#f5f7f4',
          100: '#e7ece4',
          200: '#cdd8c8',
          300: '#a7bba0',
          400: '#7e9b76',
          500: '#5f7d58',
          600: '#4a6445',
          700: '#3b5039',
          800: '#2f402e',
          900: '#263325',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e7e6e3',
          200: '#cfccc7',
          300: '#b0aca4',
          400: '#8e8a80',
          500: '#736f65',
          600: '#5d5a52',
          700: '#4a4842',
          800: '#3a3934',
          900: '#2b2a27',
          950: '#1c1b19',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'slide-in': 'slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
