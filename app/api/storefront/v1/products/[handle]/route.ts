import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import productsData from "@/data/api-responses/products.json";

// Revalidate every 60 seconds
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ handle: string }>;
}

// Check if we should use local data (development mode or env flag)
const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === "true" || process.env.NODE_ENV === "development";

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { handle } = await params;

  try {
    // In development or when local data flag is set, use local JSON
    if (USE_LOCAL_DATA) {
      const products = productsData.data?.products || [];
      
      // Find product by product_code (case-insensitive) or id
      const product = products.find(
        (p) =>
          p.product_code?.toLowerCase() === handle.toLowerCase() ||
          p.id.toString() === handle
      );

      if (!product) {
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
            product,
          },
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
          },
        }
      );
    }

    // In production, call external API using apiClient
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
