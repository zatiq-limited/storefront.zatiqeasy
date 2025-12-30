import { NextResponse } from "next/server";
import collectionsData from "@/data/api-responses/collections.json";

// Collections data - revalidate frequently as inventory changes
export const revalidate = 60; // 1 minute

export async function GET() {
  return NextResponse.json(collectionsData, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
