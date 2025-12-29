import { NextResponse } from "next/server";
import { getTheme } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const themeData = await getTheme();
    
    if (themeData) {
      console.log('[API /theme] Returning data from backend API');
      return NextResponse.json(themeData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /theme] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /theme] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme' }, { status: 500 });
  }
}