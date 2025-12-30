/**
 * Arcadia Theme Configuration
 * Premium, modern landing page theme with violet/blue gradients
 */

export const arcadiaThemeConfig = {
  name: "Arcadia",
  description: "Premium landing page theme with elegant violet-blue gradients",

  // Default color scheme
  colors: {
    primary: "#541DFF",
    secondary: "#3B82F6",
    background: "#FFFFFF",
    text: "#1E293B",
  },

  // Layout configuration
  layout: {
    containerWidth: "max-w-7xl",
    sectionSpacing: "py-12 md:py-20",
  },

  // Component-specific settings
  components: {
    carousel: {
      autoplayDelay: 5000,
      transitionDuration: 700,
    },
    featured: {
      alternateLayout: true,
      showBadge: true,
    },
    video: {
      showThumbnail: true,
      autoplay: false,
    },
    pricing: {
      showDiscount: true,
      showFlashSale: true,
    },
  },

  // Gradient styles
  gradients: {
    section: "bg-linear-to-br from-violet-50 via-indigo-50 to-white",
    footer: "bg-linear-to-r from-blue-600 to-landing-primary",
    text: "bg-linear-to-r from-landing-primary to-gray-700",
  },
} as const;

export type ArcadiaThemeConfig = typeof arcadiaThemeConfig;
