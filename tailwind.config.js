/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-bg': '#0a0a12',
        'footer-bg': '#05050a',
        'cyan': {
          DEFAULT: '#00f3ff',
          400: '#00f3ff',
          500: '#00f3ff',
        },
        'magenta': {
          DEFAULT: '#ff00ff',
          400: '#ff00ff',
          500: '#ff00ff',
          600: '#d946ef',
        }
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
