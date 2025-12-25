import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 60 seconds
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { handle } = await params;

  try {
    // Call external API using apiClient
    // Note: This endpoint does NOT require encryption (GET request)
    const { data } = await apiClient.get(`/api/v1/live/inventory/${handle}`);

    // Check if product data exists
    if (!data?.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
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
        data: {
          product: data.data,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Product API] Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
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
