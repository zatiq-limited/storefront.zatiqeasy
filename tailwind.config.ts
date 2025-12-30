import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Safelist classes used in theme builder JSON blocks (not scannable by Tailwind)
  safelist: [
    // Height constraints for logos
    "h-auto",
    "max-h-6",
    "max-h-8",
    "max-h-10",
    "max-h-12",
    "max-h-14",
    // Width constraints for logos
    "w-auto",
    "max-w-24",
    "max-w-28",
    "max-w-32",
    "max-w-36",
    "max-w-40",
    "max-w-44",
    "max-w-48",
    // Object fit
    "object-contain",
    "object-cover",
    // Responsive variants
    "sm:max-h-8",
    "sm:max-h-10",
    "sm:max-h-12",
    "sm:max-w-28",
    "sm:max-w-32",
    "sm:max-w-36",
    "md:max-h-10",
    "md:max-h-12",
    "md:max-h-14",
    "md:max-w-36",
    "md:max-w-40",
    "md:max-w-44",
    "lg:max-h-12",
    "lg:max-h-14",
    // Shrink
    "shrink-0",
    "flex-shrink-0",
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
        black: {
          full: "#000000",
          zatiq: "#383838",
          "2": "#4A4A4A",
          "3": "#CDCDCD",
          "4": "#E8E8E8",
          "1.1": "#16151A",
          "1.2": "#1F1E25",
          "18": "#18181B",
          "27": "#272727",
          "3f": "#3f3f46",
          disabled: "#AFAFAF",
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
