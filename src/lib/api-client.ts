/**
 * ========================================
 * API CLIENT UTILITIES
 * ========================================
 * 
 * Production এ এই functions real API call করবে
 * এখন static data return করছে
 */

import { mockTheme, mockShopConfig } from '../data/mock-theme';
import { mockProducts, mockCollections } from '../data/mock-products';
import type { ZatiqTheme, ShopConfig, Product, Collection } from './types';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'https://api.zatiq.com';

/**
 * Get shop configuration
 * 
 * Backend API: GET /api/storefront/v1/init
 */
export async function getShopConfig(shopId: string): Promise<ShopConfig> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/init?shopId=${shopId}`);
  // return response.json();
  
  return mockShopConfig;
}

/**
 * Get active theme
 * 
 * Backend API: GET /api/storefront/v1/theme
 */
export async function getTheme(shopId: string): Promise<ZatiqTheme> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/theme?shopId=${shopId}`);
  // return response.json();
  
  return mockTheme;
}

/**
 * Get page data
 * 
 * Backend API: GET /api/storefront/v1/page/:pageType
 */
export async function getPageData(pageType: string, shopId: string): Promise<any> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/page/${pageType}?shopId=${shopId}`);
  // return response.json();
  
  return {
    template: mockTheme.templates[pageType],
    pageData: {}
  };
}

/**
 * Get products
 * 
 * Backend API: GET /api/storefront/v1/products
 */
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  collection?: string;
  sort?: string;
}): Promise<Product[]> {
  // TODO: Replace with actual API call
  // const queryString = new URLSearchParams(params as any).toString();
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/products?${queryString}`);
  // return response.json();
  
  return mockProducts;
}

/**
 * Get single product
 * 
 * Backend API: GET /api/storefront/v1/products/:handle
 */
export async function getProduct(handle: string): Promise<Product | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/products/${handle}`);
  // return response.json();
  
  return mockProducts.find(p => p.handle === handle) || null;
}

/**
 * Get featured products
 * 
 * Backend API: GET /api/storefront/v1/products/featured
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/products/featured?limit=${limit}`);
  // return response.json();
  
  return mockProducts.slice(0, limit);
}

/**
 * Get collections
 * 
 * Backend API: GET /api/storefront/v1/collections
 */
export async function getCollections(): Promise<Collection[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/collections`);
  // return response.json();
  
  return mockCollections;
}

/**
 * Get single collection
 * 
 * Backend API: GET /api/storefront/v1/collections/:handle
 */
export async function getCollection(handle: string): Promise<Collection | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/collections/${handle}`);
  // return response.json();
  
  return mockCollections.find(c => c.handle === handle) || null;
}

/**
 * Search products
 * 
 * Backend API: GET /api/storefront/v1/search?q=:query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/search?q=${encodeURIComponent(query)}`);
  // return response.json();
  
  return mockProducts.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Get cart
 * 
 * Backend API: GET /api/storefront/v1/cart
 */
export async function getCart(): Promise<any> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/cart`, {
  //   headers: { 'X-Cart-Token': getCartToken() }
  // });
  // return response.json();
  
  return {
    items: [],
    itemCount: 0,
    subtotal: 0,
    total: 0
  };
}

/**
 * Add to cart
 * 
 * Backend API: POST /api/storefront/v1/cart/add
 */
export async function addToCart(variantId: string, quantity: number): Promise<any> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/cart/add`, {
  //   method: 'POST',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'X-Cart-Token': getCartToken() 
  //   },
  //   body: JSON.stringify({ variantId, quantity })
  // });
  // return response.json();
  
  return { success: true };
}

/**
 * Update cart item
 * 
 * Backend API: PUT /api/storefront/v1/cart/update
 */
export async function updateCartItem(lineItemId: string, quantity: number): Promise<any> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/cart/update`, {
  //   method: 'PUT',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'X-Cart-Token': getCartToken() 
  //   },
  //   body: JSON.stringify({ lineItemId, quantity })
  // });
  // return response.json();
  
  return { success: true };
}

/**
 * Remove from cart
 * 
 * Backend API: DELETE /api/storefront/v1/cart/remove
 */
export async function removeFromCart(lineItemId: string): Promise<any> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/api/storefront/v1/cart/remove`, {
  //   method: 'DELETE',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'X-Cart-Token': getCartToken() 
  //   },
  //   body: JSON.stringify({ lineItemId })
  // });
  // return response.json();
  
  return { success: true };
}
