import { NextRequest, NextResponse } from "next/server";
import {
  getLandingPage,
  type LandingPageData,
  type LegacyLandingPageData,
} from "@/lib/api/theme-api";

// Revalidate every 2 minutes
export const revalidate = 120;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  // Get query parameters
  // shop_id: for Theme Builder
  // shop_uuid: for Legacy theme
  const shopId = searchParams.get("shop_id") || "";
  const shopUuid = searchParams.get("shop_uuid") || searchParams.get("identifier") || "";
  const preview = searchParams.get("preview") === "true";

  if (!shopId && !shopUuid) {
    return NextResponse.json(
      {
        success: false,
        error: "Shop ID or Shop UUID is required",
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
    // Use theme-api service to fetch landing page
    // Theme Builder uses shop_id, Legacy uses shop_uuid
    const result = await getLandingPage(slug, shopId, shopUuid, preview);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Landing page not found",
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
        type: result.type,
        data: result.data,
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

    const { shop_id, identifier, shop_uuid, preview = false } = body;

    // Theme Builder uses shop_id, Legacy uses shop_uuid (identifier)
    const shopId = shop_id || "";
    const shopUuid = shop_uuid || identifier || "";

    if (!shopId && !shopUuid) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop ID or Shop UUID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Use theme-api service to fetch landing page
    // Theme Builder uses shop_id, Legacy uses shop_uuid
    const result = await getLandingPage(slug, shopId, shopUuid, preview);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Landing page not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      type: result.type,
      data: result.data,
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

// Export types for use in other files
export type { LandingPageData, LegacyLandingPageData };
