/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#0d1117',
          surface: '#161b22',
          subtle: '#21262d',
          border: '#30363d',
          borderActive: '#58a6ff',
          textMain: '#f0f6fc',
          textMuted: '#8b949e',
          textSubtle: '#6e7681',
          green: '#3fb950',
          amber: '#d29922',
          blue: '#58a6ff',
          red: '#f85149',
          purple: '#bc8cff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 16px rgba(63, 185, 80, 0.25)',
        'glow-blue': '0 0 16px rgba(88, 166, 255, 0.25)',
        'glow-amber': '0 0 16px rgba(210, 153, 34, 0.25)',
        'glow-red': '0 0 16px rgba(248, 81, 73, 0.25)',
      }
    },
  },
  plugins: [],
}
