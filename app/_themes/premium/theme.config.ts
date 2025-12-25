/**
 * Premium Theme Configuration
 */

export const premiumThemeConfig = {
  name: "Premium",
  displayName: "Premium Theme",
  description: "Feature-rich e-commerce theme with advanced product cards and search",

  // Layout specifications
  layout: {
    containerWidth: "95%", // Mobile
    containerWidthMd: "90%", // Tablet
    containerWidthLg: "85%", // Desktop
    maxWidth: "1400px",
  },

  // Product card specifications
  productCard: {
    aspectRatio: "244/304",
    imageAspectRatio: "244/304",
    borderRadius: "0.75rem",
    hoverScale: 1.02,
  },

  // Grid specifications
  grid: {
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 5,
    },
    gap: {
      mobile: "0.75rem",
      tablet: "1rem",
      desktop: "1.25rem",
    },
  },

  // Section spacing
  sections: {
    paddingY: {
      mobile: "1.5rem",
      tablet: "2.5rem",
      desktop: "3.5rem",
    },
    gap: {
      mobile: "2rem",
      tablet: "3rem",
      desktop: "4rem",
    },
  },

  // Colors
  colors: {
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    discount: "#E97171",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#1F2937",
    textSecondary: "#6B7280",
  },

  // Features
  features: {
    buyNowButton: true,
    searchModal: true,
    productModifierModal: true,
    floatingCart: true,
    categoryBasedSections: true,
    featuredCategoryLarge: true, // First category 2x2 on XL
  },
};

export default premiumThemeConfig;
