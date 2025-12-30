import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { SingleProductPage } from "@/types/landing-page.types";

// Revalidate every 2 minutes
export const revalidate = 120;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

interface LandingPageResponse {
  data: SingleProductPage;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const shopUuid = searchParams.get("shop_uuid") || searchParams.get("identifier");
  const preview = searchParams.get("preview") === "true";

  if (!shopUuid) {
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
    // Call backend API to fetch landing page data
    const endpoint = preview
      ? `/api/v1/live/single_product_theme?preview=true`
      : `/api/v1/live/single_product_theme`;

    const { data } = await apiClient.post<LandingPageResponse>(endpoint, {
      identifier: shopUuid,
      slug,
    });

    // Check if landing page data exists
    if (!data?.data?.id) {
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

    return NextResponse.json(
      {
        success: true,
        data: data.data,
      },
      {
        headers: {
          // Cache for 2 minutes, stale for 10 minutes
          "Cache-Control": preview
            ? "no-store"
            : "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Landing Page API] Error fetching landing page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch landing page",
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
