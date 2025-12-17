/**
 * Server-only theme API functions
 */
import 'server-only';

import { serverFetch, API_CONFIG } from '../shared';
import type { ZatiqTheme, ShopConfig } from '../types';

/**
 * Get shop configuration
 */
export async function getShopConfig(
  shopId: string = API_CONFIG.shopId
): Promise<ShopConfig | null> {
  try {
    const data = await serverFetch<{ shop: ShopConfig; session: unknown }>(
      `/api/storefront/v1/init?shopId=${shopId}`,
      { revalidate: 3600 } // Cache for 1 hour
    );
    console.log('[API] Shop config loaded from API');
    return data.shop;
  } catch {
    console.error('[API] Shop config API failed');
    return null;
  }
}

/**
 * Get active theme
 */
export async function getTheme(
  shopId: string = API_CONFIG.shopId
): Promise<ZatiqTheme | null> {
  try {
    console.log('[API] Calling theme endpoint...');
    const themeData = await serverFetch<ZatiqTheme>(
      `/api/storefront/v1/theme?shopId=${shopId}`,
      { revalidate: 300 } // Cache for 5 minutes
    );
    console.log('[API] Theme loaded from API');
    return themeData;
  } catch {
    console.error('[API] Theme API failed - trying local file');

    // Fallback to local JSON file for development
    try {
      const localFile = await import('@/data/api-responses/theme.json');
      console.log('[API] Theme loaded from local file');
      const imported = localFile.default || localFile;
      return (imported?.data || imported) as unknown as ZatiqTheme;
    } catch (localError) {
      console.error('[API] Local theme.json also failed:', localError);
      return null;
    }
  }
}
