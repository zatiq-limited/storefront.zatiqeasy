/**
 * Shop Identifier Client Utilities
 * Client-side only functions for shop identification
 */

export interface ShopIdentifier {
  shop_id?: string;
  subdomain?: string;
  domain?: string;
}

/**
 * Get the best identifier value from ShopIdentifier
 * Priority: shop_id > subdomain > domain
 */
export function getIdentifierValue(identifier: ShopIdentifier): string | undefined {
  if (identifier.shop_id) {
    return identifier.shop_id;
  }
  if (identifier.subdomain) {
    return identifier.subdomain;
  }
  if (identifier.domain) {
    return identifier.domain;
  }
  return undefined;
}

/**
 * Get the best identifier for API calls
 * Priority: shop_id > subdomain > domain > shop_uuid
 */
export function getBestIdentifier(
  shopId?: string | number,
  subdomain?: string,
  domain?: string,
  shopUuid?: string
): string | undefined {
  if (shopId) {
    return String(shopId);
  }
  if (subdomain) {
    return subdomain;
  }
  if (domain) {
    return domain;
  }
  if (shopUuid) {
    return shopUuid;
  }
  return undefined;
}

/**
 * Client-side shop identifier (uses window.location)
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
    const devShopId = process.env.NEXT_PUBLIC_DEV_SHOP_ID;
    if (devShopId) {
      return { shop_id: devShopId };
    }
    return {};
  }

  // Otherwise, treat as custom domain
  return { domain: host };
}
