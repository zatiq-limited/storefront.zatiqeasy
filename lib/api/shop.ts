/**
 * @deprecated Use shopService from '@/lib/api' instead
 * This file is kept for backward compatibility
 *
 * Migration:
 * import { fetchShopProfile } from '@/lib/api/shop'
 * → import { shopService } from '@/lib/api'
 * → shopService.getProfile(params)
 */

import { shopService } from "./services/shop.service";

export type { ShopProfile, Product, Category } from "./types";

/**
 * @deprecated Use shopService.getProfile() instead
 */
export async function fetchShopProfile(params: {
  shop_id?: string | number;
  domain?: string;
  subdomain?: string;
}) {
  return shopService.getProfile(params);
}

/**
 * @deprecated Use shopService.getProducts() instead
 */
export async function fetchShopInventories(params: {
  shop_uuid: string;
  ids?: string[];
}) {
  return shopService.getProducts(params);
}

/**
 * @deprecated Use shopService.getCategories() instead
 */
export async function fetchShopCategories(params: {
  shop_uuid: string;
  ids?: string[];
}) {
  return shopService.getCategories(params);
}
