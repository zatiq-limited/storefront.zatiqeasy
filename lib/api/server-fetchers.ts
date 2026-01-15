/**
 * Server-Side Data Fetchers
 * These functions are designed to be called from Server Components
 * They fetch data during SSR to reduce client-side delays
 */

import { getHomePage, PageData } from "./theme-api";
import { getShopIdentifier, ShopIdentifier } from "@/lib/utils/shop-identifier";
import { getShopProfileCached } from "./services/shop.service";

export interface HomepageSSRData {
  homepage: PageData | null;
  shopId: string | null;
  isLegacyTheme: boolean;
}

/**
 * Fetch homepage data server-side
 * This runs during SSR to include data in initial HTML
 */
export async function fetchHomepageSSR(): Promise<HomepageSSRData> {
  try {
    // Get shop identifier from request headers
    const shopIdentifier: ShopIdentifier = await getShopIdentifier();

    // Get shop profile to check legacy_theme and get shop ID
    let shopId: string | null = null;
    let isLegacyTheme = true;

    if (shopIdentifier.shop_id || shopIdentifier.domain || shopIdentifier.subdomain) {
      try {
        const shopProfile = await getShopProfileCached(shopIdentifier);
        if (shopProfile) {
          shopId = String(shopProfile.id);
          isLegacyTheme = shopProfile.legacy_theme ?? true;
        }
      } catch (error) {
        console.error("[SSR] Failed to fetch shop profile:", error);
      }
    }

    // If legacy theme, don't fetch homepage data (static themes handle their own data)
    if (isLegacyTheme) {
      return {
        homepage: null,
        shopId,
        isLegacyTheme: true,
      };
    }

    // Fetch homepage data for theme builder
    if (shopId) {
      try {
        const homepageResponse = await getHomePage(shopId);
        if (homepageResponse?.data) {
          return {
            homepage: homepageResponse.data,
            shopId,
            isLegacyTheme: false,
          };
        }
      } catch (error) {
        console.error("[SSR] Failed to fetch homepage:", error);
      }
    }

    return {
      homepage: null,
      shopId,
      isLegacyTheme,
    };
  } catch (error) {
    console.error("[SSR] fetchHomepageSSR error:", error);
    return {
      homepage: null,
      shopId: null,
      isLegacyTheme: true,
    };
  }
}
