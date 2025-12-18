import { NextResponse } from "next/server";
import productDetailsPageData from "@/data/api-responses/product-details-page.json";

// Static page config - revalidate less frequently
export const revalidate = 300; // 5 minutes

export async function GET() {
  return NextResponse.json(productDetailsPageData, {
    headers: {
      // Longer cache for page configurations
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}