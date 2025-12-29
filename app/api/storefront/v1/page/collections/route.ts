import { NextResponse } from "next/server";
import { getCollectionsPage } from "@/lib/api/theme-api";

// Static page config - revalidate less frequently
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    // Fetch from backend API only
    const collectionsPageData = await getCollectionsPage();
    
    if (collectionsPageData) {
      console.log('[API /page/collections] Returning data from backend API');
      return NextResponse.json(collectionsPageData, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      });
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/collections] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/collections] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch collections page' }, { status: 500 });
  }
}
