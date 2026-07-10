/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        card: '#141416',
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#06b6d4',
        danger: '#ef4444',
      },
      backgroundImage: {
        'glow-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
