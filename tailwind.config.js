/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berlim: {
          orange: '#F77223',
          dark: '#111827',
          gray: '#374151',
          light: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
