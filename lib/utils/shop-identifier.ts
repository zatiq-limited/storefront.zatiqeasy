/**
 * Shop Identifier Utility
 * Determines shop identification method based on hostname
 */

import { headers } from "next/headers";

export interface ShopIdentifier {
  shop_id?: string;
  subdomain?: string;
  domain?: string;
}

/**
 * Get shop identifier from request headers (server-side)
 * Checks hostname to determine if it's a subdomain, custom domain, or shop ID route
 */
export async function getShopIdentifier(
  shopId?: string
): Promise<ShopIdentifier> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // If shopId is provided (from /merchant/[shopId] route), use it
  if (shopId) {
    return { shop_id: shopId };
  }

  // Check if it's a subdomain (e.g., techyboy.sellbd.shop)
  const isSubdomain =
    host.includes(".zatiqeasy.com") ||
    host.includes(".zatiq.app") ||
    host.includes(".bdsite.net") ||
    host.includes(".myecom.site") ||
    host.includes(".sellbd.shop") ||
    host.includes(".sell-bazar.com");

  if (isSubdomain) {
    return { subdomain: host };
  }

  // Check if it's localhost or a custom domain
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    // For development: use default shop ID from env if available
    // This allows testing on localhost without /merchant/[shopId] route
    const devShopId = process.env.NEXT_PUBLIC_DEV_SHOP_ID;
    if (devShopId) {
      return { shop_id: devShopId };
    }
    return {};
  }

  // Otherwise, treat as custom domain (e.g., tofa.com.bd)
  return { domain: host };
}

