/**
 * ========================================
 * PRODUCTS PAGE
 * ========================================
 *
 * Products listing page with filtering, sorting, and pagination
 */

import { getProductsPageData } from "@/api/server";
import ProductsPageRenderer from "@/components/ProductsPageRenderer";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || "";
  const sort = params.sort || "";
  const search = params.search || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageData = await getProductsPageData({ page, category, sort: sort as any, search });

  return (
    <ProductsPageRenderer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections={(pageData?.sections || []) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products={(pageData?.products || []) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pagination={(pageData?.pagination || null) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filters={(pageData?.filters || {}) as any}
    />
  );
}

export const metadata = {
  title: "Products | Zatiq Store",
  description: "Browse our collection of products",
};
