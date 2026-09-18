import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EDEDED',
        surface: '#FAFAFA',
        'surface-dim': '#E0E0E0',
        'surface-bright': '#FFFFFF',
        'surface-container-lowest': '#FAFAFA',
        'surface-container-low': '#F5F5F5',
        'surface-container': '#EDEDED',
        'surface-container-high': '#E5E5E5',
        'surface-container-highest': '#DCDCDC',
        'on-surface': '#1A1A1A',
        'on-surface-variant': '#6B6B6B',
        'inverse-surface': '#1A1A1A',
        'inverse-on-surface': '#FAFAFA',
        outline: '#DCDCDC',
        'outline-variant': '#E0E0E0',
        'surface-tint': '#1A1A1A',
        primary: '#1A1A1A',
        'on-primary': '#FFFFFF',
        'primary-container': '#1A1A1A',
        'on-primary-container': '#FFFFFF',
        'inverse-primary': '#E0E0E0',
        secondary: '#6B6B6B',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E0E0E0',
        'on-secondary-container': '#1A1A1A',
        tertiary: '#1A1A1A',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#E0E0E0',
        'on-tertiary-container': '#1A1A1A',
        error: '#B8564A',
        'on-error': '#FFFFFF',
        'error-container': '#F9ECEB',
        'on-error-container': '#B8564A',
        // Custom palette tokens from reference
        mono: {
          bg: '#EDEDED',
          card: '#FAFAFA',
          active: '#1A1A1A',
          inactive: '#E0E0E0',
          text: '#1A1A1A',
          muted: '#8A8A8A',
          secondary: '#6B6B6B',
          border: '#DCDCDC',
          leak: '#B8564A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        full: '9999px',
      }
    },
  },
  plugins: [],
};
export default config;
