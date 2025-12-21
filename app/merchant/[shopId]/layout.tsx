import type { Metadata } from "next";
import { fetchShopProfile } from "@/lib/api/shop";
import { ThemeHandler } from "@/app/lib/theme-handler";
import { ShopProvider } from "@/app/providers/shop-provider";

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

  // Fetch real shop data
  const shopProfile = await fetchShopProfile({
    shop_id: shopId,
  });

  const shopName = shopProfile?.shop_name || `Shop ${shopId}`;

  return {
    title: `${shopName} | Zatiq Store`,
    description: `Visit ${shopName} online store for amazing products`,
    keywords: ["online shop", "ecommerce", shopName, "zatiq"],
    openGraph: {
      title: `${shopName} | Zatiq Store`,
      description: `Visit ${shopName} online store for amazing products`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/merchant/${shopId}`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${shopName} - Zatiq Store`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${shopName} | Zatiq Store`,
      description: `Visit ${shopName} online store for amazing products`,
      images: ["/og-image.jpg"],
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

  // Fetch shop profile for the shop provider
  const shopProfile = await fetchShopProfile({
    shop_id: shopId,
  });

  return (
    <ShopProvider initialShopData={shopProfile}>
      <ThemeHandler>{children}</ThemeHandler>
    </ShopProvider>
  );
}
