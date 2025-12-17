/**
 * Server-only product API functions
 */
import 'server-only';

import { serverFetch } from '../shared';
import type { Product, ProductsResponse, ProductFilters } from '../types';

/**
 * Get products with optional filtering
 */
export async function getProducts(
  params?: ProductFilters
): Promise<ProductsResponse> {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.perPage) queryParams.per_page = params.perPage.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString
      ? `/api/storefront/v1/products?${queryString}`
      : `/api/storefront/v1/products`;

    const data = await serverFetch<ProductsResponse>(endpoint, {
      revalidate: 60,
    });
    console.log('[API] Products loaded from API');
    return data;
  } catch {
    console.error('[API] Products API failed');
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 12,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

/**
 * Get single product by handle
 */
export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const product = await serverFetch<Product>(
      `/api/storefront/v1/products/${handle}`,
      { revalidate: 60 }
    );
    console.log(`[API] Product loaded: ${handle}`);
    return product;
  } catch {
    console.error(`[API] Product API failed: ${handle}`);
    return null;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const products = await serverFetch<Product[]>(
      `/api/storefront/v1/products/featured?limit=${limit}`,
      { revalidate: 300 }
    );
    console.log('[API] Featured products loaded from API');
    return products;
  } catch {
    console.error('[API] Featured products API failed');
    return [];
  }
}

/**
 * Search products (server-side)
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await serverFetch<Product[]>(
      `/api/storefront/v1/search?q=${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    );
    console.log(`[API] Search results loaded for: ${query}`);
    return products;
  } catch {
    console.error(`[API] Search API failed for: ${query}`);
    return [];
  }
}
