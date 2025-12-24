/**
 * Aurora Theme - Zatiq Storefront
 * A modern, elegant theme with dynamic carousels and rich UI
 */

import { StaticTheme } from "@/types/theme";

// Theme configuration
export const AuroraTheme: StaticTheme = {
  id: "aurora",
  name: "aurora",
  displayName: "Aurora Theme",
  description:
    "Modern and elegant design with dynamic carousels and smooth animations",
  version: "1.0.0",
  author: "Zatiq Team",
  category: "premium",
  isDefault: false,
  isPremium: true,
  supportsDarkMode: true,

  // Theme configuration
  config: {
    colors: {
      // Aurora Primary - Blue Zatiq
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

  // Component mappings (dynamic imports)
  components: {
    // Header components
    Header: () => import("./components/header/header"),

    // Footer components
    Footer: () => import("./components/footer/footer"),

    // Carousel components
    CarouselSlider: () => import("./components/carousel/aurora-carousel-slider"),

    // Search components
    SearchModal: () => import("./components/search/search-modal"),

    // Card components
    ProductCard: () => import("./components/cards/aurora-product-card"),
    CategoryCard: () => import("./components/cards/category-card"),

    // Animation components (shared)
    HeightAnimation: () =>
      import("@/components/shared/animations/height-animation"),
    LazyAnimation: () =>
      import("@/components/shared/animations/lazy-animation"),
  },

  // Module mappings
  modules: {
    "aurora-home-page": () => import("./modules/home/aurora-home-page"),
    "aurora-category-page": () =>
      import("./modules/category/aurora-category-page"),
    "aurora-product-detail-page": () =>
      import("./modules/product-detail/aurora-product-detail-page"),
    "aurora-all-products": () =>
      import("./modules/products/aurora-all-products"),
    "aurora-checkout": () => import("./modules/checkout/aurora-checkout"),
  },

  // Theme styles
  styles: {
    globals: `
/* Aurora Theme - Global Styles */
:root {
  --aurora-primary: #3B82F6;
  --aurora-primary-hover: #2563EB;
  --aurora-dark-bg: #18181B;
  --aurora-dark-surface: #27272A;
}

/* Aurora specific scrollbar */
.aurora-theme::-webkit-scrollbar {
  width: 6px;
}

.aurora-theme::-webkit-scrollbar-thumb {
  background: var(--aurora-primary);
  border-radius: 3px;
}

/* Aurora banner aspect ratios */
.aspect-1920-720 {
  aspect-ratio: 1920 / 720;
}

.aspect-335-151 {
  aspect-ratio: 335 / 151;
}

.aspect-244-304 {
  aspect-ratio: 244 / 304;
}
    `,

    components: `
/* Aurora Theme - Component Styles */

/* Aurora Product Card */
.aurora-product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.aurora-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Aurora Carousel */
.aurora-carousel {
  position: relative;
}

.aurora-carousel .slide-indicator {
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.3s ease;
}

.aurora-carousel .slide-indicator.active {
  background: var(--aurora-primary);
}

/* Aurora Button */
.aurora-btn-primary {
  background: var(--aurora-primary);
  color: white;
  border: 1px solid var(--aurora-primary);
  transition: all 0.2s ease;
}

.aurora-btn-primary:hover {
  background: var(--aurora-primary-hover);
  border-color: var(--aurora-primary-hover);
}

.aurora-btn-outline {
  background: transparent;
  color: var(--aurora-primary);
  border: 1px solid var(--aurora-primary);
  transition: all 0.2s ease;
}

.aurora-btn-outline:hover {
  background: var(--aurora-primary);
  color: white;
}
    `,

    utilities: `
/* Aurora Theme - Utility Classes */

.text-blue-zatiq {
  color: var(--aurora-primary);
}

.bg-blue-zatiq {
  background-color: var(--aurora-primary);
}

.border-blue-zatiq {
  border-color: var(--aurora-primary);
}

/* Aurora Grid */
.aurora-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .aurora-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
    `,
  },

  // Preview image
  preview: {
    image: "/themes/aurora/preview.png",
    thumbnail: "/themes/aurora/thumbnail.png",
    demoUrl: "https://demo.zatiq.com/themes/aurora",
  },

  // Dependencies
  dependencies: ["lucide-react", "clsx", "tailwind-merge", "framer-motion"],
};

// Export theme configuration
export default AuroraTheme;

// Export page modules
export { AuroraHomePage } from "./modules/home/aurora-home-page";
export { AuroraCategoryPage } from "./modules/category/aurora-category-page";
export { AuroraProductDetailPage } from "./modules/product-detail/aurora-product-detail-page";
export { AuroraAllProducts } from "./modules/products/aurora-all-products";

// Export theme utilities
export const auroraThemeUtils = {
  // Get theme color as RGB tuple for Tailwind
  getColor(colorName: string): [number, number, number] {
    const color =
      AuroraTheme.config.colors[
        colorName as keyof typeof AuroraTheme.config.colors
      ];
    if (!color) return [0, 0, 0];

    // Convert hex to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  },

  // Get CSS custom property value
  getCSSVar(varName: string): string {
    const themeVar =
      AuroraTheme.config.colors[
        varName as keyof typeof AuroraTheme.config.colors
      ];
    return themeVar || "";
  },

  // Check if dark mode
  isDarkMode(): boolean {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  },
};
