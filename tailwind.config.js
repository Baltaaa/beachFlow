/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#F2CA50',
        'gold-hover': '#E5BF45',
        hairline: '#E5E5E5',
        prius: {
          white: '#FFFFFF',
          black: '#000000',
          background: '#F9F9F9',
        }
      },
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
        display: ['Exo', 'sans-serif'],
        serif: ['Exo', 'sans-serif'],
        instrument: ['Instrument Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        md: '4px',
        sm: '2px',
      },
      spacing: {
        'margin-desktop': '64px',
        'margin-mobile': '20px',
        'gutter': '24px',
      },
    },
  },
  plugins: [],
}