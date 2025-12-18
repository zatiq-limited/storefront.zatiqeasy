// API endpoint definitions for Zatiq storefront

export const API_ENDPOINTS = {
  // Theme Builder endpoints
  THEME: {
    GET: (shopId: string) => `/storefront/v1/theme/${shopId}`,
    UPDATE: (shopId: string) => `/storefront/v1/theme/${shopId}`,
    PREVIEW: (shopId: string) => `/storefront/v1/theme/${shopId}/preview`,
  },

  // Homepage endpoints
  HOMEPAGE: {
    GET: (shopId: string) => `/storefront/v1/homepage/${shopId}`,
    UPDATE: (shopId: string) => `/storefront/v1/homepage/${shopId}`,
    SECTIONS: (shopId: string) => `/storefront/v1/homepage/${shopId}/sections`,
  },

  // Shop endpoints
  SHOP: {
    PROFILE: (shopId: string) => `/storefront/v1/shop/${shopId}`,
    SETTINGS: (shopId: string) => `/storefront/v1/shop/${shopId}/settings`,
    ANALYTICS: (shopId: string) => `/storefront/v1/shop/${shopId}/analytics`,
  },

  // Products endpoints
  PRODUCTS: {
    LIST: (shopId: string) => `/storefront/v1/products/${shopId}`,
    DETAIL: (shopId: string, productHandle: string) => `/storefront/v1/products/${shopId}/${productHandle}`,
    SEARCH: (shopId: string) => `/storefront/v1/products/${shopId}/search`,
    CATEGORIES: (shopId: string) => `/storefront/v1/products/${shopId}/categories`,
    VARIANTS: (shopId: string, productId: string) => `/storefront/v1/products/${shopId}/${productId}/variants`,
  },

  // Cart endpoints
  CART: {
    GET: (shopId: string) => `/storefront/v1/cart/${shopId}`,
    ADD: (shopId: string) => `/storefront/v1/cart/${shopId}/add`,
    UPDATE: (shopId: string, cartId: string) => `/storefront/v1/cart/${shopId}/${cartId}`,
    REMOVE: (shopId: string, cartId: string) => `/storefront/v1/cart/${shopId}/${cartId}`,
    CLEAR: (shopId: string) => `/storefront/v1/cart/${shopId}/clear`,
  },

  // Checkout endpoints
  CHECKOUT: {
    CREATE: (shopId: string) => `/storefront/v1/checkout/${shopId}`,
    CALCULATE_SHIPPING: (shopId: string) => `/storefront/v1/checkout/${shopId}/shipping`,
    VALIDATE_PROMO: (shopId: string) => `/storefront/v1/checkout/${shopId}/promo`,
    PAYMENT: (shopId: string) => `/storefront/v1/checkout/${shopId}/payment`,
  },

  // Order endpoints
  ORDERS: {
    CREATE: (shopId: string) => `/storefront/v1/orders/${shopId}`,
    DETAIL: (shopId: string, orderId: string) => `/storefront/v1/orders/${shopId}/${orderId}`,
    TRACK: (shopId: string, orderId: string) => `/storefront/v1/orders/${shopId}/${orderId}/track`,
    LIST: (shopId: string) => `/storefront/v1/orders/${shopId}`,
  },

  // Pages endpoints
  PAGES: {
    ABOUT_US: (shopId: string) => `/storefront/v1/pages/${shopId}/about-us`,
    PRIVACY_POLICY: (shopId: string) => `/storefront/v1/pages/${shopId}/privacy-policy`,
    TERMS: (shopId: string) => `/storefront/v1/pages/${shopId}/terms`,
    RETURN_POLICY: (shopId: string) => `/storefront/v1/pages/${shopId}/return-policy`,
    CONTACT: (shopId: string) => `/storefront/v1/pages/${shopId}/contact`,
  },

  // Landing pages endpoints
  LANDING_PAGES: {
    LIST: (shopId: string) => `/storefront/v1/landing-pages/${shopId}`,
    DETAIL: (slug: string) => `/storefront/v1/landing-pages/public/${slug}`,
    CREATE: (shopId: string) => `/storefront/v1/landing-pages/${shopId}`,
    UPDATE: (shopId: string, pageId: string) => `/storefront/v1/landing-pages/${shopId}/${pageId}`,
  },

  // Analytics endpoints
  ANALYTICS: {
    PIXEL_CONFIG: (shopId: string) => `/storefront/v1/analytics/${shopId}/pixels`,
    EVENTS: (shopId: string) => `/storefront/v1/analytics/${shopId}/events`,
    CONVERSIONS: (shopId: string) => `/storefront/v1/analytics/${shopId}/conversions`,
  },

  // Location endpoints (Bangladesh specific)
  LOCATION: {
    DIVISIONS: '/location/divisions',
    DISTRICTS: (divisionId: number) => `/location/divisions/${divisionId}/districts`,
    UPAZILAS: (districtId: number) => `/location/districts/${districtId}/upazilas`,
  },

  // Payment gateway endpoints
  PAYMENT: {
    BKASH_INIT: (shopId: string) => `/payment/bkash/${shopId}/init`,
    BKASH_VERIFY: (shopId: string) => `/payment/bkash/${shopId}/verify`,
    AAMARPAY_INIT: (shopId: string) => `/payment/aamarpay/${shopId}/init`,
    AAMARPAY_VERIFY: (shopId: string) => `/payment/aamarpay/${shopId}/verify`,
    COD_PROCESS: (shopId: string) => `/payment/cod/${shopId}/process`,
    SELF_MFS_PROCESS: (shopId: string) => `/payment/self-mfs/${shopId}/process`,
    ZATIQ_SELLER_PAY_PROCESS: (shopId: string) => `/payment/zatiq-seller-pay/${shopId}/process`,
  },
} as const;

// Export specific endpoint types for better TypeScript support
export type ThemeEndpoints = typeof API_ENDPOINTS.THEME;
export type ProductEndpoints = typeof API_ENDPOINTS.PRODUCTS;
export type CartEndpoints = typeof API_ENDPOINTS.CART;
export type CheckoutEndpoints = typeof API_ENDPOINTS.CHECKOUT;
export type OrderEndpoints = typeof API_ENDPOINTS.ORDERS;