import type { Metadata } from "next";
import { getShopIdentifier } from "@/lib/utils/shop-identifier";
import { shopService } from "@/lib/api/services/shop.service";
import {
  getShopFaviconUrl,
  getShopTitle,
  getShopDescription,
} from "@/lib/utils/shop-helpers";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryLayoutProps): Promise<Metadata> {
  const { slug } = await params;

  // Get shop identifier
  const shopIdentifier = await getShopIdentifier();

  // Fetch shop profile
  let shopProfile = null;
  if (
    shopIdentifier.shop_id ||
    shopIdentifier.domain ||
    shopIdentifier.subdomain
  ) {
    try {
      shopProfile = await shopService.getProfile(shopIdentifier);
    } catch {
      // Fallback to default
    }
  }

  const shopName = shopProfile?.shop_name;

  // Try to find category name from categories
  let categoryName = "Category";
  if (shopProfile?.shop_uuid) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://easybill.zatiq.tech"}/api/v1/live/filtered_categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: shopProfile.shop_uuid }),
          cache: "force-cache",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const categories = data?.data || [];
        const foundCategory = categories.find(
          (cat: { id: string | number; name: string }) =>
            String(cat.id) === slug
        );
        if (foundCategory) {
          categoryName = foundCategory.name;
        }
      }
    } catch {
      // Use default category name
    }
  }

  const title = getShopTitle(shopName, categoryName);
  const description = getShopDescription(
    shopName,
    `Browse ${categoryName} products at ${shopName || "our store"}`
  );
  const faviconUrl = getShopFaviconUrl(
    shopProfile?.favicon_url,
    shopProfile?.image_url
  );

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}
