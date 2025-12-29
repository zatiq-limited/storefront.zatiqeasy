import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

// Revalidate every 2 minutes
export const revalidate = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call external API using apiClient directly
    const { data } = await apiClient.post("/api/v1/live/profile", body);

    // Type assertion for API response
    const responseData = data as { data?: { id?: unknown } } | undefined;

    // Check if profile data exists
    if (!responseData?.data?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Shop not found",
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
        data: responseData.data,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Profile API] Error fetching profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shop profile",
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
