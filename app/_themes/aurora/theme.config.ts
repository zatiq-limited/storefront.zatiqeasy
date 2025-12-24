/**
 * Aurora Theme Extended Configuration
 * Additional settings and component overrides
 */

import { AuroraTheme } from "./index";

// Extended theme configuration interface
interface ExtendedThemeConfig {
  mode?: string;
  components?: Record<string, unknown>;
  cssVariables?: Record<string, string>;
  customCSS?: string;
}

// Enhanced theme configuration
export const auroraThemeConfig: ExtendedThemeConfig = {
  // Additional theme settings
  mode: "both", // Supports both light and dark mode

  // Component-specific theme overrides
  components: {
    // Header component configuration
    Header: {
      className:
        "h-17.5 md:h-20 sticky w-full top-0 left-0 bg-white dark:bg-black-18 z-100 shadow-sm",
      style: {
        position: "sticky",
        top: 0,
        zIndex: 100,
      },
      props: {
        showCart: true,
        showSearch: true,
        showLanguageToggle: true,
      },
      components: {
        Navigation: {
          className: "hidden lg:flex items-center justify-center gap-9.5",
          props: {
            orientation: "horizontal",
            showLogo: true,
          },
        },
        CartButton: {
          className: "relative p-2 rounded-full cursor-pointer",
          props: {
            showCount: true,
            animateIcon: true,
          },
        },
      },
    },

    // Product card configuration
    ProductCard: {
      className: "aurora-product-card",
      props: {
        showAddToCart: true,
        showBuyNow: true,
        imageAspectRatio: "244/304",
        lazyLoad: true,
      },
      components: {
        ProductImage: {
          className: "w-full aspect-244/304 object-cover rounded-lg md:rounded-none",
        },
        ProductTitle: {
          className:
            "line-clamp-2 text-base font-medium capitalize text-gray-700 dark:text-gray-200",
        },
        ProductPrice: {
          className: "dark:text-blue-zatiq text-base font-medium leading-4.5",
        },
        AddToCartButton: {
          className:
            "flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-blue-zatiq",
        },
        BuyNowButton: {
          className:
            "flex items-center justify-center h-full rounded-lg md:rounded-none border border-blue-zatiq text-white dark:text-black-18 bg-blue-zatiq",
        },
      },
    },

    // Category card configuration
    CategoryCard: {
      className: "flex flex-col items-center justify-center relative aspect-square",
      props: {
        showOverlay: true,
        imageAspectRatio: "square",
      },
    },

    // Carousel configuration
    CarouselSlider: {
      props: {
        autoPlay: true,
        interval: 4000,
        showTitle: true,
        showGradient: true,
      },
      variants: {
        primary: {
          aspectRatio: "1920/720",
          showTitle: true,
        },
        secondary: {
          aspectRatio: "1920/720",
          showTitle: false,
        },
      },
    },

    // Footer configuration
    Footer: {
      className: "w-full shadow-black-1.1 bg-white dark:bg-black-27 mt-8 pt-8 pb-8",
      sections: ["logo", "quickLinks", "contactUs", "followUs"],
      props: {
        showPaymentMethods: true,
        showPoweredBy: true,
      },
    },

    // Grid container
    GridContainer: {
      className: "grid grid-cols-2 lg:grid-cols-4 gap-5",
    },

    // Section header
    SectionHeader: {
      className:
        "text-xl md:text-4xl xl:text-5xl leading-snug lg:leading-[57.50px] text-black-full dark:text-blue-zatiq font-bold",
    },

    // Modal configuration
    SearchModal: {
      className: "fixed inset-0 z-[100000] overflow-y-auto",
      components: {
        Overlay: {
          className: "fixed inset-0 w-full h-full bg-black opacity-40",
        },
        Content: {
          className:
            "relative bg-white dark:bg-black-27 rounded-md shadow-lg top-1 w-[94%] md:w-[85%] max-w-[1300px]",
        },
      },
    },
  },

  // Custom CSS variables
  cssVariables: {
    ...AuroraTheme.config.colors,
    "header-height": "80px",
    "mobile-header-height": "70px",
    "carousel-aspect-desktop": "1920/720",
    "carousel-aspect-mobile": "335/151",
    "product-card-aspect": "244/304",
    "sidebar-width": "280px",
    "transition-fast": "150ms",
    "transition-normal": "300ms",
    "transition-slow": "500ms",
  },

  // Additional custom CSS
  customCSS: `
/* Aurora Theme Custom CSS */

/* Dark mode support */
.dark .aurora-header {
  background-color: #18181B;
  border-bottom: none;
}

.dark .aurora-footer {
  background-color: #27272A;
}

/* Aurora specific animations */
@keyframes aurora-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.aurora-animate-in {
  animation: aurora-fade-in 0.3s ease-out;
}

/* Aurora card hover effects */
.aurora-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Aurora gradient overlay for banners */
.aurora-gradient-overlay {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
}

/* Aurora sale badge */
.aurora-sale-badge {
  background-color: #3B82F6;
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
}

/* Aurora button states */
.aurora-btn-disabled {
  background-color: #E5E7EB;
  color: #6B7280;
  cursor: not-allowed;
  border: none;
}

/* Aurora loading skeleton */
.aurora-skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: aurora-skeleton-loading 1.5s infinite;
}

@keyframes aurora-skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Aurora out of stock overlay */
.aurora-out-of-stock {
  position: absolute;
  width: 100%;
  padding: 8px 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  backdrop-filter: blur(4px);
}
  `,
};

// Export theme configuration
export default auroraThemeConfig;
