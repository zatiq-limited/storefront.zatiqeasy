/**
 * ========================================
 * PRODUCTS PAGE
 * ========================================
 *
 * Products listing page with filtering, sorting, and pagination
 * Uses React Query for caching and Zustand for state management
 */

import type { Metadata } from "next";
import ProductsClient from "./products-client";

// Static metadata for products listing page
export const metadata: Metadata = {
  title: "All Products | ZatiqEasy",
  description:
    "Browse our complete collection of products. Find the best deals on high-quality items with fast delivery.",
  openGraph: {
    title: "All Products | ZatiqEasy",
    description:
      "Browse our complete collection of products. Find the best deals on high-quality items with fast delivery.",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
