/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'peer',
    'peer-focus:top-3',
    'peer-focus:-translate-y-0',
    'peer-focus:text-xs',
    'peer-focus:text-grass',
    'peer-placeholder-shown:top-1/2',
    'peer-placeholder-shown:text-sm',
    'peer-placeholder-shown:-translate-y-1/2',
    'peer-not-placeholder-shown:top-3',
    'peer-not-placeholder-shown:-translate-y-0',
    'peer-not-placeholder-shown:text-xs',
    'placeholder-transparent'
  ],
  theme: {
    extend: {
      colors: {
        // Portola Design System - Nature Inspired Palette
        
        // Primary Colors
        'portola-green': '#1E361E',
        'burnished-brass': '#7C5C1D',
        'forest-moss': '#2F4F2F',
        'railway-gold': '#CEAD64',
        
        // Secondary Colors
        'pine-shadow': '#142414',
        'rail-brass': '#988257',
        'dried-thyme': '#C2C1B0',
        
        // Dark Neutrals
        'onyx': '#1B1B1B',
        'iron': '#222222',
        'charcoal': '#4B4B4B',
        'steel': '#727272',
        
        // Light Neutrals
        'pebble': '#E0DCD4',
        'sand': '#F0EDE9',
        'cotton': '#F9F8F6',
        'cloud': '#FFFFFF',
        
        // Functional Colors
        'grass': '#2B705C', // Success
        'alert': '#BE1429', // Error
        'rock': '#909090', // Neutral/Disabled
        'concrete': '#CCCCCC', // Neutral/Disabled Light
        
        // Semantic color mappings for components
        primary: {
          DEFAULT: '#1E361E',
          50: '#F9F8F6',
          100: '#E0DCD4',
          200: '#C2C1B0',
          300: '#988257',
          400: '#7C5C1D',
          500: '#1E361E',
          600: '#142414',
          700: '#142414',
          800: '#1B1B1B',
          900: '#1B1B1B',
        },
        secondary: {
          DEFAULT: '#2F4F2F',
          50: '#F9F8F6',
          100: '#F0EDE9',
          200: '#E0DCD4',
          300: '#C2C1B0',
          400: '#988257',
          500: '#2F4F2F',
          600: '#1E361E',
          700: '#142414',
          800: '#222222',
          900: '#1B1B1B',
        },
        accent: {
          DEFAULT: '#CEAD64',
          50: '#F9F8F6',
          100: '#F0EDE9',
          200: '#E0DCD4',
          300: '#CEAD64',
          400: '#988257',
          500: '#7C5C1D',
          600: '#7C5C1D',
          700: '#7C5C1D',
          800: '#4B4B4B',
          900: '#222222',
        },
        success: '#2B705C',
        error: '#BE1429',
        neutral: {
          50: '#FFFFFF',
          100: '#F9F8F6',
          200: '#F0EDE9',
          300: '#E0DCD4',
          400: '#CCCCCC',
          500: '#909090',
          600: '#727272',
          700: '#4B4B4B',
          800: '#222222',
          900: '#1B1B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['adobe-garamond-pro', 'Adobe Garamond Pro', 'Times New Roman', 'serif'],
        script: ['Dancing Script', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(27, 27, 27, 0.08)',
        'medium': '0 4px 16px rgba(27, 27, 27, 0.12)',
        'strong': '0 8px 32px rgba(27, 27, 27, 0.16)',
      },
    },
  },
  plugins: [],
}