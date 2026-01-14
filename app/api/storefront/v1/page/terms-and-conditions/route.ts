import { NextResponse } from "next/server";
import { getTermsAndConditionsPage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const termsData = await getTermsAndConditionsPage();

    if (termsData) {
      console.log('[API /page/terms-and-conditions] Returning data from backend API');
      return NextResponse.json(termsData);
    }

    // No fallback - return empty response if backend unavailable
    console.log('[API /page/terms-and-conditions] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/terms-and-conditions] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch terms and conditions page' }, { status: 500 });
  }
}
