import { shopService } from "./services/shop.service";

export type { ShopProfile, Product, Category } from "./types";

/**
 * @deprecated Use shopService.getCategories() instead
 */
export async function fetchShopCategories(params: {
  shop_uuid: string;
  ids?: string[];
}) {
  return shopService.getCategories(params);
}
