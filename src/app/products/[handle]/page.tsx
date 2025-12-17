/**
 * ========================================
 * PRODUCT DETAIL PAGE
 * ========================================
 *
 * Single product page with details, reviews, and related products
 */

import { notFound } from "next/navigation";
import { getSingleProductPageData } from "@/api/server";
import ProductDetailsPageRenderer from "@/components/ProductDetailsPageRenderer";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const pageData = await getSingleProductPageData(handle);

  if (!pageData) {
    notFound();
  }

  return (
    <ProductDetailsPageRenderer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections={(pageData?.sections || []) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product={(pageData?.product || {}) as any}
    />
  );
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const pageData = await getSingleProductPageData(handle);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = pageData?.product as any;

  return {
    title: `${product?.name || product?.title || "Product"} | Zatiq Store`,
    description: product?.description || "Product details",
  };
}
