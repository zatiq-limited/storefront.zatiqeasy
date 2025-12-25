/**
 * Grip Landing Theme Configuration
 */

export const gripThemeConfig = {
  // Content constraints
  constraints: {
    banners: {
      TOP: { max: 3 },
      FEATURED: { max: 2 },
      SHOWCASE: { max: 4 },
      STANDALONE: { max: 1 },
      IMAGE_BANNER: { max: 4 },
    },
    product_videos: {
      FEATURED: { max: 1 },
    },
    product_image: {
      SIMPLE: { max: 1 },
    },
  },

  // Layout settings
  layout: {
    containerWidth: "100%",
    maxWidth: "1280px",
    headerHeight: "80px",
  },

  // Default colors
  colors: {
    primary: "#541DFF",
    secondary: "#000000",
  },

  // Feature flags
  features: {
    autoAddToCart: true,
    embeddedCheckout: true,
    darkModeSupport: true,
  },

  // Carousel settings
  carousel: {
    autoPlayDelay: 5000,
    slidesPerView: 1,
  },
} as const;

export type GripThemeConfig = typeof gripThemeConfig;
