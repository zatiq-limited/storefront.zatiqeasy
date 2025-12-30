/**
 * Theme API Service
 * Fetches theme data from Theme API Server and decompresses LZ-string data
 * 
 * API Structure (V3 Page-based):
 *   GET /api/theme/core/:shopId       - Core (design system, header, footer)
 *   GET /api/theme/home/:shopId       - Home page
 *   GET /api/theme/products/:shopId   - Products page
 *   GET /api/theme/about/:shopId      - About page
 *   etc.
 * 
 * Data format from API:
 * {
 *   shopId: string,
 *   name: string,
 *   data: string,  // LZ-compressed page data
 *   last_updated: string
 * }
 */

import LZString from 'lz-string';

// Configuration
const THEME_API_URL = process.env.THEME_API_URL || process.env.NEXT_PUBLIC_THEME_API_URL || 'http://localhost:4321/api';
const DEFAULT_SHOP_ID = process.env.SHOP_ID || process.env.NEXT_PUBLIC_SHOP_ID || '47366';

// Valid page names (matching server.js VALID_PAGES)
export type ThemePageName = 
  | 'core' 
  | 'home' 
  | 'products' 
  | 'productDetails' 
  | 'collections' 
  | 'collectionDetails' 
  | 'about' 
  | 'contact' 
  | 'privacyPolicy' 
  | 'cart' 
  | 'checkout';

/**
 * Raw API response structure
 */
interface PageDataResponse {
  id?: string;
  shopId: string;
  name: string;
  data: string; // LZ-compressed
  last_updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Decompress LZ-string data
 */
function decompressData<T = unknown>(compressed: string): T | null {
  try {
    const jsonString = LZString.decompressFromUTF16(compressed);
    if (!jsonString) {
      console.warn('[ThemeAPI] Failed to decompress data - empty result');
      return null;
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('[ThemeAPI] Decompression error:', error);
    return null;
  }
}

/**
 * Fetch a page from the Theme API
 */
async function fetchPage(pageName: ThemePageName, shopId?: string): Promise<PageDataResponse | null> {
  const id = shopId || DEFAULT_SHOP_ID;
  const url = `${THEME_API_URL}/theme/${pageName}/${id}`;
  
  console.log(`[ThemeAPI] Fetching ${pageName} for shop ${id} from ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (response.status === 404) {
      console.log(`[ThemeAPI] ${pageName} not found for shop ${id}`);
      return null;
    }

    if (!response.ok) {
      console.error(`[ThemeAPI] HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[ThemeAPI] Successfully fetched ${pageName}`);
    return data;
  } catch (error) {
    console.error(`[ThemeAPI] Fetch error for ${pageName}:`, error);
    return null;
  }
}

/**
 * Fetch and decompress a page
 */
async function fetchAndDecompressPage<T = unknown>(pageName: ThemePageName, shopId?: string): Promise<T | null> {
  const pageData = await fetchPage(pageName, shopId);
  
  if (!pageData?.data) {
    return null;
  }
  
  return decompressData<T>(pageData.data);
}

// ============================================
// Core Theme Data (header, footer, design system)
// ============================================

interface CoreData {
  editorState?: unknown;
  theme?: {
    success?: boolean;
    data?: {
      id?: string;
      version?: string;
      global_settings?: Record<string, unknown>;
      global_sections?: {
        announcement?: Record<string, unknown>;
        header?: Record<string, unknown>;
        footer?: Record<string, unknown>;
      };
      templates?: Record<string, string>;
    };
  };
}

/**
 * Get theme data (global sections: announcement, header, footer)
 * Returns data in the same format as theme.json
 */
export async function getTheme(shopId?: string) {
  const coreData = await fetchAndDecompressPage<CoreData>('core', shopId);
  
  if (!coreData?.theme) {
    console.log('[ThemeAPI] No theme data found, returning null');
    return null;
  }
  
  // Return the theme data directly (already in correct format)
  return coreData.theme;
}

// ============================================
// Page Data (home, products, about, etc.)
// ============================================

interface PageData {
  success?: boolean;
  data?: {
    template?: string;
    sections?: Array<{
      id: string;
      type: string;
      enabled: boolean;
      settings?: Record<string, unknown>;
      blocks?: unknown[];
    }>;
    seo?: Record<string, unknown>;
  };
}

/**
 * Get home page data
 * Returns data in the same format as homepage.json
 */
export async function getHomePage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('home', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No home page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get products page data
 * Returns data in the same format as products-page.json
 */
export async function getProductsPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('products', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No products page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get product details page data
 */
export async function getProductDetailsPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('productDetails', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No product details page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get collections page data
 */
export async function getCollectionsPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('collections', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No collections page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get collection details page data
 */
export async function getCollectionDetailsPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('collectionDetails', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No collection details page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get about page data
 * Returns data in the same format as about-us.json
 */
export async function getAboutPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('about', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No about page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get contact page data
 */
export async function getContactPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('contact', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No contact page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Get privacy policy page data
 */
export async function getPrivacyPolicyPage(shopId?: string) {
  const pageData = await fetchAndDecompressPage<PageData>('privacyPolicy', shopId);
  
  if (!pageData) {
    console.log('[ThemeAPI] No privacy policy page data found');
    return null;
  }
  
  return pageData;
}

/**
 * Check if theme exists for a shop
 */
export async function hasTheme(shopId?: string): Promise<boolean> {
  const pageData = await fetchPage('core', shopId);
  return pageData !== null;
}

// Export default object for convenience
export default {
  getTheme,
  getHomePage,
  getProductsPage,
  getProductDetailsPage,
  getCollectionsPage,
  getCollectionDetailsPage,
  getAboutPage,
  getContactPage,
  getPrivacyPolicyPage,
  hasTheme,
};
