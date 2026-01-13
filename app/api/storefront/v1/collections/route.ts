import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 2 minutes
export const revalidate = 120;

// Define collection type based on categories data
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

/**
 * Generate URL-friendly slug from name
 * Removes special characters, replaces spaces with hyphens
 * Example: "Men's Fashion" → "mens-fashion"
 */
function slugify(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters (apostrophes, etc.)
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Transform categories to collections format (same as merchant theme-builder)
function transformCategoryToCollection(category: Category): Collection {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug || slugify(category.name),
    description: category.description || "",
    image_url: category.image_url || "/placeholder.jpg",
    banner_url: category.banner_url || category.image_url || "/placeholder.jpg",
    product_count: category.total_inventories || 0,
    sort_order: category.serial || 0,
    children: (category.sub_categories || []).map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug || slugify(child.name),
      image_url: child.image_url || "/placeholder.jpg",
      product_count: child.total_inventories || 0,
    })),
    created_at: category.created_at || new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shop_uuid, ids } = body;

    if (!shop_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: "shop_uuid is required",
        },
        { status: 400 }
      );
    }

    // Build endpoint with query params if ids provided (uses same endpoint as categories)
    const endpoint = `/api/v1/live/filtered_categories${
      ids && ids.length > 0 ? `?filter[id]=${ids.join(",")}` : ""
    }`;

    // Call external API using apiClient (handles encryption automatically)
    const { data } = await apiClient.post(endpoint, {
      identifier: shop_uuid,
    });

    // Type assertion for API response
    const responseData = data as { data?: Category[] } | undefined;

    // Check if categories data exists
    if (!responseData?.data) {
      return NextResponse.json(
        {
          success: true,
          data: {
            collections: [],
            pagination: {
              current_page: 1,
              per_page: 20,
              total: 0,
              total_pages: 0,
            },
          },
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
          },
        }
      );
    }

    // Transform categories to collections format
    const collections = responseData.data.map(transformCategoryToCollection);

    return NextResponse.json(
      {
        success: true,
        data: {
          collections,
          pagination: {
            current_page: 1,
            per_page: collections.length,
            total: collections.length,
            total_pages: 1,
          },
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Collections API] Error fetching collections:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collections",
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
