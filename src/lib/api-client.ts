/**
 * ========================================
 * API CLIENT UTILITIES
 * ========================================
 *
 * Production এ এই functions real API call করবে
 * এখন static data return করছে
 *
 * Backend Integration:
 * 1. .env file এ PUBLIC_API_URL set করুন
 * 2. USE_MOCK_DATA=false set করুন real API use করার জন্য
 * 3. Backend developer কে API_DOCUMENTATION.md share করুন
 */

import { mockTheme, mockShopConfig } from "../data/mock-theme";
import { mockProducts, mockCollections } from "../data/mock-products";
import type { ZatiqTheme, ShopConfig, Product, Collection } from "./types";

// Environment Configuration
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
const SHOP_ID = import.meta.env.PUBLIC_SHOP_ID || "shop_demo_12345";
const API_KEY = import.meta.env.PUBLIC_API_KEY || "";
const USE_MOCK_DATA = import.meta.env.PUBLIC_USE_MOCK_DATA === "true"; // Default: false (use real API)

/**
 * Custom API Error Class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic API Call Helper
 * Handles authentication, error handling, and response parsing
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "X-Shop-Id": SHOP_ID,
    "Content-Type": "application/json",
  };

  // Add API key if available
  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  // Merge with options headers
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    console.log(`[API] Calling: ${endpoint}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    const result = await response.json();

    // Backend should return: { success: true, data: {...} }
    if (!result.success) {
      throw new APIError(
        result.message || "API request failed",
        undefined,
        endpoint
      );
    }

    console.log(`[API] Success: ${endpoint}`);
    return result.data;
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`[API Error] ${error.endpoint}:`, error.message);
      throw error;
    }

    console.error(`[Network Error] ${endpoint}:`, error);
    throw new APIError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      undefined,
      endpoint
    );
  }
}

/**
 * Get shop configuration
 *
 * Backend API: GET /api/storefront/v1/init
 * Response: { success: true, data: { shop: ShopConfig, session: {...} } }
 */
export async function getShopConfig(
  shopId: string = SHOP_ID
): Promise<ShopConfig> {
  if (USE_MOCK_DATA) {
    console.log("[Mock] Using mock shop config");
    return mockShopConfig;
  }

  try {
    const data = await apiCall<{ shop: ShopConfig; session: any }>(
      `/api/storefront/v1/init?shopId=${shopId}`
    );
    return data.shop;
  } catch (error) {
    console.warn("Failed to fetch shop config, falling back to mock data");
    return mockShopConfig;
  }
}

/**
 * Get active theme
 *
 * Backend API: GET /api/storefront/v1/theme
 * Response: { success: true, data: ZatiqTheme }
 */
export async function getTheme(shopId: string = SHOP_ID): Promise<ZatiqTheme> {
  if (USE_MOCK_DATA) {
    console.log("[Mock] Using mock theme");
    return mockTheme;
  }

  try {
    return await apiCall<ZatiqTheme>(
      `/api/storefront/v1/theme?shopId=${shopId}`
    );
  } catch (error) {
    console.warn("Failed to fetch theme, falling back to mock data");
    return mockTheme;
  }
}

/**
 * Get homepage data
 *
 * Backend API: GET /api/storefront/v1/page/home
 * Response: { success: true, data: { template, sections, seo } }
 */
export async function getHomepageData(): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Using mock homepage data`);
    return {
      template: "index",
      sections: mockTheme.templates.index.sections,
      seo: mockTheme.templates.index.seo,
    };
  }

  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/home`);
    return response;
  } catch (error) {
    console.warn(`Failed to fetch homepage data, using mock data`);
    return {
      template: "index",
      sections: mockTheme.templates.index.sections,
      seo: mockTheme.templates.index.seo,
    };
  }
}

/**
 * Get page data
 *
 * Backend API: GET /api/storefront/v1/page/:pageType
 * Response: { success: true, data: { template: Template, pageData: {...} } }
 */
export async function getPageData(
  pageType: "index" | "product" | "collection" | "cart",
  shopId: string = SHOP_ID
): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Using mock data for page: ${pageType}`);
    return {
      template: mockTheme.templates[pageType],
      pageData: {},
    };
  }

  try {
    return await apiCall(
      `/api/storefront/v1/page/${pageType}?shopId=${shopId}`
    );
  } catch (error) {
    console.warn(`Failed to fetch page data for ${pageType}, using mock data`);
    return {
      template: mockTheme.templates[pageType],
      pageData: {},
    };
  }
}

/**
 * Get products
 *
 * Backend API: GET /api/storefront/v1/products
 * Response: { success: true, data: { products: Product[], pagination: {...} } }
 */
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  collection?: string;
  sort?: string;
}): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    console.log("[Mock] Using mock products");
    return mockProducts;
  }

  try {
    const queryString = new URLSearchParams(params as any).toString();
    const data = await apiCall<{ products: Product[]; pagination: any }>(
      `/api/storefront/v1/products?${queryString}`
    );
    return data.products;
  } catch (error) {
    console.warn("Failed to fetch products, falling back to mock data");
    return mockProducts;
  }
}

/**
 * Get single product
 *
 * Backend API: GET /api/storefront/v1/products/:handle
 * Response: { success: true, data: Product }
 */
export async function getProduct(handle: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Using mock data for product: ${handle}`);
    return mockProducts.find((p) => p.handle === handle) || null;
  }

  try {
    return await apiCall<Product>(`/api/storefront/v1/products/${handle}`);
  } catch (error) {
    console.warn(
      `Failed to fetch product ${handle}, falling back to mock data`
    );
    return mockProducts.find((p) => p.handle === handle) || null;
  }
}

/**
 * Get featured products
 *
 * Backend API: GET /api/storefront/v1/products/featured
 * Response: { success: true, data: Product[] }
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Using mock featured products (limit: ${limit})`);
    return mockProducts.slice(0, limit);
  }

  try {
    return await apiCall<Product[]>(
      `/api/storefront/v1/products/featured?limit=${limit}`
    );
  } catch (error) {
    console.warn(
      "Failed to fetch featured products, falling back to mock data"
    );
    return mockProducts.slice(0, limit);
  }
}

/**
 * Get collections
 *
 * Backend API: GET /api/storefront/v1/collections
 * Response: { success: true, data: Collection[] }
 */
export async function getCollections(): Promise<Collection[]> {
  if (USE_MOCK_DATA) {
    console.log("[Mock] Using mock collections");
    return mockCollections;
  }

  try {
    return await apiCall<Collection[]>("/api/storefront/v1/collections");
  } catch (error) {
    console.warn("Failed to fetch collections, falling back to mock data");
    return mockCollections;
  }
}

/**
 * Get single collection
 *
 * Backend API: GET /api/storefront/v1/collections/:handle
 * Response: { success: true, data: { collection: Collection, products: Product[] } }
 */
export async function getCollection(
  handle: string
): Promise<Collection | null> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Using mock data for collection: ${handle}`);
    return mockCollections.find((c) => c.handle === handle) || null;
  }

  try {
    const data = await apiCall<{ collection: Collection; products: Product[] }>(
      `/api/storefront/v1/collections/${handle}`
    );
    return data.collection;
  } catch (error) {
    console.warn(
      `Failed to fetch collection ${handle}, falling back to mock data`
    );
    return mockCollections.find((c) => c.handle === handle) || null;
  }
}

/**
 * Search products
 *
 * Backend API: GET /api/storefront/v1/search?q=:query
 * Response: { success: true, data: Product[] }
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Searching products for: ${query}`);
    return mockProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    return await apiCall<Product[]>(
      `/api/storefront/v1/search?q=${encodeURIComponent(query)}`
    );
  } catch (error) {
    console.warn("Search failed, falling back to local search");
    return mockProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

/**
 * Cart Token Management
 */
function getCartToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("cart_token") || "";
}

function setCartToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart_token", token);
}

/**
 * Get cart
 *
 * Backend API: GET /api/storefront/v1/cart
 * Response: { success: true, data: { id, items, itemCount, total } }
 */
export async function getCart(): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log("[Mock] Using empty cart");
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      total: 0,
    };
  }

  try {
    const cartToken = getCartToken();
    if (!cartToken) {
      // Create new cart if no token exists
      return await createCart();
    }

    return await apiCall("/api/storefront/v1/cart", {
      headers: { "X-Cart-Token": cartToken },
    });
  } catch (error) {
    console.warn("Failed to fetch cart");
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      total: 0,
    };
  }
}

/**
 * Create new cart
 *
 * Backend API: POST /api/storefront/v1/cart
 * Response: { success: true, data: { id, token, items: [] } }
 */
export async function createCart(): Promise<any> {
  try {
    const cart: any = await apiCall("/api/storefront/v1/cart", {
      method: "POST",
    });

    if (cart.token) {
      setCartToken(cart.token);
    }

    return cart;
  } catch (error) {
    console.error("Failed to create cart");
    throw error;
  }
}

/**
 * Add to cart
 *
 * Backend API: POST /api/storefront/v1/cart/add
 * Response: { success: true, data: { cart: {...} } }
 */
export async function addToCart(
  variantId: string,
  quantity: number
): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Adding to cart: ${variantId} x ${quantity}`);
    return { success: true };
  }

  try {
    const cartToken = getCartToken();
    return await apiCall("/api/storefront/v1/cart/add", {
      method: "POST",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ variantId, quantity }),
    });
  } catch (error) {
    console.error("Failed to add to cart");
    throw error;
  }
}

/**
 * Update cart item
 *
 * Backend API: PUT /api/storefront/v1/cart/update
 * Response: { success: true, data: { cart: {...} } }
 */
export async function updateCartItem(
  lineItemId: string,
  quantity: number
): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Updating cart item: ${lineItemId} to ${quantity}`);
    return { success: true };
  }

  try {
    const cartToken = getCartToken();
    return await apiCall("/api/storefront/v1/cart/update", {
      method: "PUT",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ lineItemId, quantity }),
    });
  } catch (error) {
    console.error("Failed to update cart item");
    throw error;
  }
}

/**
 * Remove from cart
 *
 * Backend API: DELETE /api/storefront/v1/cart/remove
 * Response: { success: true, data: { cart: {...} } }
 */
export async function removeFromCart(lineItemId: string): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`[Mock] Removing from cart: ${lineItemId}`);
    return { success: true };
  }

  try {
    const cartToken = getCartToken();
    return await apiCall("/api/storefront/v1/cart/remove", {
      method: "DELETE",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ lineItemId }),
    });
  } catch (error) {
    console.error("Failed to remove from cart");
    throw error;
  }
}

/**
 * Debug function to log current API configuration
 */
export function logAPIConfig(): void {
  console.log("=== API Configuration ===");
  console.log("Base URL:", API_BASE_URL);
  console.log("Shop ID:", SHOP_ID);
  console.log("Has API Key:", !!API_KEY);
  console.log("Using Mock Data:", USE_MOCK_DATA);
  console.log("========================");
}
