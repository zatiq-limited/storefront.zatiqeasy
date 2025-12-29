import { NextResponse } from "next/server";
import { getAboutPage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const aboutUsData = await getAboutPage();
    
    if (aboutUsData) {
      console.log('[API /page/about-us] Returning data from backend API');
      return NextResponse.json(aboutUsData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/about-us] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/about-us] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch about page' }, { status: 500 });
  }
}