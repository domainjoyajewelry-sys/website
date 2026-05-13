/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          // ... add more stone shades as needed
          900: '#1a1a1a', // Example dark stone
        },
        amber: {
          400: '#fbbf24',
          700: '#d97706',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
}