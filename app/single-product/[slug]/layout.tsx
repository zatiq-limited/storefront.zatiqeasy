import type { Metadata } from "next";
import { headers } from "next/headers";
import { ShopProvider } from "@/app/providers/shop-provider";
import { cn } from "@/lib/utils";

interface LandingPageLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for landing pages
export async function generateMetadata({
  params,
}: LandingPageLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch landing page data for SEO
    const response = await fetch(
      `${baseUrl}/api/storefront/v1/landing/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return {
        title: "Landing Page",
        description: "Product landing page",
      };
    }

    const data = await response.json();
    const pageData = data.data;

    if (!pageData) {
      return {
        title: "Landing Page",
        description: "Product landing page",
      };
    }

    const title = pageData.page_title || pageData.inventory?.name || "Product";
    const description =
      pageData.page_description ||
      pageData.inventory?.description ||
      "Check out our product";
    const productImage = pageData.inventory?.image_url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: productImage
          ? [
              {
                url: productImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: productImage ? [productImage] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Landing Page",
      description: "Product landing page",
    };
  }
}

export default async function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Fetch shop details for the landing page
  let shopDetails = null;
  try {
    const response = await fetch(`${baseUrl}/api/storefront/shop`, {
      next: { revalidate: 60 },
    });
    if (response.ok) {
      const data = await response.json();
      shopDetails = data.data;
    }
  } catch (error) {
    console.error("Error fetching shop details:", error);
  }

  return (
    <ShopProvider initialShopData={shopDetails}>
      <div className={cn("min-h-screen bg-background")}>{children}</div>
    </ShopProvider>
  );
}
