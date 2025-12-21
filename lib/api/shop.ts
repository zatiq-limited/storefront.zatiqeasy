import { apiClient } from '../configs/api.config';
import { encryptData, decryptData } from '../payments/encryption';

export interface ShopProfile {
  id: string | number;
  shop_uuid: string;
  shop_name: string;
  shop_description?: string;
  image_url?: string;
  currency_code?: string;
  country_currency?: string;
  shop_email?: string;
  shop_phone?: string;
  message_on_top?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  shop_theme?: {
    theme: string;
    enable_buy_now_on_product_card?: boolean;
    singleProductTheme?: boolean;
  };
  metadata?: {
    settings?: {
      shop_settings?: {
        enable_product_image_download?: boolean;
      };
    };
  };
  pixel_id?: string;
  gtm_id?: string;
  tiktok_pixel_id?: string;
  hasPixelAccess?: boolean;
  hasGTMAccess?: boolean;
  hasTikTokPixelAccess?: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  old_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  quantity: number;
  category_id?: string;
  category_name?: string;
  sku?: string;
  has_variant?: boolean;
  variant_types?: any[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: number | string | null;
  sub_categories?: Category[];
}

/**
 * Fetch shop profile data
 */
export async function fetchShopProfile(params: {
  shop_id?: string | number;
  domain?: string;
  subdomain?: string;
}): Promise<ShopProfile | null> {
  try {
    const { data } = await apiClient.post<{ data: ShopProfile }>(
      `/api/v1/live/profile`,
      JSON.stringify(params)
    );

    if (data?.data?.id) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching shop profile:', error);
    return null;
  }
}

/**
 * Fetch shop products/inventories
 * Uses encryption for payload (matching old project implementation)
 */
export async function fetchShopInventories(params: {
  shop_uuid: string;
  ids?: string[];
}): Promise<Product[] | null> {
  try {
    const endPoint = `/api/v1/live/inventories${
      params.ids ? `?filter[id]=${params.ids?.join(",")}` : ""
    }`;

    // Encrypt the payload object (matching old project: { identifier: shop_uuid })
    const encryptedPayload = encryptData({ identifier: params.shop_uuid });

    // Send as object - axios will stringify automatically
    const res = await apiClient.post<any>(endPoint, {
      payload: encryptedPayload,
    });

    console.log('[API] Raw response:', res.data);

    // Decrypt the response (matching old project)
    if (res.data) {
      try {
        const decryptedData = decryptData(res.data);
        console.log('[API] Decrypted data:', decryptedData);
        // Check if data exists in decrypted response
        if (decryptedData?.data) {
          return decryptedData.data;
        }
        return null;
      } catch (decryptError) {
        // If decryption fails, try direct response (for non-encrypted APIs)
        console.log('[API] Response not encrypted, using direct data');
        if (res.data?.data) {
          return res.data.data;
        }
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('[API] Error fetching shop inventories:', error);
    return null;
  }
}

/**
 * Fetch shop categories
 * Note: Categories API does NOT use encryption (matching old project)
 */
export async function fetchShopCategories(params: {
  shop_uuid: string;
  ids?: string[];
}): Promise<Category[] | null> {
  try {
    const { data } = await apiClient.post<{ data: Category[] }>(
      `/api/v1/live/filtered_categories${
        params.ids ? `?filter[id]=${params.ids?.join(",")}` : ""
      }`,
      JSON.stringify({ identifier: params.shop_uuid })
    );

    if (data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching shop categories:', error);
    return null;
  }
}