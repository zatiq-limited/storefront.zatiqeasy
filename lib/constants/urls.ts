/**
 * URL Constants
 * Centralized route paths and API endpoints
 */

/**
 * Application route paths
 */
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  COLLECTIONS: "/collections",
  COLLECTION_DETAIL: (slug: string) => `/collections/${slug}`,
  CHECKOUT: "/checkout",
  RECEIPT: (id: string) => `/receipt/${id}`,
  ABOUT_US: "/about-us",
  PRIVACY_POLICY: "/privacy-policy",
  RETURN_POLICY: "/return-policy",
} as const;

/**
 * API endpoints (internal Next.js API routes)
 */
export const API_ROUTES = {
  THEME: "/api/storefront/v1/theme",
  PRODUCTS: "/api/storefront/v1/products",
  PRODUCT_DETAIL: (handle: string) => `/api/storefront/v1/products/${handle}`,
  COLLECTIONS: "/api/storefront/v1/collections",
  COLLECTION_DETAIL: (slug: string) => `/api/storefront/v1/collections/${slug}`,
  PAGE_HOME: "/api/storefront/v1/page/home",
  PAGE_PRODUCTS: "/api/storefront/v1/page/products",
  PAGE_PRODUCT_DETAILS: "/api/storefront/v1/page/product-details",
  PAGE_ABOUT_US: "/api/storefront/v1/page/about-us",
  ORDER_CREATE: "/api/orders/create",
  ORDER_RECEIPT: (receiptId: string) => `/api/orders/${receiptId}`,
} as const;

/**
 * Placeholder images
 */
export const PLACEHOLDER_IMAGES = {
  PRODUCT: "/placeholder-product.png",
  PRODUCT_SVG: "/placeholder-product.svg",
  AVATAR: "/placeholder-avatar.png",
  BANNER: "/placeholder-banner.png",
} as const;

/**
 * External URLs
 */
export const EXTERNAL_URLS = {
  ZATIQ_WEBSITE: "https://zatiq.com",
  ZATIQ_EASY: "https://zatiqeasy.com",
} as const;
