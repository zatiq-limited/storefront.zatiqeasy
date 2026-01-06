import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 2 minutes
export const revalidate = 120;

// Product interface based on API response
interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  regular_price?: number;
  short_description?: string;
  brand?: string;
  image?: string;
  images?: string[];
  categories?: { id: number; name: string }[];
  created_at: string;
  updated_at?: string;
  stock?: number;
  is_active?: boolean;
}

// POST method - fetch products with shop_uuid and filtering
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shop_uuid,
      page = 1,
      limit = 20,
      category,
      category_id,
      search,
      sort = "newest",
      ids,
    } = body;

    if (!shop_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: "shop_uuid is required",
        },
        { status: 400 }
      );
    }

    // Build endpoint with query params
    const queryParams: string[] = [];
    if (ids && ids.length > 0) {
      queryParams.push(`filter[id]=${ids.join(",")}`);
    }
    if (category_id) {
      queryParams.push(`filter[category_id]=${category_id}`);
    }

    const endpoint = `/api/v1/live/inventories${
      queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
    }`;

    // Call external API using apiClient (handles encryption automatically)
    const { data } = await apiClient.post(endpoint, {
      identifier: shop_uuid,
    });

    // Type assertion for API response
    const responseData = data as { data?: Product[] } | undefined;

    if (!responseData?.data) {
      return NextResponse.json(
        {
          success: true,
          data: {
            products: [],
            pagination: {
              current_page: 1,
              per_page: limit,
              total: 0,
              total_pages: 0,
              from: 0,
              to: 0,
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

    let products = [...responseData.data];

    // Filter by category_id (filter products that belong to this category)
    if (category_id) {
      const categoryIdNum = Number(category_id);
      products = products.filter((product) =>
        product.categories?.some((cat) => cat.id === categoryIdNum)
      );
    }

    // Filter by category name (alternative to category_id)
    if (category && !category_id) {
      products = products.filter((product) =>
        product.categories?.some(
          (cat) =>
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

    return NextResponse.json(
      {
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            current_page: page,
            per_page: limit,
            total,
            total_pages: totalPages,
            from: total > 0 ? startIndex + 1 : 0,
            to: Math.min(endIndex, total),
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
    console.error("[Products API] Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
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
export async function GET(request: NextRequest) {
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

  // Parse other query parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const category = searchParams.get("category");
  const category_id = searchParams.get("category_id");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";

  try {
    // Build endpoint with query params
    const queryParams: string[] = [];
    if (category_id) {
      queryParams.push(`filter[category_id]=${category_id}`);
    }

    const endpoint = `/api/v1/live/inventories${
      queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
    }`;

    // Call external API
    const { data } = await apiClient.post(endpoint, {
      identifier: shop_uuid,
    });

    // Type assertion for API response
    const responseData = data as { data?: Product[] } | undefined;

    if (!responseData?.data) {
      return NextResponse.json(
        {
          success: true,
          data: {
            products: [],
            pagination: {
              current_page: 1,
              per_page: limit,
              total: 0,
              total_pages: 0,
              from: 0,
              to: 0,
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

    let products = [...responseData.data];

    // Filter by category_id (filter products that belong to this category)
    if (category_id) {
      const categoryIdNum = Number(category_id);
      products = products.filter((product) =>
        product.categories?.some((cat) => cat.id === categoryIdNum)
      );
    }

    // Filter by category name (alternative to category_id)
    if (category && !category_id) {
      products = products.filter((product) =>
        product.categories?.some(
          (cat) =>
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

    return NextResponse.json(
      {
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            current_page: page,
            per_page: limit,
            total,
            total_pages: totalPages,
            from: total > 0 ? startIndex + 1 : 0,
            to: Math.min(endIndex, total),
          },
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
          Vary: "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error("[Products API] Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
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
