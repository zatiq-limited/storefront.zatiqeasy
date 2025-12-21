import { NextResponse } from "next/server";
import collectionDetailsPageData from "@/data/api-responses/collection-details-page.json";

export const revalidate = 300; // 5 minutes

export async function GET() {
  return NextResponse.json(collectionDetailsPageData, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}