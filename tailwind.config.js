export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#231f74',
          container: '#3a388b',
          light: 'rgba(35, 31, 116, 0.15)',
        },
        secondary: {
          DEFAULT: '#006c49',
          container: '#6cf8bb',
        },
        tertiary: {
          DEFAULT: '#003421',
          container: '#004d33',
        },
        surface: {
          DEFAULT: '#f8f9fc',
          container: '#eceef0',
          'container-low': 'rgba(255, 255, 255, 0.5)',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-surface': '#191c1e',
        'on-surface-variant': '#464651',
        outline: '#777682',
      },
      borderRadius: {
        glass: '24px',
        'glass-sm': '16px',
        'glass-xs': '12px',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(25, 28, 30, 0.04)',
        'glass-md': '0 12px 40px rgba(25, 28, 30, 0.03)',
        'primary-glow': '0 20px 60px rgba(35, 31, 116, 0.25)',
        'primary-glow-sm': '0 12px 30px rgba(35, 31, 116, 0.25)',
        'primary-glow-xs': '0 8px 20px rgba(35, 31, 116, 0.2)',
      },
      backdropBlur: {
        glass: '24px',
        'glass-sm': '12px',
        'glass-xs': '8px',
      },
    },
  },
  plugins: [],
};
