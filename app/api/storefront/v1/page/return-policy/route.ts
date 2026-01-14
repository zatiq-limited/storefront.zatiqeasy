import { NextResponse } from "next/server";
import { getReturnPolicyPage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const returnPolicyData = await getReturnPolicyPage();

    if (returnPolicyData) {
      console.log('[API /page/return-policy] Returning data from backend API');
      return NextResponse.json(returnPolicyData);
    }

    // No fallback - return empty response if backend unavailable
    console.log('[API /page/return-policy] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/return-policy] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch return policy page' }, { status: 500 });
  }
}
