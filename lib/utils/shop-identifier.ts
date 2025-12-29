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
    // For localhost without shop ID, return empty (should redirect to /merchant/[shopId])
    return {};
  }

  // Otherwise, treat as custom domain (e.g., tofa.com.bd)
  return { domain: host };
}

/**
 * Client-side version (uses window.location)
 */
export function getShopIdentifierClient(shopId?: string): ShopIdentifier {
  if (typeof window === "undefined") {
    return {};
  }

  const host = window.location.host;

  // If shopId is provided, use it
  if (shopId) {
    return { shop_id: shopId };
  }

  // Check if it's a subdomain
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

  // Check if it's localhost
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return {};
  }

  // Otherwise, treat as custom domain
  return { domain: host };
}
