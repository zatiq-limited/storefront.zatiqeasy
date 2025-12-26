/**
 * Nirvana Theme Configuration
 * Clean, gradient-based landing page theme with focus on content
 */

export const nirvanaThemeConfig = {
  name: "Nirvana",
  description: "Clean gradient theme with focus on content and features",

  // Default color scheme
  colors: {
    primary: "#541DFF",
    secondary: "#8B5CF6",
    background: "#FFFFFF",
    text: "#1F2937",
  },

  // Layout configuration
  layout: {
    containerWidth: "max-w-7xl",
    sectionSpacing: "py-16 md:py-20",
  },

  // Component-specific settings
  components: {
    carousel: {
      autoplayDelay: 4000,
      showTitle: true,
    },
    features: {
      showNumbers: true,
      gridCols: 4,
    },
    pricing: {
      showSavePercentage: true,
      showTrustBadge: true,
    },
    staticBanner: {
      showDivider: true,
      showShopName: true,
    },
  },

  // Gradient styles
  gradients: {
    text: "bg-linear-to-r from-landing-primary to-landing-secondary",
    background:
      "bg-linear-to-br from-landing-primary/5 via-landing-primary/10 to-landing-secondary/5",
    button: "bg-linear-to-r from-landing-primary to-landing-secondary",
  },
} as const;

export type NirvanaThemeConfig = typeof nirvanaThemeConfig;
