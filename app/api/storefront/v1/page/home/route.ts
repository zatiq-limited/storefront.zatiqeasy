import { NextResponse } from "next/server";
import { getHomePage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const homepageData = await getHomePage();
    
    if (homepageData) {
      console.log('[API /page/home] Returning data from backend API');
      return NextResponse.json(homepageData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/home] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/home] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch homepage' }, { status: 500 });
  }
}