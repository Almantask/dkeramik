import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#fdf8f5',
          100: '#f5ebe0',
          200: '#e8d5c0',
          300: '#d4b896',
          400: '#c19572',
          500: '#a67c52',
          600: '#8b6340',
          700: '#6b4c30',
          800: '#4a3420',
          900: '#2d1f12',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        nunito: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
