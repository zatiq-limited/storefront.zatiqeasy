/**
 * Theme API Service
 * Fetches theme data from Theme Builder API (now public/unauthenticated)
 *
 * API Structure (Public - No Auth Required):
 *   GET /api/v1/custom-themes/full        - Full theme with global settings + sections + pages
 *   GET /api/v1/custom-themes/pages/{type} - Specific page data
 *
 * Reference: theme-builder-documentation.md
 */

// API Base URL - same as merchant panel
const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/live` ||
  "https://easybill.zatiq.tech/api/v1/live";
const DEFAULT_SHOP_ID = process.env.NEXT_PUBLIC_DEV_SHOP_ID || "2";

// Valid page names matching backend's PageType enum
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

/**
 * Raw API response structure from Theme Builder API
 */
interface ThemeApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  legacy_theme?: boolean;
}

interface BlockData {
  id: string;
  type: string;
  settings: Record<string, unknown>;
}

interface SectionData {
  id: string;
  type: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks: BlockData[];
}

interface GlobalSectionItem {
  enabled: boolean;
  type: string;
  settings: Record<string, unknown>;
  blocks?: BlockData[];
}

interface GlobalSectionsData {
  announcement?: GlobalSectionItem;
  header?: GlobalSectionItem;
  footer?: GlobalSectionItem;
}

interface GlobalSettingsData {
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

interface PageData {
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

interface ThemeData {
  id: number;
  shop_id: number;
  name: string;
  version: string;
  global_settings: GlobalSettingsData;
  global_sections: GlobalSectionsData;
  templates: Record<string, string>;
  pages?: PageData[];
  created_at: string;
  updated_at: string;
}

interface FullThemeData extends ThemeData {
  pages: PageData[];
}

// ============================================
// Response Types
// ============================================

interface CoreData {
  success?: boolean;
  data?: ThemeData;
  legacy_theme?: boolean;
}

interface PageDataResponse {
  success?: boolean;
  data?: PageData;
  legacy_theme?: boolean;
}

// ============================================
// Core Theme Data (header, footer, global settings)
// ============================================

/**
 * Get theme data (global settings, announcement, header, footer, pages)
 * GET /api/v1/custom-themes/full?shop_id={id}
 */
export async function getTheme(shopId?: string): Promise<CoreData | null> {
  const id = shopId || DEFAULT_SHOP_ID;
  const url = `${API_BASE_URL}/custom-themes/full?shop_id=${id}`;

  console.log(`[ThemeAPI] Fetching theme for shop ${id} from ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Device-Type": "Web",
        "Application-Type": "Storefront",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      console.log(`[ThemeAPI] Shop ${id} not found`);
      return null;
    }

    if (!response.ok) {
      console.error(
        `[ThemeAPI] HTTP ${response.status}: ${response.statusText}`
      );
      return null;
    }

    const result: ThemeApiResponse<ThemeData> = await response.json();

    // Check if shop uses legacy theme
    if (result.legacy_theme) {
      console.log(`[ThemeAPI] Shop ${id} uses legacy theme`);
      return { legacy_theme: true };
    }

    if (!result.success || !result.data) {
      console.log("[ThemeAPI] API returned unsuccessful response");
      return null;
    }

    console.log(`[ThemeAPI] Successfully fetched theme for shop ${id}`);
    return result;
  } catch (error) {
    console.error("[ThemeAPI] Fetch error:", error);
    return null;
  }
}

/**
 * Get global settings from theme data
 */
export async function getGlobalSettings(
  shopId?: string
): Promise<GlobalSettingsData | null> {
  const theme = await getTheme(shopId);
  return theme?.data?.global_settings || null;
}

/**
 * Get global sections (announcement, header, footer)
 */
export async function getGlobalSections(
  shopId?: string
): Promise<GlobalSectionsData | null> {
  const theme = await getTheme(shopId);
  return theme?.data?.global_sections || null;
}

// ============================================
// Page Data (home, products, about, etc.)
// ============================================

/**
 * Get a specific page's data
 * GET /api/v1/custom-themes/pages/{pageType}?shop_id={id}
 */
async function getPageData(
  pageName: ThemePageName,
  shopId?: string
): Promise<PageDataResponse | null> {
  const id = shopId || DEFAULT_SHOP_ID;
  const url = `${API_BASE_URL}/custom-themes/pages/${pageName}?shop_id=${id}`;

  console.log(
    `[ThemeAPI] Fetching ${pageName} page for shop ${id} from ${url}`
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Device-Type": "Web",
        "Application-Type": "Storefront",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      console.log(`[ThemeAPI] ${pageName} page not found for shop ${id}`);
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

    if (!response.ok) {
      console.error(
        `[ThemeAPI] HTTP ${response.status}: ${response.statusText}`
      );
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

    const result: ThemeApiResponse<PageData> = await response.json();

    // Check if shop uses legacy theme
    if (result.legacy_theme) {
      console.log(`[ThemeAPI] Shop ${id} uses legacy theme`);
      return { legacy_theme: true };
    }

    if (!result.success || !result.data) {
      console.log(`[ThemeAPI] No data returned for ${pageName}`);
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

    console.log(
      `[ThemeAPI] Found ${pageName} page with ${
        result.data.sections?.length || 0
      } sections`
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error(`[ThemeAPI] Fetch error for ${pageName}:`, error);
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
}

/**
 * Get home page data
 */
export async function getHomePage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("home", shopId);
}

/**
 * Get products page data
 */
export async function getProductsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("products", shopId);
}

/**
 * Get product details page data
 */
export async function getProductDetailsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("productDetails", shopId);
}

/**
 * Get collections page data
 */
export async function getCollectionsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("collections", shopId);
}

/**
 * Get collection details page data
 */
export async function getCollectionDetailsPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("collectionDetails", shopId);
}

/**
 * Get about page data
 */
export async function getAboutPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("about", shopId);
}

/**
 * Get contact page data
 */
export async function getContactPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("contact", shopId);
}

/**
 * Get privacy policy page data
 */
export async function getPrivacyPolicyPage(
  shopId?: string
): Promise<PageDataResponse | null> {
  return getPageData("privacyPolicy", shopId);
}

/**
 * Check if theme exists for a shop
 */
export async function hasTheme(shopId?: string): Promise<boolean> {
  const theme = await getTheme(shopId);
  return theme !== null && !theme.legacy_theme;
}

// Export default object for convenience
const themeApi = {
  getTheme,
  getGlobalSettings,
  getGlobalSections,
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

export default themeApi;

// Export types for use in other files
export type {
  BlockData,
  SectionData,
  GlobalSectionItem,
  GlobalSectionsData,
  GlobalSettingsData,
  PageData,
  ThemeData,
  FullThemeData,
};
