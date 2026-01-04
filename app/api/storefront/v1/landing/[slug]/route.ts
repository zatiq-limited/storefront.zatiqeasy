import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { SingleProductPage } from "@/types/landing-page.types";

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
 * Fetch block-based landing page from theme-api-server
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
      return null;
    }

    const data = await response.json();
    return data || null;
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
