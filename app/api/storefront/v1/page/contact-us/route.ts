import { NextResponse } from "next/server";
import { getContactPage } from "@/lib/api/theme-api";
import contactUsMockData from "@/data/api-responses/contact-us.json";

export async function GET() {
  try {
    // Fetch from backend API only
    const contactUsData = await getContactPage();
    
    if (contactUsData) {
      console.log('[API /page/contact-us] Returning data from backend API');
      return NextResponse.json(contactUsData);
    }
    
    // In development, fallback to mock data
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SYSTEM_ENV === 'DEV') {
      console.log('[API /page/contact-us] Using mock data for development');
      return NextResponse.json(contactUsMockData);
    }
    
    // No fallback - return empty response if backend unavailable
    console.log('[API /page/contact-us] No data from backend');
    return NextResponse.json({ success: false, data: null }, { status: 404 });
  } catch (error) {
    console.error('[API /page/contact-us] Error:', error);
    
    // In development, fallback to mock data on error
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SYSTEM_ENV === 'DEV') {
      console.log('[API /page/contact-us] Using mock data after error');
      return NextResponse.json(contactUsMockData);
    }
    
    return NextResponse.json({ success: false, error: 'Failed to fetch contact page' }, { status: 500 });
  }
}