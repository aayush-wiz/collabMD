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
        brand: {
          50: "#f5fbff",
          100: "#e0f6ff",
          200: "#b8ebff",
          300: "#7ad8ff",
          400: "#2fc3ff",
          500: "#00a9ff",
          600: "#0084db",
          700: "#0065ae",
          800: "#045490",
          900: "#0a4675",
        },
      },
      backgroundImage: {
        "grid-slate":
          "linear-gradient(to right, rgba(39,39,42,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(39,39,42,0.4) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
