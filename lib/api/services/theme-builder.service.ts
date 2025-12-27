/**
 * Theme Builder API Service
 * Fetches theme builder data from JSON Server (dev) or real API (prod)
 * 
 * Data Structure from API:
 * {
 *   shopId: string,
 *   name: string,
 *   is_active: boolean,
 *   last_published: string,
 *   editor_state: string,          // Compressed raw state (for theme builder editing)
 *   theme: { ... },                // Transformed theme.json format (header, footer, settings)
 *   pages: {                       // Transformed page JSONs (same format as homepage.json)
 *     home: { success: true, data: { template, sections, seo } },
 *     products: { ... },
 *     ...
 *   }
 * }
 */

// Theme API URL - JSON Server in dev, real API in prod
const THEME_API_URL = process.env.NEXT_PUBLIC_THEME_API_URL || 'http://localhost:4321/api';

// ============================================
// Types - Matches storefront data structures
// ============================================

/**
 * Section block structure (matches homepage.json blocks)
 */
export interface SectionBlock {
  wrapper?: string;
  type?: string;
  class?: string;
  style?: Record<string, unknown>;
  id?: string;
  data?: Record<string, unknown>;
  blocks?: SectionBlock[];
  [key: string]: unknown;
}

/**
 * Page section structure (matches homepage.json sections)
 */
export interface PageSection {
  id: string;
  type: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks?: SectionBlock[];
}

/**
 * Transformed page data (same format as homepage.json)
 */
export interface TransformedPage {
  success: boolean;
  data: {
    template: string;
    sections: PageSection[];
    seo?: {
      title?: string;
      description?: string;
      [key: string]: unknown;
    };
  };
}

/**
 * Global section structure (header, footer, announcement)
 */
export interface GlobalSection {
  enabled: boolean;
  type: string;
  settings: Record<string, unknown>;
  blocks?: SectionBlock[];
}

/**
 * Transformed theme data (same format as theme.json)
 */
export interface TransformedTheme {
  success: boolean;
  data: {
    design_system: {
      colors?: Record<string, unknown>;
      typography?: Record<string, unknown>;
      spacing?: Record<string, unknown>;
      border_radius?: Record<string, unknown>;
      component_styles?: Record<string, unknown>;
    };
    global_sections: {
      announcement?: GlobalSection;
      header?: GlobalSection;
      footer?: GlobalSection;
    };
    templates: Record<string, string>;
  };
}

/**
 * Full API response structure
 */
export interface ThemeBuilderAPIResponse {
  id: number;
  shopId: string;
  name: string;
  is_active: boolean;
  last_published: string;
  editor_state?: string; // Compressed - only needed for theme builder editing
  theme?: TransformedTheme;
  pages?: {
    // Standard pages (matching PageType in merchant panel)
    home?: TransformedPage;
    products?: TransformedPage;
    productDetails?: TransformedPage;
    collections?: TransformedPage;
    collectionDetails?: TransformedPage;
    about?: TransformedPage;
    contact?: TransformedPage;
    privacyPolicy?: TransformedPage;
    cart?: TransformedPage;
    checkout?: TransformedPage;
    // Allow for additional page types (landing pages, etc.)
    [key: string]: TransformedPage | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Simplified data returned to components
 */
export interface ThemeBuilderData {
  shopId: string;
  name: string;
  is_active: boolean;
  last_published: string;
  theme: TransformedTheme | null;
  pages: ThemeBuilderAPIResponse['pages'] | null;
}

// ============================================
// Service
// ============================================

export const themeBuilderService = {
  /**
   * Fetch full theme builder data for a shop
   * Returns transformed theme and pages ready for rendering
   */
  async getTheme(shopId: string | number): Promise<ThemeBuilderData | null> {
    const url = `${THEME_API_URL}/themes/${shopId}`;
    
    console.log('[ThemeBuilder] Fetching from:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (response.status === 404) {
        console.log('[ThemeBuilder] No theme found for shop:', shopId);
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiData: ThemeBuilderAPIResponse = await response.json();
      
      console.log('[ThemeBuilder] Data received:', {
        shopId: apiData.shopId,
        name: apiData.name,
        hasTheme: !!apiData.theme,
        pages: apiData.pages ? Object.keys(apiData.pages) : [],
      });

      return {
        shopId: apiData.shopId,
        name: apiData.name,
        is_active: apiData.is_active,
        last_published: apiData.last_published,
        theme: apiData.theme || null,
        pages: apiData.pages || null,
      };
    } catch (error) {
      console.error('[ThemeBuilder] Fetch error:', error);
      return null;
    }
  },

  /**
   * Get home page data
   */
  async getHomePage(shopId: string | number): Promise<TransformedPage | null> {
    const data = await this.getTheme(shopId);
    return data?.pages?.home || null;
  },

  /**
   * Get theme global sections (header, footer, announcement)
   */
  async getThemeGlobals(shopId: string | number): Promise<TransformedTheme | null> {
    const data = await this.getTheme(shopId);
    return data?.theme || null;
  },

  /**
   * Check if a theme exists for a shop
   */
  async hasTheme(shopId: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${THEME_API_URL}/themes/${shopId}`, {
        method: 'GET',
        cache: 'no-store',
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default themeBuilderService;
