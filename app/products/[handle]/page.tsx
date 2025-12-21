/**
 * ========================================
 * PRODUCT DETAILS PAGE
 * ========================================
 *
 * Single product page with dynamic sections
 * Uses React Query for caching and Zustand for state management
 * Includes generateMetadata for SEO optimization
 */

import type { Metadata } from "next";
import ProductDetailsClient from "./product-details-client";

// Server-side fetch for metadata
async function getProduct(handle: string) {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/storefront/v1/products/${handle}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.data.product : null;
  } catch {
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: "Product Not Found | ZatiqEasy",
      description: "The requested product could not be found.",
    };
  }

  const title = product.theme?.page_title || `${product.name} | ZatiqEasy`;
  const description =
    product.theme?.page_description ||
    product.short_description ||
    product.description ||
    `Shop ${product.name} at the best price. High quality products with fast delivery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.image_url
        ? [
            {
              url: product.image_url,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

// Server Component that renders the client component
export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  return <ProductDetailsClient handle={handle} />;
}
