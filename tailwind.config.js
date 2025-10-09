/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for Pokepixel theme
        pokepixel: {
          blue: '#3b82f6',
          green: '#10b981',
          purple: '#8b5cf6',
          gold: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
          teal: '#14b8a6',
        },
        // Gameboy colors
        gameboy: {
          bg: '#d0d3d4',
          screen: '#23252d',
          button: '#2e2f32',
        }
      },
      fontFamily: {
        'press-start': ['PressStart2P', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
