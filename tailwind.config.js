/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      colors: {
        // Exact tokens from Stitch project
        'primary': '#231f74',
        'primary-container': '#3a388b',
        'primary-fixed': '#e2dfff',
        'primary-fixed-dim': '#c2c1ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#a8a7ff',
        'on-primary-fixed': '#0f0564',
        'on-primary-fixed-variant': '#3e3c8f',
        'inverse-primary': '#c2c1ff',

        'secondary': '#006c49',
        'secondary-container': '#6cf8bb',
        'secondary-fixed': '#6ffbbe',
        'secondary-fixed-dim': '#4edea3',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#00714d',
        'on-secondary-fixed': '#002113',
        'on-secondary-fixed-variant': '#005236',

        'tertiary': '#003421',
        'tertiary-container': '#004d33',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4fdea4',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#2ec68e',
        'on-tertiary-fixed': '#002114',
        'on-tertiary-fixed-variant': '#005237',

        'background': '#f8f9fc',
        'on-background': '#191c1e',
        'surface': '#f8f9fc',
        'surface-bright': '#f8f9fc',
        'surface-dim': '#d8dadd',
        'surface-tint': '#5655a9',
        'surface-variant': '#e1e2e5',
        'surface-container': '#eceef0',
        'surface-container-high': '#e7e8eb',
        'surface-container-highest': '#e1e2e5',
        'surface-container-low': '#f2f4f6',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#191c1e',
        'on-surface-variant': '#464651',

        'outline': '#777682',
        'outline-variant': '#c8c5d3',

        'inverse-surface': '#2e3133',
        'inverse-on-surface': '#eff1f3',

        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1.5rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 24px 80px rgba(25, 28, 30, 0.04)',
        'glass-md': '0 12px 40px rgba(25, 28, 30, 0.03)',
        'primary-glow': '0 20px 60px rgba(35, 31, 116, 0.25)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to bottom right, #231f74, #3a388b)',
      },
    },
  },
  plugins: [],
}
