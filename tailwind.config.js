/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        profit: '#22c55e',
        loss: '#ef4444',
        surface: {
          0: '#0a0e17',
          1: '#111827',
          2: '#1f2937',
          3: '#374151',
          4: '#4b5563',
        },
      },
    },
  },
  plugins: [],
};
