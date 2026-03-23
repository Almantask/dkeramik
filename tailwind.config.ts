import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#fdf8f5',   // warm off-white background
          100: '#f5ebe0',  // blush beige
          200: '#e8d5c0',  // pale nude
          300: '#d4b896',  // dusty peach
          400: '#c19572',  // muted terracotta
          500: '#a67c52',  // cinnamon clay — headings & accents
          600: '#8b6340',  // deeper clay
          700: '#6b4c30',  // body text default
          800: '#4a3420',
          900: '#2d1f12',
        },
      },
      fontFamily: {
        // ─── CUSTOM FONTS ──────────────────────────────────────────────────
        // Font names must match the @fontsource packages imported in
        // app/layout.tsx.  To change a font, update both that file and
        // the family names below.
        // ───────────────────────────────────────────────────────────────────
        playfair: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        nunito: ['Nunito', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        lato: ['Lato', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      lineHeight: {
        loose: '1.9',
      },
    },
  },
  plugins: [],
};

export default config;
