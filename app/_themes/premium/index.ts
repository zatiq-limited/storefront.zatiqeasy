/**
 * Premium Theme - Zatiq Storefront
 * A premium e-commerce theme with 5-column grid, search modal, and buy now functionality
 */

import type { StaticTheme } from "@/types/theme";

// Export theme configuration
export { premiumThemeConfig } from "./theme.config";

// Export layout components
export { PremiumHeader } from "./components/header";
export { PremiumFooter } from "./components/footer";

// Export core components
export { PremiumProductCard, PremiumCategoryCard } from "./components/cards";
export { PremiumSearchModal } from "./components/search";
export { GridContainer } from "./components/core";

// Export page modules
export { PremiumHomePage } from "./modules/home/premium-home-page";
export { PremiumAllProducts } from "./modules/products/premium-all-products";
export { PremiumCategoryPage } from "./modules/category/premium-category-page";
export { PremiumProductDetailPage } from "./modules/product-detail/premium-product-detail-page";

// Theme definition for static theme system
export const PremiumTheme: StaticTheme = {
  id: "premium",
  name: "premium",
  displayName: "Premium",
  description: "Premium e-commerce theme with 5-column grid, search modal, and buy now functionality",
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
    ProductCard: () => import("./components/cards/premium-product-card"),
    CategoryCard: () => import("./components/cards/premium-category-card"),
    SearchModal: () => import("./components/search/premium-search-modal"),
  },

  // Dynamic module imports
  modules: {
    "premium-home-page": () => import("./modules/home/premium-home-page"),
    "premium-all-products": () => import("./modules/products/premium-all-products"),
    "premium-category-page": () => import("./modules/category/premium-category-page"),
    "premium-product-detail-page": () => import("./modules/product-detail/premium-product-detail-page"),
  },

  // Theme styles
  styles: {
    globals: `
/* Premium Theme - Global Styles */
:root {
  --premium-primary: #3B82F6;
  --premium-primary-hover: #2563EB;
}

/* Premium container widths */
.premium-container {
  width: 95%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .premium-container {
    width: 90%;
  }
}

@media (min-width: 1024px) {
  .premium-container {
    width: 85%;
  }
}

/* Premium aspect ratio for product cards */
.aspect-244-304 {
  aspect-ratio: 244 / 304;
}
    `,
    components: `
/* Premium Theme - Component Styles */
.premium-product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.premium-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Premium 5-column grid */
.premium-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .premium-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .premium-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
    `,
    utilities: `
/* Premium Theme - Utility Classes */
.text-blue-zatiq {
  color: var(--premium-primary);
}

.bg-blue-zatiq {
  background-color: var(--premium-primary);
}

.border-blue-zatiq {
  border-color: var(--premium-primary);
}
    `,
  },

  preview: {
    image: "/themes/premium/preview.png",
    thumbnail: "/themes/premium/thumbnail.png",
    demoUrl: "https://demo.zatiq.com/themes/premium",
  },

  // Dependencies
  dependencies: ["lucide-react", "clsx", "tailwind-merge", "framer-motion"],
};

export default PremiumTheme;
