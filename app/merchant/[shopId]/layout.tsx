import type { Metadata } from "next";
import { shopService } from "@/lib/api/services/shop.service";
import { ShopProvider } from "@/app/providers/shop-provider";
import { BreadcrumbWrapper } from "@/app/_themes/_components/breadcrumb-wrapper";
import { ThemeRouter } from "@/components/theme-router";
import ThemeLayout from "@/app/_layouts/theme/layout";
import { getShopFaviconUrl, getShopOgImageUrl } from "@/lib/utils/shop-helpers";

interface MerchantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    shopId: string;
  }>;
}

export async function generateMetadata({
  params,
}: MerchantLayoutProps): Promise<Metadata> {
  const { shopId } = await params;

  // Fetch real shop data using service directly (server-side)
  const shopProfile = await shopService.getProfile({
    shop_id: shopId,
  });

  const shopName = shopProfile?.shop_name || `Shop ${shopId}`;
  const faviconUrl = getShopFaviconUrl(
    shopProfile?.favicon_url,
    shopProfile?.image_url
  );
  const ogImageUrl = getShopOgImageUrl(shopProfile?.image_url);

  return {
    title: {
      default: shopName,
      template: `%s | ${shopName}`,
    },
    description: `Visit ${shopName} online store for amazing products`,
    keywords: ["online shop", "ecommerce", shopName, "zatiq"],
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: shopName,
      description: `Visit ${shopName} online store for amazing products`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/merchant/${shopId}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: shopName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shopName,
      description: `Visit ${shopName} online store for amazing products`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/merchant/${shopId}`,
    },
  };
}

export default async function MerchantLayout({
  children,
  params,
}: MerchantLayoutProps) {
  const { shopId } = await params;

  // Fetch shop profile for the shop provider (server-side)
  const shopProfile = await shopService.getProfile({
    shop_id: shopId,
  });

  const isLegacyTheme = shopProfile?.legacy_theme ?? true;

  // Add baseUrl for merchant routes
  const shopProfileWithBaseUrl = shopProfile
    ? {
        ...shopProfile,
        baseUrl: `/merchant/${shopId}`,
      }
    : null;

  return (
    <ShopProvider initialShopData={shopProfileWithBaseUrl}>
      {isLegacyTheme ? (
        // Legacy mode: ThemeRouter handles ConditionalThemeHandler wrapping
        // BreadcrumbWrapper is rendered separately (shown for non-homepage pages)
        <>
          <BreadcrumbWrapper />
          <ThemeRouter>{children}</ThemeRouter>
        </>
      ) : (
        // Theme Builder mode: Use ThemeRouter with ThemeLayout
        <ThemeRouter>
          <ThemeLayout>{children}</ThemeLayout>
        </ThemeRouter>
      )}
    </ShopProvider>
  );
}
