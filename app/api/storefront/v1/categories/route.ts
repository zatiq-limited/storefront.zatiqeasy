import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 2 minutes
export const revalidate = 120;

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

    // Build endpoint with query params if ids provided
    const endpoint = `/api/v1/live/filtered_categories${
      ids && ids.length > 0 ? `?filter[id]=${ids.join(",")}` : ""
    }`;

    // Call external API using apiClient (handles encryption automatically)
    const { data } = await apiClient.post(endpoint, {
      identifier: shop_uuid,
    });

    // Check if categories data exists
    if (!data?.data) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
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
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Categories API] Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
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
