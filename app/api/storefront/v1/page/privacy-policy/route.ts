import { NextResponse } from "next/server";
import { getPrivacyPolicyPage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const privacyPolicyData = await getPrivacyPolicyPage();
    
    if (privacyPolicyData) {
      console.log('[API /page/privacy-policy] Returning data from backend API');
      return NextResponse.json(privacyPolicyData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/privacy-policy] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/privacy-policy] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch privacy policy page' }, { status: 500 });
  }
}
