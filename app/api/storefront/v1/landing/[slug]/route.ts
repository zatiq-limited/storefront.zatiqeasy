import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import LZString from "lz-string";
import type { SingleProductPage, SingleProductTheme } from "@/types/landing-page.types";
import type { Section } from "@/lib/types";

// Revalidate every 2 minutes
export const revalidate = 120;

// Theme API Server URL (for block-based landing pages)
const THEME_API_URL = process.env.THEME_API_URL || "http://localhost:4321";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

interface LandingPageResponse {
  data: SingleProductPage;
}

/**
 * Theme API Server response structure
 */
interface ThemeApiLandingResponse {
  id: string;
  shopId: string;
  slug: string;
  name?: string;
  data: string; // LZ-String compressed JSON containing { editorState, page }
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Decompressed landing page data structure from Theme API
 */
interface DecompressedLandingData {
  editorState: {
    sections: Section[];
    product?: {
      id: number;
      name: string;
      slug: string;
      image_url?: string;
      images?: string[];
      selling_price?: number;
      regular_price?: number;
      short_description?: string;
      categories?: Array<{ id: number; name: string }>;
      variant_types?: Array<{
        id: number;
        title: string;
        variants: Array<{
          id: number;
          name: string;
          price?: number;
        }>;
      }>;
      quantity?: number;
    };
    settings?: {
      pageTitle?: string;
      pageDescription?: string;
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
  page: {
    success: boolean;
    data: {
      sections: Section[];
      seo?: {
        title?: string;
        description?: string;
      };
    };
  };
}

/**
 * Decompress LZ-String data from Theme API Server
 */
function decompressLandingPageData(compressed: string): DecompressedLandingData | null {
  try {
    const jsonString = LZString.decompressFromUTF16(compressed);
    if (!jsonString) {
      console.warn("[Landing Page API] Failed to decompress data - empty result");
      return null;
    }
    return JSON.parse(jsonString) as DecompressedLandingData;
  } catch (error) {
    console.error("[Landing Page API] Decompression error:", error);
    return null;
  }
}

/**
 * Fetch block-based landing page from theme-api-server
 * Decompresses LZ-String data and transforms to SingleProductPage format
 */
async function fetchBlockBasedLandingPage(
  shopId: string,
  slug: string
): Promise<SingleProductPage | null> {
  try {
    const response = await fetch(
      `${THEME_API_URL}/theme/landing/${shopId}/${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.log(`[Landing Page API] Theme API returned ${response.status} for ${shopId}/${slug}`);
      return null;
    }

    const rawData: ThemeApiLandingResponse = await response.json();
    
    // Check if we have compressed data
    if (!rawData.data) {
      console.log("[Landing Page API] No data field in theme API response");
      return null;
    }

    // Decompress the LZ-String data
    const decompressed = decompressLandingPageData(rawData.data);
    
    if (!decompressed) {
      console.error("[Landing Page API] Failed to decompress landing page data");
      return null;
    }

    // Extract product data from editorState
    const product = decompressed.editorState?.product;
    const sections = decompressed.page?.data?.sections || decompressed.editorState?.sections || [];
    const settings = decompressed.editorState?.settings;

    // Transform to SingleProductPage format
    const landingPage: SingleProductPage = {
      id: parseInt(rawData.id?.split("_").pop() || "0", 10) || Date.now(),
      page_title: settings?.pageTitle || rawData.name || product?.name || "Landing Page",
      page_description: settings?.pageDescription || product?.short_description || "",
      slug: slug,
      theme_name: "BlockBased" as SingleProductTheme,
      theme_data: [{
        color: {
          primary_color: settings?.primaryColor || "#541DFF",
          secondary_color: settings?.secondaryColor || "#ffffff",
        },
      }],
      inventory: product ? {
        id: product.id,
        shop_id: parseInt(shopId, 10),
        name: product.name,
        slug: product.slug,
        handle: product.slug,
        image_url: product.image_url || (product.images?.[0]) || "",
        images: product.images || (product.image_url ? [product.image_url] : []),
        price: product.selling_price || 0,
        old_price: product.regular_price || product.selling_price || 0,
        quantity: product.quantity || 0,
        is_active: true,
        has_variant: (product.variant_types?.length || 0) > 0,
        variant_types: product.variant_types || [],
        categories: product.categories || [],
        stocks: [],
        is_stock_manage_by_variant: false,
        reviews: [],
        total_inventory_sold: 0,
        short_description: product.short_description || "",
      } : {
        id: 0,
        shop_id: parseInt(shopId, 10),
        name: "Product",
        slug: slug,
        handle: slug,
        image_url: "",
        images: [],
        price: 0,
        old_price: 0,
        quantity: 0,
        is_active: true,
        has_variant: false,
        variant_types: [],
        categories: [],
        stocks: [],
        is_stock_manage_by_variant: false,
        reviews: [],
        total_inventory_sold: 0,
      },
      shop_id: parseInt(shopId, 10),
      sections: sections,
    };

    console.log(`[Landing Page API] Successfully loaded block-based landing page: ${slug} with ${sections.length} sections`);
    return landingPage;
  } catch (error) {
    console.error("[Landing Page API] Error fetching from theme-api-server:", error);
    return null;
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const shopUuid = searchParams.get("shop_uuid") || searchParams.get("identifier");
  const shopId = searchParams.get("shop_id");
  const preview = searchParams.get("preview") === "true";

  if (!shopUuid && !shopId) {
    return NextResponse.json(
      {
        success: false,
        error: "Shop identifier is required",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    // First, try to fetch from the real backend (legacy landing pages)
    const endpoint = preview
      ? `/api/v1/live/single_product_theme?preview=true`
      : `/api/v1/live/single_product_theme`;

    const { data } = await apiClient.post<LandingPageResponse>(endpoint, {
      identifier: shopUuid || shopId,
      slug,
    });

    // If found in backend, return it
    if (data?.data?.id) {
      return NextResponse.json(
        {
          success: true,
          data: data.data,
        },
        {
          headers: {
            "Cache-Control": preview
              ? "no-store"
              : "public, s-maxage=120, stale-while-revalidate=600",
          },
        }
      );
    }
  } catch (error) {
    // Backend returned 404 or error - try theme-api-server next
    console.log("[Landing Page API] Backend returned error, trying theme-api-server...");
  }

  // Try to fetch block-based landing page from theme-api-server
  if (shopId) {
    const blockBasedPage = await fetchBlockBasedLandingPage(shopId, slug);

    if (blockBasedPage) {
      return NextResponse.json(
        {
          success: true,
          data: blockBasedPage,
        },
        {
          headers: {
            "Cache-Control": preview
              ? "no-store"
              : "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }
  }

  // Not found in either source
  return NextResponse.json(
    {
      success: false,
      error: "Landing page not found",
    },
    {
      status: 404,
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    }
  );
}

// Also support POST for compatibility with legacy code
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { identifier, shop_uuid, preview = false } = body;

    const shopIdentifier = identifier || shop_uuid;

    if (!shopIdentifier) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop identifier is required",
        },
        {
          status: 400,
        }
      );
    }

    // Call backend API
    const endpoint = preview
      ? `/api/v1/live/single_product_theme?preview=true`
      : `/api/v1/live/single_product_theme`;

    const { data } = await apiClient.post<LandingPageResponse>(endpoint, {
      identifier: shopIdentifier,
      slug,
    });

    if (!data?.data?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Landing page not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    console.error("[Landing Page API] Error fetching landing page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch landing page",
      },
      {
        status: 500,
      }
    );
  }
}
