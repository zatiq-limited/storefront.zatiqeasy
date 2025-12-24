/**
 * Luxura Theme Configuration
 * Premium e-commerce theme with sidebar navigation and elegant design
 */

export const luxuraThemeConfig = {
  name: "luxura",
  displayName: "Luxura",
  version: "2.0.0",

  // Color System
  colors: {
    primary: {
      DEFAULT: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
      contrast: "#FFFFFF",
    },
    secondary: {
      DEFAULT: "#8B5CF6",
      light: "#A78BFA",
      dark: "#7C3AED",
    },
    accent: {
      DEFAULT: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      DEFAULT: "#FFFFFF",
      dark: "#0F172A",
      muted: "#F8FAFC",
    },
    text: {
      DEFAULT: "#1E293B",
      muted: "#64748B",
      light: "#94A3B8",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Helvetica Now', sans-serif",
      secondary: "'Inter', sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },

  // Spacing System - Luxura specific (larger spacing)
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "36px",
    xl: "60px",
    "2xl": "84px",
  },

  // Layout - Luxura uses premium 78% width
  layout: {
    container: {
      maxWidth: "1440px",
      width: {
        mobile: "95%",
        tablet: "90%",
        desktop: "78%", // Premium width
      },
      padding: {
        mobile: "16px",
        tablet: "24px",
        desktop: "0",
      },
    },
    header: {
      height: {
        mobile: "70px",
        desktop: "80px",
      },
    },
    sidebar: {
      width: "25%",
      height: {
        lg: "420px",
        xl: "600px",
      },
    },
    hero: {
      height: {
        mobile: "280px",
        sm: "320px",
        md: "360px",
        lg: "420px",
        xl: "600px",
      },
    },
  },

  // Components
  components: {
    card: {
      borderRadius: "12px",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      hoverShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
    productCard: {
      aspectRatio: "420/360", // Luxura specific
      borderRadius: "12px",
    },
    button: {
      borderRadius: "8px",
      padding: {
        sm: "8px 16px",
        md: "12px 24px",
        lg: "16px 32px",
      },
    },
    input: {
      borderRadius: "8px",
      height: "44px",
    },
    sidebarCategory: {
      background: "white",
      shadow: "md",
      borderRadius: "12px",
    },
  },

  // Swiper Configuration
  swiper: {
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    navigation: true,
    loop: true,
    rewind: true,
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

export type LuxuraThemeConfig = typeof luxuraThemeConfig;
