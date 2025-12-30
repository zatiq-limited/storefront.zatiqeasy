/**
 * Luxura Theme - Premium E-commerce Theme
 * Features sidebar category navigation, elegant design, and premium layout width
 */

import type { StaticTheme } from "@/types/theme";

// Export theme configuration
export { luxuraThemeConfig } from "./theme.config";

// Export layout components
export { LuxuraHeader } from "./components/header";
export { LuxuraFooter } from "./components/footer";

// Export page modules
export { LuxuraHomePage } from "./modules/home/luxura-home-page";
export { LuxuraAllProducts } from "./modules/products/luxura-all-products";
export { LuxuraCategoryPage } from "./modules/category/luxura-category-page";
export { LuxuraProductDetailPage } from "./modules/product-detail/luxura-product-detail-page";

// Theme definition for static theme system
export const LuxuraTheme: StaticTheme = {
  id: "luxura",
  name: "luxura",
  displayName: "Luxura",
  description: "Premium e-commerce theme with sidebar navigation and elegant design",
  version: "2.0.0",
  author: "Zatiq",
  category: "premium",
  isPremium: true,
  supportsDarkMode: true,

  config: {
    colors: {
      // Primary colors
      primary: "#3B82F6",
      primaryHover: "#2563EB",
      primaryLight: "#DBEAFE",
      primaryDark: "#1E40AF",

      // Secondary colors
      secondary: "#6B7280",
      secondaryHover: "#4B5563",
      secondaryLight: "#F3F4F6",
      secondaryDark: "#374151",

      // Accent colors
      accent: "#10B981",
      accentHover: "#059669",

      // Semantic colors
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",

      // Neutral colors
      background: "#FFFFFF",
      foreground: "#1F2937",
      muted: "#F3F4F6",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
      input: "#FFFFFF",
      ring: "#3B82F6",

      // Text colors
      textPrimary: "#1F2937",
      textSecondary: "#6B7280",
      textMuted: "#9CA3AF",
      textInverse: "#FFFFFF",

      // Surface colors
      surface: "#FFFFFF",
      surfaceVariant: "#F9FAFB",
      surfaceHover: "#F3F4F6",
    },

    // Spacing system
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
    },

    // Typography
    fonts: {
      primary: "Helvetica Now Text, Inter, system-ui, sans-serif",
      secondary: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, Consolas, monospace",
      display: "Helvetica Now Text, system-ui, sans-serif",
      body: "Helvetica Now Text, system-ui, sans-serif",
      heading: "Helvetica Now Text, system-ui, sans-serif",
    },

    // Border radius
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
  },

  // Dynamic component imports
  components: {
    Header: () => import("./components/header/header"),
    Footer: () => import("@/app/_themes/aurora/components/footer/footer"),
    ProductCard: () => import("./components/cards/luxura-product-card"),
    CategoryCard: () => import("./components/cards/luxura-category-card"),
    SearchModal: () => import("./components/search/luxura-search-modal"),
    CarouselSlider: () => import("./components/carousel/luxura-carousel-slider"),
  },

  // Dynamic module imports
  modules: {
    "luxura-home-page": () => import("./modules/home/luxura-home-page"),
    "luxura-all-products": () => import("./modules/products/luxura-all-products"),
    "luxura-category-page": () => import("./modules/category/luxura-category-page"),
    "luxura-product-detail-page": () => import("./modules/product-detail/luxura-product-detail-page"),
  },

  // Theme styles
  styles: {
    globals: `
/* Luxura Theme - Global Styles */
:root {
  --luxura-primary: #3B82F6;
  --luxura-primary-hover: #2563EB;
}
    `,
    components: `
/* Luxura Theme - Component Styles */
.luxura-product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.luxura-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
    `,
    utilities: `
/* Luxura Theme - Utility Classes */
.text-blue-zatiq {
  color: var(--luxura-primary);
}

.bg-blue-zatiq {
  background-color: var(--luxura-primary);
}

.border-blue-zatiq {
  border-color: var(--luxura-primary);
}
    `,
  },

  preview: {
    image: "/themes/luxura/preview.png",
    thumbnail: "/themes/luxura/thumbnail.png",
    demoUrl: "https://demo.zatiq.com/themes/luxura",
  },

  // Dependencies
  dependencies: ["lucide-react", "clsx", "tailwind-merge", "framer-motion", "swiper"],
};

export default LuxuraTheme;
