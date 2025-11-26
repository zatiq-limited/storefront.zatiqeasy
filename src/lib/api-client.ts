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
): Promise<ShopConfig | null> {
  try {
    const data = await apiCall<{ shop: ShopConfig; session: any }>(
      `/api/storefront/v1/init?shopId=${shopId}`
    );
    console.log("[API] ✅ Shop config loaded from API");
    return data.shop;
  } catch (error) {
    console.error("[API] ❌ Shop config API failed");
    return null;
  }
}

/**
 * Get active theme
 *
 * Backend API: GET /api/storefront/v1/theme
 * Response: { success: true, data: ZatiqTheme }
 */
export async function getTheme(shopId: string = SHOP_ID): Promise<any> {
  // Only call API - backend returns theme.json structure
  // Backend must send: { globalSections: { announcement, header, footer }, templates, componentStyles }
  try {
    console.log("[API] Calling theme endpoint...");
    const themeData = await apiCall<any>(
      `/api/storefront/v1/theme?shopId=${shopId}`
    );
    console.log("[API] ✅ Theme loaded from API");

    // Backend sends theme.json structure directly - no transformation needed
    return themeData;
  } catch (error) {
    console.error("[API] ❌ Theme API failed - no data will be shown");
    return null;
  }
}

/**
 * Get homepage data
 *
 * Backend API: GET /api/storefront/v1/page/home
 * Response: { success: true, data: { template, sections, seo } }
 */
export async function getHomepageData(): Promise<any> {
  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/home`);
    console.log("[API] ✅ Homepage data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ Homepage API failed");
    return null;
  }
}

/**
 * Get products page data (sections + products)
 *
 * Backend API: GET /api/storefront/v1/page/products
 * Response: { success: true, data: { template, sections, products, pagination, seo } }
 */
export async function getProductsPageData(params?: {
  page?: number;
  category?: string;
  sort?: string;
  search?: string;
}): Promise<any> {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString
      ? `/api/storefront/v1/page/products?${queryString}`
      : `/api/storefront/v1/page/products`;

    const response = await apiCall<any>(endpoint);
    console.log("[API] ✅ Products page data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ Products page API failed");
    return null;
  }
}

/**
 * Get checkout page data (sections + order + payment methods)
 *
 * Backend API: GET /api/storefront/v1/page/checkout
 * Response: { success: true, data: { template, sections, order, delivery_options, payment_methods, currency, seo } }
 */
export async function getCheckoutPageData(): Promise<any> {
  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/checkout`);
    console.log("[API] ✅ Checkout page data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ Checkout page API failed");
    return null;
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
  try {
    const data = await apiCall(
      `/api/storefront/v1/page/${pageType}?shopId=${shopId}`
    );
    console.log(`[API] ✅ Page data loaded for ${pageType}`);
    return data;
  } catch (error) {
    console.error(`[API] ❌ Page API failed for ${pageType}`);
    return null;
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
  per_page?: number;
  category?: string;
  collection?: string;
  sort?: string;
  search?: string;
}): Promise<any> {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.per_page) queryParams.per_page = params.per_page.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString
      ? `/api/storefront/v1/products?${queryString}`
      : `/api/storefront/v1/products`;

    const data = await apiCall<any>(endpoint);
    console.log("[API] ✅ Products loaded from API");
    return data;
  } catch (error) {
    console.error("[API] ❌ Products API failed");
    return { products: [], pagination: null };
  }
}

/**
 * Get single product
 *
 * Backend API: GET /api/storefront/v1/products/:handle
 * Response: { success: true, data: Product }
 */
export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const product = await apiCall<Product>(
      `/api/storefront/v1/products/${handle}`
    );
    console.log(`[API] ✅ Product loaded: ${handle}`);
    return product;
  } catch (error) {
    console.error(`[API] ❌ Product API failed: ${handle}`);
    return null;
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
  try {
    const products = await apiCall<Product[]>(
      `/api/storefront/v1/products/featured?limit=${limit}`
    );
    console.log("[API] ✅ Featured products loaded from API");
    return products;
  } catch (error) {
    console.error("[API] ❌ Featured products API failed");
    return [];
  }
}

/**
 * Get collections page data (sections + collections)
 *
 * Backend API: GET /api/storefront/v1/page/collections
 * Response: { success: true, data: { template, sections, collections, seo } }
 */
export async function getCollectionsPageData(): Promise<any> {
  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/collections`);
    console.log("[API] ✅ Collections page data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ Collections page API failed");
    return null;
  }
}

/**
 * Get about page data
 *
 * Backend API: GET /api/storefront/v1/page/about
 * Response: { success: true, data: { template, sections, seo } }
 */
export async function getAboutPageData(): Promise<any> {
  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/about`);
    console.log("[API] ✅ About page data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ About page API failed");
    return null;
  }
}

/**
 * Get contact page data
 *
 * Backend API: GET /api/storefront/v1/page/contact
 * Response: { success: true, data: { template, sections, seo } }
 */
export async function getContactPageData(): Promise<any> {
  try {
    const response = await apiCall<any>(`/api/storefront/v1/page/contact`);
    console.log("[API] ✅ Contact page data loaded from API");
    return response;
  } catch (error) {
    console.error("[API] ❌ Contact page API failed");
    return null;
  }
}

/**
 * Get collections
 *
 * Backend API: GET /api/storefront/v1/collections
 * Response: { success: true, data: Collection[] }
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await apiCall<Collection[]>(
      "/api/storefront/v1/collections"
    );
    console.log("[API] ✅ Collections loaded from API");
    return collections;
  } catch (error) {
    console.error("[API] ❌ Collections API failed");
    return [];
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
  try {
    const data = await apiCall<{ collection: Collection; products: Product[] }>(
      `/api/storefront/v1/collections/${handle}`
    );
    console.log(`[API] ✅ Collection loaded: ${handle}`);
    return data.collection;
  } catch (error) {
    console.error(`[API] ❌ Collection API failed: ${handle}`);
    return null;
  }
}

/**
 * Get single collection with products
 *
 * Backend API: GET /api/storefront/v1/collections/:handle
 * Response: { success: true, data: { collection: Collection, products: Product[] } }
 */
export async function getCollectionWithProducts(
  handle: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  try {
    const data = await apiCall<{ collection: Collection; products: Product[] }>(
      `/api/storefront/v1/collections/${handle}`
    );
    console.log(`[API] ✅ Collection with products loaded: ${handle}`);
    return data;
  } catch (error) {
    console.error(`[API] ❌ Collection API failed: ${handle}`);
    return null;
  }
}

/**
 * Search products
 *
 * Backend API: GET /api/storefront/v1/search?q=:query
 * Response: { success: true, data: Product[] }
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await apiCall<Product[]>(
      `/api/storefront/v1/search?q=${encodeURIComponent(query)}`
    );
    console.log(`[API] ✅ Search results loaded for: ${query}`);
    return products;
  } catch (error) {
    console.error(`[API] ❌ Search API failed for: ${query}`);
    return [];
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
  try {
    const cartToken = getCartToken();
    if (!cartToken) {
      return await createCart();
    }

    const cart = await apiCall("/api/storefront/v1/cart", {
      headers: { "X-Cart-Token": cartToken },
    });
    console.log("[API] ✅ Cart loaded from API");
    return cart;
  } catch (error) {
    console.error("[API] ❌ Cart API failed");
    return null;
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
  try {
    const cartToken = getCartToken();
    const result = await apiCall("/api/storefront/v1/cart/add", {
      method: "POST",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ variantId, quantity }),
    });
    console.log(`[API] ✅ Added to cart: ${variantId}`);
    return result;
  } catch (error) {
    console.error("[API] ❌ Failed to add to cart");
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
  try {
    const cartToken = getCartToken();
    const result = await apiCall("/api/storefront/v1/cart/update", {
      method: "PUT",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ lineItemId, quantity }),
    });
    console.log(`[API] ✅ Cart item updated: ${lineItemId}`);
    return result;
  } catch (error) {
    console.error("[API] ❌ Failed to update cart item");
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
  try {
    const cartToken = getCartToken();
    const result = await apiCall("/api/storefront/v1/cart/remove", {
      method: "DELETE",
      headers: { "X-Cart-Token": cartToken },
      body: JSON.stringify({ lineItemId }),
    });
    console.log(`[API] ✅ Cart item removed: ${lineItemId}`);
    return result;
  } catch (error) {
    console.error("[API] ❌ Failed to remove from cart");
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
