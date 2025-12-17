/**
 * ========================================
 * SEARCH PAGE
 * ========================================
 */

import { searchProducts } from "@/api/server";
import { SearchPageClient } from "./SearchPageClient";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const products = query ? await searchProducts(query) : [];

  return (
    <main className="zatiq-search-page">
      <SearchPageClient query={query} products={products} />
    </main>
  );
}

export const metadata = {
  title: "Search | Zatiq Store",
  description: "Search products",
};
