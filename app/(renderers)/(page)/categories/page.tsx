/**
 * ========================================
 * CATEGORIES PAGE
 * ========================================
 *
 * Categories listing page showing all product categories
 * Uses React Query for caching and Zustand for state management
 */

import type { Metadata } from "next";
import CategoriesClient from "./categories-client";

// Static metadata for categories listing page
// Note: Shop name is added via template in root layout
export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all product categories. Find the best deals on high-quality items with fast delivery.",
  openGraph: {
    title: "All Categories",
    description:
      "Browse all product categories. Find the best deals on high-quality items with fast delivery.",
    type: "website",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
