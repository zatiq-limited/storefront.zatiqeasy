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

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

// Server Component that renders the client component
export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  return <ProductDetailsClient handle={handle} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  // TODO: Fetch product data on server to generate proper metadata
  // For now, return generic metadata
  return {
    title: `Product ${handle} | Zatiq Store`,
    description: `Buy ${handle} online at Zatiq Store`,
  };
}
