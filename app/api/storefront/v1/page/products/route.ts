import { NextResponse } from "next/server";
import productsPageData from "@/data/api-responses/products-page.json";

// Static page config - revalidate less frequently
export const revalidate = 300; // 5 minutes

export async function GET() {
  return NextResponse.json(productsPageData, {
    headers: {
      // Longer cache for page configurations
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}