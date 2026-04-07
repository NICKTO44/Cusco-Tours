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
        earth: {
          50: "#faf6f0",
          100: "#f0e8d8",
          200: "#e0d0b4",
          300: "#cbb388",
          400: "#b89662",
          500: "#a67c4a",
          600: "#8f663e",
          700: "#755236",
          800: "#614532",
          900: "#533b2e",
        },
        gold: {
          400: "#d4a853",
          500: "#c9a227",
          600: "#a8841f",
        },
        jungle: {
          500: "#2d6a4f",
          600: "#1b4332",
          700: "#0f3d2e",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
