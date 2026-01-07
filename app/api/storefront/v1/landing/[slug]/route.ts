import { NextRequest, NextResponse } from "next/server";
import { getLandingPage, type LandingPageData, type LegacyLandingPageData } from "@/lib/api/theme-api";

// Revalidate every 2 minutes
export const revalidate = 120;

interface RouteParams {
  params: Promise<{ slug: string }>;
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
    // Use theme-api service to fetch landing page
    const result = await getLandingPage(slug, shopUuid, preview);

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

    // Use theme-api service to fetch landing page
    const result = await getLandingPage(slug, shopIdentifier, preview);

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
