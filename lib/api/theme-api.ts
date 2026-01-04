/**
 * Theme API Service
 * Fetches theme data from Theme Builder API
 *
 * API Endpoints:
 *   POST /api/v1/live/theme                    - Get theme data (global settings, sections)
 *   POST /api/v1/live/theme/page/{pageType}    - Get specific page data
 */

import { apiClient } from "./client";

// ============================================
// Constants
// ============================================

const DEFAULT_SHOP_ID = process.env.NEXT_PUBLIC_DEV_SHOP_ID || "2";

// ============================================
// Types
// ============================================

export type ThemePageName =
  | "home"
  | "products"
  | "productDetails"
  | "collections"
  | "collectionDetails"
  | "about"
  | "contact"
  | "privacyPolicy"
  | "checkout";

export interface BlockData {
  id: string;
  type: string;
  settings: Record<string, unknown>;
}

export interface SectionData {
  id: string;
  type: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks: BlockData[];
}

export interface GlobalSectionItem {
  enabled: boolean;
  type: string;
  settings: Record<string, unknown>;
  blocks?: BlockData[];
}

export interface GlobalSectionsData {
  announcement?: GlobalSectionItem;
  header?: GlobalSectionItem;
  footer?: GlobalSectionItem;
}

export interface GlobalSettingsData {
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    text: string;
    error?: string;
    success?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  border_radius?: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  component_styles?: Record<string, unknown>;
}

export interface PageData {
  page_type: string;
  name: string;
  slug: string | null;
  is_enabled: boolean;
  sections: SectionData[];
  seo: {
    title?: string;
    description?: string;
  } | null;
}

interface ThemeApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  legacy_theme?: boolean;
}

interface PageDataResponse {
  success?: boolean;
  data?: PageData;
  legacy_theme?: boolean;
}

interface LiveThemeRequest {
  shop_id?: number | string;
  subdomain?: string;
  domain?: string;
}

interface LiveThemeResponse {
  success: boolean;
  message: string;
  legacy_theme?: boolean;
  data?: {
    global_settings: GlobalSettingsData;
    global_sections: GlobalSectionsData;
    templates: Record<string, string>;
  };
}

// ============================================
// Helper Functions
// ============================================

function createEmptyPageResponse(pageName: ThemePageName): PageDataResponse {
  return {
    success: true,
    data: {
      page_type: pageName,
      name: pageName,
      slug: null,
      is_enabled: false,
      sections: [],
      seo: null,
    },
  };
}

// ============================================
// Theme API
// ============================================

/**
 * Get theme data (global settings, sections)
 * POST /api/v1/live/theme
 */
export async function getLiveTheme(params: LiveThemeRequest): Promise<{
  success: boolean;
  message?: string;
  legacy_theme?: boolean;
  data?: LiveThemeResponse["data"];
}> {
  const apiEndpoint = "/api/v1/live/theme";

  try {
    const { data } = await apiClient.post<LiveThemeResponse>(
      apiEndpoint,
      params
    );

    // Custom Theme - success: true with data
    if (data.success && data.data) {
      return {
        success: true,
        legacy_theme: false,
        data: data.data,
      };
    }

    // Legacy Theme - success: false with legacy_theme: true
    if (data.legacy_theme === true) {
      return {
        success: false,
        message: data.message,
        legacy_theme: true,
      };
    }

    // Shop not found or other error
    return {
      success: false,
      message: data.message,
      legacy_theme: false,
    };
  } catch (error) {
    console.error("[ThemeAPI] getLiveTheme error:", error);
    return {
      success: false,
      message: "Failed to fetch theme",
      legacy_theme: true,
    };
  }
}

// ============================================
// Page API
// ============================================

/**
 * Get a specific page's data
 * POST /api/v1/live/theme/page/{pageType}
 */
async function getPageData(
  pageName: ThemePageName,
  shopId?: string
): Promise<PageDataResponse | null> {
  const id = shopId || DEFAULT_SHOP_ID;
  const apiEndpoint = `/api/v1/live/theme/page/${pageName}`;

  try {
    const { data } = await apiClient.post<
      | { data: ThemeApiResponse<PageData> }
      | ThemeApiResponse<PageData>
      | PageData
    >(apiEndpoint, { shop_id: id });

    // Handle different response structures
    let result: ThemeApiResponse<PageData> | PageData | null = null;

    if (data && typeof data === "object" && "data" in data) {
      const wrappedData = (data as { data: ThemeApiResponse<PageData> }).data;
      if (wrappedData && typeof wrappedData === "object") {
        if ("sections" in wrappedData) {
          result = wrappedData as unknown as PageData;
        } else {
          result = wrappedData as ThemeApiResponse<PageData>;
        }
      }
    } else if (data && typeof data === "object" && "sections" in data) {
      result = data as PageData;
    } else {
      result = data as ThemeApiResponse<PageData>;
    }

    // Check if shop uses legacy theme
    if (result && "legacy_theme" in result && result.legacy_theme) {
      return { legacy_theme: true };
    }

    // Result is PageData directly
    if (result && "sections" in result) {
      return { success: true, data: result as PageData };
    }

    // Result is ThemeApiResponse with data
    if (result && "data" in result && result.data) {
      return { success: true, data: result.data };
    }

    return createEmptyPageResponse(pageName);
  } catch (error) {
    console.error(`[ThemeAPI] getPageData(${pageName}) error:`, error);
    return createEmptyPageResponse(pageName);
  }
}

/** Get home page data */
export async function getHomePage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("home", shopId);
}

/** Get products page data */
export async function getProductsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("products", shopId);
}

/** Get product details page data */
export async function getProductDetailsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("productDetails", shopId);
}

/** Get collections page data */
export async function getCollectionsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("collections", shopId);
}

/** Get collection details page data */
export async function getCollectionDetailsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("collectionDetails", shopId);
}

/** Get about page data */
export async function getAboutPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("about", shopId);
}

/** Get contact page data */
export async function getContactPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("contact", shopId);
}
