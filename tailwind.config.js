/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Primary Indigo (FINNOVA style) ===
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Indigo primary
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Secondary/Accent (Soft purple/lavender)
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        // Finnova App backgrounds
        app: {
          bg: '#f8fafc',       // Very light slate/neutral
          sidebar: '#ffffff',  // Pure white sidebar
          surface: '#ffffff',  // Pure white cards
          card: '#ffffff',     
          input: '#f1f5f9',    // Light slate input
        },
        // Overriding slate for light theme defaults
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'], // Or stick to Plus Jakarta Sans
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-in': 'slideInLeft 0.25s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'finnova': '0 4px 20px -4px rgba(0, 0, 0, 0.05)',
        'finnova-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'finnova-sm': '0 2px 10px -2px rgba(0, 0, 0, 0.03)',
      },
      borderColor: {
        'subtle': '#e2e8f0', // slate-200
        'primary-subtle': '#ddd6fe',
      }
    },
  },
  plugins: [],
}
