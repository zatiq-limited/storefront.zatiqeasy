/**
 * ========================================
 * MOCK THEME DATA
 * ========================================
 *
 * Backend Developer এর জন্য API Endpoints:
 *
 * GET /api/storefront/v1/init
 * - Returns: Shop configuration and active theme
 *
 * GET /api/storefront/v1/theme
 * - Returns: Complete theme configuration with all sections
 *
 * GET /api/storefront/v1/page/:pageType
 * - pageType: 'index' | 'product' | 'collection' | 'cart'
 * - Returns: Page-specific data and sections
 *
 * এখন Static Data দিয়ে কাজ করা হচ্ছে
 */

import type { ZatiqTheme, ShopConfig } from "../lib/types";

export const mockShopConfig: ShopConfig = {
  id: "shop_demo_12345",
  name: "Zatiq Fashion Store",
  domain: "demo.zatiq.com",
  locale: "en-US",
  currency: {
    code: "USD",
    symbol: "$",
    format: "${amount}",
  },
  contact: {
    email: "support@zatiq.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fashion Street, New York, NY 10001",
  },
  social: {
    facebook: "https://facebook.com/zatiqfashion",
    instagram: "https://instagram.com/zatiqfashion",
    twitter: "https://twitter.com/zatiqfashion",
    pinterest: "https://pinterest.com/zatiqfashion",
  },
};

export const mockTheme: ZatiqTheme = {
  id: "theme_zatiq_modern_v3",
  name: "Modern Fashion Theme",
  version: "3.2.1",

  globalSections: {
    // Announcement Bar
    announcement: {
      id: "global_announcement",
      type: "announcement-bar-1",
      enabled: true,
      settings: {
        message: "🎉 Black Friday Sale - Up to 70% OFF + Free Shipping!",
        icon_left: "🔥",
        icon_right: "🔥",
        gradient_start: "#FF6B6B",
        gradient_end: "#4ECDC4",
        text_color: "#FFFFFF",
      },
    },

    // Header/Navbar
    header: {
      id: "global_header",
      type: "navbar-2",
      enabled: true,
      settings: {
        logo: "/logo.svg",
        searchPlaceholder: "Search products...",
        show_search: true,
        show_dark_mode_toggle: true,
        show_cart: true,
        background_color: "#ffffff",
      },
      blocks: [
        {
          id: "menu_women",
          type: "menu_item",
          settings: {
            title: "Women",
            url: "/collections/womens",
          },
        },
        {
          id: "menu_men",
          type: "menu_item",
          settings: {
            title: "Men",
            url: "/collections/mens",
          },
        },
        {
          id: "menu_sale",
          type: "menu_item",
          settings: {
            title: "Sale",
            url: "/collections/sale",
            highlight: true,
          },
        },
      ],
    },

    // Footer
    footer: {
      id: "global_footer",
      type: "footer-2",
      enabled: true,
      settings: {
        background_color: "#1F2937",
        text_color: "#F9FAFB",
        logo: "/logo-white.svg",
        show_newsletter: true,
        show_social: true,
        copyright_text: "© 2024 Zatiq Fashion Store. All rights reserved.",
      },
      blocks: [
        {
          id: "footer_shop",
          type: "menu_column",
          settings: {
            title: "Shop",
            links: [
              { text: "Women", url: "/collections/womens" },
              { text: "Men", url: "/collections/mens" },
              { text: "New Arrivals", url: "/collections/new" },
              { text: "Sale", url: "/collections/sale" },
            ],
          },
        },
        {
          id: "footer_help",
          type: "menu_column",
          settings: {
            title: "Customer Care",
            links: [
              { text: "Contact Us", url: "/pages/contact" },
              { text: "Shipping Info", url: "/pages/shipping" },
              { text: "Returns", url: "/pages/returns" },
              { text: "FAQs", url: "/pages/faq" },
            ],
          },
        },
      ],
    },
  },

  templates: {
    // Homepage Template
    index: {
      name: "Homepage",
      layout: "default",
      sections: [
        {
          id: "homepage_hero",
          type: "hero-1",
          enabled: true,
          settings: {
            image:
              "https://images.unsplash.com/photo-1483985988355-763728e1935b",
            small_text: "SUMMER COLLECTION 2024",
            headline: "New Arrivals Are Here",
            button_link: "/collections/new",
            button_text: "Shop Now",
            gradient_start: "#DAD4EC",
            gradient_end: "#F3E7E9",
            text_color: "#181D25",
            button_color: "#F55266",
            height: "large",
          },
        },
        {
          id: "homepage_categories",
          type: "category-1",
          enabled: true,
          settings: {
            title: "Shop by Category",
            layout: "grid",
          },
          blocks: [
            {
              id: "cat_women",
              type: "category_card",
              settings: {
                title: "Women",
                image:
                  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
                url: "/collections/womens",
              },
            },
            {
              id: "cat_men",
              type: "category_card",
              settings: {
                title: "Men",
                image:
                  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
                url: "/collections/mens",
              },
            },
            {
              id: "cat_accessories",
              type: "category_card",
              settings: {
                title: "Accessories",
                image:
                  "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b",
                url: "/collections/accessories",
              },
            },
          ],
        },
        {
          id: "homepage_featured_products",
          type: "product-card-1",
          enabled: true,
          settings: {
            title: "Featured Products",
            subtitle: "Hand-picked items just for you",
            show_quick_view: true,
            show_wishlist: true,
            columns_desktop: 4,
            columns_mobile: 2,
          },
        },
        {
          id: "homepage_special_offers",
          type: "special-offers-slider-1",
          enabled: true,
          settings: {
            title: "Special Offers",
            autoplay: true,
            autoplay_speed: 3000,
          },
        },
        {
          id: "homepage_brands",
          type: "brands-1",
          enabled: true,
          settings: {
            title: "Our Brands",
            show_border: false,
          },
        },
        {
          id: "homepage_reviews",
          type: "reviews-1",
          enabled: true,
          settings: {
            title: "What Our Customers Say",
            show_rating: true,
            autoplay: true,
          },
        },
      ],
      seo: {
        title: "Zatiq Fashion Store - Latest Trends & Styles",
        description:
          "Shop the latest fashion trends with free shipping on orders over $100",
        image: "/og-image.jpg",
      },
    },

    // Product Page Template
    product: {
      name: "Product Detail",
      layout: "default",
      sections: [
        {
          id: "product_main",
          type: "product-detail",
          enabled: true,
          settings: {
            show_reviews: true,
            show_share: true,
            show_vendor: true,
            image_zoom: true,
          },
        },
        {
          id: "product_recommendations",
          type: "product-card-2",
          enabled: true,
          settings: {
            title: "You May Also Like",
            limit: 4,
          },
        },
      ],
    },

    // Collection Page Template
    collection: {
      name: "Collection",
      layout: "default",
      sections: [
        {
          id: "collection_header",
          type: "static-banner-1",
          enabled: true,
          settings: {
            height: "medium",
            overlay: true,
          },
        },
        {
          id: "collection_products",
          type: "product-card-1",
          enabled: true,
          settings: {
            show_filters: true,
            show_sorting: true,
            columns_desktop: 3,
            columns_mobile: 2,
            pagination_type: "load_more",
          },
        },
      ],
    },
  },

  designSystem: {
    colors: {
      primary: "#2563eb",
      secondary: "#1f2937",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#111827",
      error: "#ef4444",
      success: "#10b981",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: {
      small: "0.25rem",
      medium: "0.5rem",
      large: "1rem",
      full: "9999px",
    },
  },
};
