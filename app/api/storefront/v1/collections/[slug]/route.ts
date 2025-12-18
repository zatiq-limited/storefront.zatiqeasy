import { NextResponse } from "next/server";
import collectionsData from "@/data/api-responses/collections.json";

export const revalidate = 300; // 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Find collection by slug (including nested search)
  const findCollectionBySlug = (collections: any[], slug: string): any => {
    for (const collection of collections) {
      if (collection.slug === slug) {
        return collection;
      }
      // Search in children recursively
      if (collection.children) {
        const found = findCollectionBySlug(collection.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const collection = findCollectionBySlug(collectionsData.data.collections, slug);

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(collection, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}