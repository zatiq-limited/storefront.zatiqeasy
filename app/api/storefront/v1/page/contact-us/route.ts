import { NextResponse } from "next/server";
import { getContactPage } from "@/lib/api/theme-api";

export async function GET() {
  try {
    // Fetch from backend API only
    const contactUsData = await getContactPage();
    
    if (contactUsData) {
      console.log('[API /page/contact-us] Returning data from backend API');
      return NextResponse.json(contactUsData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/contact-us] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/contact-us] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contact page' }, { status: 500 });
  }
}