import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "work-sans": ["Work Sans", "sans-serif"],
      },
      boxShadow: {
        "zatiq-blue": "0px 0px 8px 0px var(--primary-color-50)",
      },
      colors: {
        blue: {
          zatiq: "var(--primary-color)",
          "zatiq/15": "var(--primary-color-15)",
          "zatiq/10": "var(--primary-color-10)",
          "zatiq/25": "var(--primary-color-25)",
          "zatiq/50": "var(--primary-color-50)",
          "zatiq/75": "var(--primary-color-75)",
        },
        landing: {
          primary: "var(--landing-primary-color)",
          "primary/15": "var(--landing-primary-color-15)",
          "primary/10": "var(--landing-primary-color-10)",
          "primary/25": "var(--landing-primary-color-25)",
          "primary/50": "var(--landing-primary-color-50)",
          secondary: "var(--landing-secondary-color)",
          "secondary/15": "var(--landing-secondary-color-15)",
          "secondary/10": "var(--landing-secondary-color-10)",
          "secondary/25": "var(--landing-secondary-color-25)",
          "secondary/50": "var(--landing-secondary-color-50)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
