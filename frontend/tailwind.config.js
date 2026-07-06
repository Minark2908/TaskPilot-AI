/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14B8A6', // Primary Teal
          dark: '#006b5f',
        },
        slate: {
          850: '#1e293b', // Dark Slate
        },
        brand: {
          background: '#F8FAFC', // Background Light Gray
          text: '#334155', // Primary Text
          heading: '#0d1c2f', // Headings / On-surface
          accent: '#F59E0B', // Amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"EB Garamond"', 'Garamond', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      borderRadius: {
        'sm': '0.125rem', // 2px
        'md': '0.375rem', // 6px
        'lg': '0.5rem', // 8px
        'xl': '0.75rem', // 12px
      }
    },
  },
  plugins: [],
}


