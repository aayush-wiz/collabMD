import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        midnight: {
          950: "#030712",
          900: "#081123",
          800: "#0f1f3a",
          700: "#132a4f",
          600: "#183765",
          500: "#1f4b87",
        },
      },
    },
  },
  plugins: [],
};

export default config;

