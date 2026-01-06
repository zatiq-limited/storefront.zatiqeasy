import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 2 minutes
export const revalidate = 120;

// Define category type from API
interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  total_inventories?: number;
  serial?: number;
  sub_categories?: Category[];
  created_at?: string;
}

// Collection format for frontend
interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_url: string;
  product_count: number;
  sort_order: number;
  children: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    product_count: number;
  }[];
  created_at: string;
}

// Transform category to collection format
function transformCategoryToCollection(category: Category): Collection {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
    description: category.description || "",
    image_url: category.image_url || "/placeholder.jpg",
    banner_url: category.banner_url || category.image_url || "/placeholder.jpg",
    product_count: category.total_inventories || 0,
    sort_order: category.serial || 0,
    children: (category.sub_categories || []).map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug || child.name.toLowerCase().replace(/\s+/g, "-"),
      image_url: child.image_url || "/placeholder.jpg",
      product_count: child.total_inventories || 0,
    })),
    created_at: category.created_at || new Date().toISOString(),
  };
}

// Find category by slug in nested structure
function findCategoryBySlug(categories: Category[], slug: string): Category | null {
  for (const category of categories) {
    const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
    if (categorySlug === slug) {
      return category;
    }
    // Search in sub_categories recursively
    if (category.sub_categories && category.sub_categories.length > 0) {
      const found = findCategoryBySlug(category.sub_categories, slug);
      if (found) return found;
    }
  }
  return null;
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST method - fetch collection by slug with shop_uuid
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { shop_uuid } = body;

    if (!shop_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: "shop_uuid is required",
        },
        { status: 400 }
      );
    }

    // Fetch all categories from external API
    const { data } = await apiClient.post("/api/v1/live/filtered_categories", {
      identifier: shop_uuid,
    });

    // Type assertion for API response
    const responseData = data as { data?: Category[] } | undefined;

    if (!responseData?.data || responseData.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No collections found",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
          },
        }
      );
    }

    // Find the collection by slug
    const category = findCategoryBySlug(responseData.data, slug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
          },
        }
      );
    }

    // Transform to collection format
    const collection = transformCategoryToCollection(category);

    return NextResponse.json(
      {
        success: true,
        data: {
          collection,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Collection API] Error fetching collection:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

// GET method - for backwards compatibility (requires shop_uuid as query param)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const shop_uuid = searchParams.get("shop_uuid");

  if (!shop_uuid) {
    return NextResponse.json(
      {
        success: false,
        error: "shop_uuid query parameter is required",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch all categories from external API
    const { data } = await apiClient.post("/api/v1/live/filtered_categories", {
      identifier: shop_uuid,
    });

    // Type assertion for API response
    const responseData = data as { data?: Category[] } | undefined;

    if (!responseData?.data || responseData.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No collections found",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
          },
        }
      );
    }

    // Find the collection by slug
    const category = findCategoryBySlug(responseData.data, slug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
          },
        }
      );
    }

    // Transform to collection format
    const collection = transformCategoryToCollection(category);

    return NextResponse.json(
      {
        success: true,
        data: {
          collection,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Collection API] Error fetching collection:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
