import { NextRequest, NextResponse } from "next/server";
import collectionsData from "@/data/api-responses/collections.json";

// Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters for filtering/pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "sort_order";

  let collections = [...(collectionsData.data?.collections || [])];

  // Filter by featured
  if (featured === "true") {
    collections = collections.filter((collection) => collection.is_featured);
  }

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    collections = collections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchLower) ||
        collection.description?.toLowerCase().includes(searchLower)
    );
  }

  // Sort collections
  switch (sort) {
    case "name_asc":
      collections.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name_desc":
      collections.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "newest":
      collections.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "oldest":
      collections.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "product_count":
      collections.sort((a, b) => b.product_count - a.product_count);
      break;
    case "sort_order":
    default:
      collections.sort((a, b) => a.sort_order - b.sort_order);
      break;
  }

  // Paginate
  const total = collections.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCollections = collections.slice(startIndex, endIndex);

  const response = {
    success: true,
    data: {
      collections: paginatedCollections,
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
