/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1DA734',
        'primary-dark': '#0d7a22',
        'text-dark': '#242e42',
        'text-muted': '#7d7d7d',
        accent: '#f15b2a',
      },
      fontFamily: {
        display: ['"M PLUS Rounded 1c"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

