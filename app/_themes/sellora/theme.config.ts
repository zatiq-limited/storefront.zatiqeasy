/**
 * Sellora Theme Configuration
 * Clean, modern e-commerce theme with full-width hero and scroll effects
 */

export const selloraThemeConfig = {
  // Layout settings
  layout: {
    containerWidth: "100%",
    maxWidth: "1280px", // max-w-7xl
    headerHeight: "80px",
    headerHeightMobile: "48px",
  },

  // Product card settings
  productCard: {
    aspectRatio: "10/16", // 1:1.6 aspect ratio
    hoverEffect: true,
    showBuyNowOnHover: true,
  },

  // Grid settings
  grid: {
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
    gap: {
      mobile: "12px",
      tablet: "20px",
      desktop: "20px",
    },
  },

  // Category grid
  categoryGrid: {
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 3,
    },
  },

  // Carousel settings
  carousel: {
    autoPlayDelay: 4000,
    primaryHeight: {
      mobile: "210px",
      tablet: "500px",
      desktop: "800px",
    },
    secondaryHeight: {
      mobile: "210px",
      tablet: "500px",
      desktop: "580px",
    },
  },

  // On Sale Swiper settings
  onSaleSwiper: {
    slidesPerView: {
      mobile: 2,
      tablet: 3,
      desktop: 3,
    },
    autoPlayDelay: 5000,
  },

  // Colors
  colors: {
    footerBackground: "#ede9e6",
    footerBackgroundDark: "#dad1ca",
    trustBarBackground: "#000000",
    saleBadgeColor: "#E97171",
  },

  // Features
  features: {
    heroCarousel: true,
    onSaleSection: true,
    trustFeaturesBar: true,
    languageToggler: true,
    scrollHeader: true,
    buyNowButton: true,
    flashSaleCountdown: true,
  },
};

export default selloraThemeConfig;
