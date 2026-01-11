/**
 * ========================================
 * COLLECTIONS PAGE
 * ========================================
 *
 * Collections listing page showing all product collections/categories
 * Uses React Query for caching
 */

import type { Metadata } from "next";
import CollectionsClient from "./collections-client";

// Static metadata for collections listing page
// Note: Shop name is added via template in root layout
export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore our curated collections of products. Shop by category and find exactly what you need.",
  openGraph: {
    title: "Collections",
    description:
      "Explore our curated collections of products. Shop by category and find exactly what you need.",
    type: "website",
  },
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
