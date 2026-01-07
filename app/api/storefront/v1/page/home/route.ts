import { NextRequest, NextResponse } from "next/server";
import { getHomePage } from "@/lib/api/theme-api";

// Default empty page structure
const EMPTY_PAGE = {
  success: true,
  data: {
    page_type: "home",
    name: "Home",
    slug: null,
    is_enabled: true,
    sections: [],
    seo: null,
  },
};

export async function GET(request: NextRequest) {
  try {
    // Get shop_id from query params
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shop_id");

    console.log('[API /page/home] Fetching homepage for shop:', shopId || 'default');

    // Fetch from backend API with shop_id
    const homepageData = await getHomePage(shopId || undefined);

    if (homepageData?.data) {
      console.log('[API /page/home] Returning data from backend API');
      return NextResponse.json(homepageData);
    }

    // Return empty page structure when backend API is not yet implemented
    console.log('[API /page/home] No data from backend - returning empty structure');
    return NextResponse.json(EMPTY_PAGE);
  } catch (error) {
    console.error('[API /page/home] Error:', error);
    return NextResponse.json(EMPTY_PAGE);
  }
}