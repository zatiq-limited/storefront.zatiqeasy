import { NextRequest, NextResponse } from "next/server";
import collectionsData from "@/data/api-responses/collections.json";

// Revalidate every 60 seconds
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

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

  const collection = findCollectionBySlug(
    collectionsData.data.collections,
    slug
  );

  if (!collection) {
    return NextResponse.json(
      {
        success: false,
        error: "Collection not found",
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
        collection,
      },
    },
    {
      headers: {
        // Longer cache for individual collections
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}
