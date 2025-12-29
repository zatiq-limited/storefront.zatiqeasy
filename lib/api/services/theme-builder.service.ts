/**
 * Theme Builder API Service
 * Fetches theme builder data from JSON Server (dev) or real API (prod)
 */

import LZString from 'lz-string';

// Theme API URL - JSON Server in dev, real API in prod
const THEME_API_URL = process.env.NEXT_PUBLIC_THEME_API_URL || 'http://localhost:4321/api';

/**
 * Raw theme data from API (compressed)
 */
export interface ThemeBuilderRawData {
  shopId: string;
  name: string;
  is_active: boolean;
  last_published: string;
  editor_state: string; // Compressed LZ-String data
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Decompressed editor state structure
 */
export interface ThemeBuilderEditorState {
  themeName: string;
  globalSettings: {
    fontFamily?: string;
    headingFontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    [key: string]: unknown;
  };
  globalSections: {
    header?: unknown;
    footer?: unknown;
    announcement?: unknown;
    [key: string]: unknown;
  };
  pageComponents: Record<string, unknown[]>;
  landingPages: Record<string, unknown>;
  footerComponent: unknown | null;
}

/**
 * Full theme builder data (decompressed)
 */
export interface ThemeBuilderData {
  shopId: string;
  name: string;
  is_active: boolean;
  last_published: string;
  editorState: ThemeBuilderEditorState | null;
  raw?: ThemeBuilderRawData;
}

/**
 * Decompress LZ-String compressed data
 */
function decompressEditorState(compressed: string): ThemeBuilderEditorState | null {
  try {
    const jsonString = LZString.decompressFromUTF16(compressed);
    if (!jsonString) {
      console.warn('[ThemeBuilder] Failed to decompress - empty result');
      return null;
    }
    return JSON.parse(jsonString) as ThemeBuilderEditorState;
  } catch (error) {
    console.error('[ThemeBuilder] Decompression error:', error);
    return null;
  }
}

export const themeBuilderService = {
  /**
   * Fetch theme builder data for a shop
   * @param shopId - The shop ID to fetch theme for
   * @returns Theme builder data or null if not found
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
        // Don't cache - always get latest
        cache: 'no-store',
      });

      if (response.status === 404) {
        console.log('[ThemeBuilder] No theme found for shop:', shopId);
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData: ThemeBuilderRawData = await response.json();
      
      console.log('[ThemeBuilder] Raw data received:', {
        shopId: rawData.shopId,
        name: rawData.name,
        is_active: rawData.is_active,
        last_published: rawData.last_published,
        editor_state_length: rawData.editor_state?.length || 0,
      });

      // Decompress the editor state
      const editorState = rawData.editor_state 
        ? decompressEditorState(rawData.editor_state)
        : null;

      if (editorState) {
        console.log('[ThemeBuilder] Decompressed editor state:', {
          themeName: editorState.themeName,
          pagesCount: Object.keys(editorState.pageComponents || {}).length,
          hasGlobalSettings: !!editorState.globalSettings,
          hasFooter: !!editorState.footerComponent,
        });
      }

      return {
        shopId: rawData.shopId,
        name: rawData.name,
        is_active: rawData.is_active,
        last_published: rawData.last_published,
        editorState,
        raw: rawData,
      };
    } catch (error) {
      console.error('[ThemeBuilder] Fetch error:', error);
      return null;
    }
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
