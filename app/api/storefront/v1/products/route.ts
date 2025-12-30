import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/api-responses/products.json";

// Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

// Enable edge runtime for better performance
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters for filtering/pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";

  let products = [...(productsData.data?.products || [])];

  // Filter by category
  if (category) {
    products = products.filter((product) =>
      product.categories?.some(
        (cat: { id: number; name: string }) =>
          cat.name.toLowerCase() === category.toLowerCase() ||
          cat.id.toString() === category
      )
    );
  }

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.short_description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
    );
  }

  // Sort products
  switch (sort) {
    case "price_asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name_desc":
      products.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "oldest":
      products.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "newest":
    default:
      products.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  // Paginate
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const response = {
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: totalPages,
        from: startIndex + 1,
        to: Math.min(endIndex, total),
      },
    },
  };

  return NextResponse.json(response, {
    headers: {
      // Cache control for CDN and browser
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      // Vary header for proper caching with query params
      Vary: "Accept-Encoding",
    },
  });
}