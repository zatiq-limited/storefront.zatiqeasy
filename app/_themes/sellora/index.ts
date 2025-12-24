/**
 * Sellora Theme - Zatiq Storefront
 * A modern e-commerce theme with scroll-based header transparency, trust features bar, and 1:1.6 product cards
 */

import type { StaticTheme } from "@/types/theme";

// Export theme configuration
export { selloraThemeConfig } from "./theme.config";

// Export layout components
export { SelloraHeader } from "./components/header";
export { SelloraFooter } from "./components/footer";

// Export core components
export { SelloraProductCard, SelloraCategoryCard } from "./components/cards";
export { SelloraSearchModal } from "./components/sections/search-modal";
export { TrustFeaturesBar } from "./components/sections/trust-features";
export { HeroCarousel } from "./components/carousel";
export { GridContainer, Pagination } from "./components/core";

// Export page modules
export { SelloraHomePage } from "./modules/home/sellora-home-page";
export { SelloraAllProducts } from "./modules/products/sellora-all-products";
export { SelloraCategoryPage } from "./modules/category/sellora-category-page";
export { SelloraProductDetailPage } from "./modules/product-detail/sellora-product-detail-page";

// Theme definition for static theme system
export const SelloraTheme: StaticTheme = {
  id: "sellora",
  name: "sellora",
  displayName: "Sellora",
  description: "Modern e-commerce theme with scroll-based header transparency, trust features bar, and elegant product cards",
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
      primary: "Inter, system-ui, sans-serif",
      secondary: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, Consolas, monospace",
      display: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      heading: "Inter, system-ui, sans-serif",
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
    Footer: () => import("./components/footer/footer"),
    ProductCard: () => import("./components/cards/sellora-product-card"),
    CategoryCard: () => import("./components/cards/sellora-category-card"),
    SelloraSearchModal: () => import("./components/sections/search-modal"),
    TrustFeaturesBar: () => import("./components/sections/trust-features"),
  },

  // Dynamic module imports
  modules: {
    "sellora-home-page": () => import("./modules/home/sellora-home-page"),
    "sellora-all-products": () => import("./modules/products/sellora-all-products"),
    "sellora-category-page": () => import("./modules/category/sellora-category-page"),
    "sellora-product-detail-page": () => import("./modules/product-detail/sellora-product-detail-page"),
  },

  // Theme styles
  styles: {
    globals: `
/* Sellora Theme - Global Styles */
:root {
  --sellora-primary: #3B82F6;
  --sellora-primary-hover: #2563EB;
  --sellora-footer-bg: #ede9e6;
  --sellora-trust-bar-bg: #000000;
  --sellora-sale-badge: #E97171;
}

/* Sellora container widths */
.sellora-container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1280px) {
  .sellora-container {
    padding-left: 0;
    padding-right: 0;
  }
}

/* Sellora aspect ratio for product cards (10:16 = 1:1.6) */
.aspect-sellora {
  aspect-ratio: 10 / 16;
}
    `,
    components: `
/* Sellora Theme - Component Styles */
.sellora-product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sellora-product-card:hover {
  transform: translateY(-4px);
}

/* Sellora header with scroll transparency */
.sellora-header-transparent {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.sellora-header-solid {
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Trust features bar */
.sellora-trust-bar {
  background-color: var(--sellora-trust-bar-bg);
}

/* Footer background */
.sellora-footer {
  background-color: var(--sellora-footer-bg);
}

/* Sale badge */
.sellora-sale-badge {
  background-color: var(--sellora-sale-badge);
}
    `,
    utilities: `
/* Sellora Theme - Utility Classes */
.text-blue-zatiq {
  color: var(--sellora-primary);
}

.bg-blue-zatiq {
  background-color: var(--sellora-primary);
}

.border-blue-zatiq {
  border-color: var(--sellora-primary);
}

.bg-sellora-footer {
  background-color: var(--sellora-footer-bg);
}
    `,
  },

  preview: {
    image: "/themes/sellora/preview.png",
    thumbnail: "/themes/sellora/thumbnail.png",
    demoUrl: "https://demo.zatiq.com/themes/sellora",
  },

  // Dependencies
  dependencies: ["lucide-react", "clsx", "tailwind-merge", "framer-motion", "swiper"],
};

export default SelloraTheme;
