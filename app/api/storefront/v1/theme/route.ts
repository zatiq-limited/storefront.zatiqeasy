import { NextRequest, NextResponse } from "next/server";
import { getLiveTheme } from "@/lib/api/theme-api";

// Default empty theme structure
const EMPTY_THEME = {
  success: true,
  legacy_theme: false,
  data: {
    global_settings: {
      colors: {
        primary: "#3B82F6",
        secondary: "#6B7280",
        accent: "#f59e0b",
        background: "#FFFFFF",
        text: "#111827",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
    },
    global_sections: {
      announcement: null,
      header: null,
      footer: null,
    },
    pages: [],
  },
};

export async function GET(request: NextRequest) {
  try {
    // Get shop identification from query params
    const { searchParams } = new URL(request.url);
    const shop_id = searchParams.get("shop_id");
    const subdomain = searchParams.get("subdomain");
    const domain = searchParams.get("domain");

    // Build params object - at least one identifier is required
    const params: { shop_id?: string; subdomain?: string; domain?: string } = {};
    if (shop_id) params.shop_id = shop_id;
    if (subdomain) params.subdomain = subdomain;
    if (domain) params.domain = domain;

    // If no identification provided, return empty theme
    if (!shop_id && !subdomain && !domain) {
      console.log('[API /theme] No shop identification provided - returning empty theme');
      return NextResponse.json(EMPTY_THEME);
    }

    console.log('[API /theme] Fetching theme with params:', params);

    // Use getLiveTheme which is the primary entry point for theme data
    const result = await getLiveTheme(params);

    // Check if shop uses legacy theme
    if (result.legacy_theme) {
      console.log('[API /theme] Shop uses legacy theme');
      return NextResponse.json({ success: true, legacy_theme: true });
    }

    // Return theme data if available
    if (result.success && result.data) {
      console.log('[API /theme] Returning theme data from backend API');
      return NextResponse.json({
        success: true,
        legacy_theme: false,
        data: result.data,
      });
    }

    // Return empty theme structure when no data available
    console.log('[API /theme] No data from backend - returning empty theme structure');
    return NextResponse.json(EMPTY_THEME);
  } catch (error) {
    console.error('[API /theme] Error:', error);
    return NextResponse.json(EMPTY_THEME);
  }
}

// Also support POST for flexibility (like profile endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shop_id, subdomain, domain } = body;

    // Build params object
    const params: { shop_id?: string; subdomain?: string; domain?: string } = {};
    if (shop_id) params.shop_id = shop_id;
    if (subdomain) params.subdomain = subdomain;
    if (domain) params.domain = domain;

    // If no identification provided, return empty theme
    if (!shop_id && !subdomain && !domain) {
      console.log('[API /theme] No shop identification provided - returning empty theme');
      return NextResponse.json(EMPTY_THEME);
    }

    console.log('[API /theme] POST - Fetching theme with params:', params);

    const result = await getLiveTheme(params);

    if (result.legacy_theme) {
      console.log('[API /theme] Shop uses legacy theme');
      return NextResponse.json({ success: true, legacy_theme: true });
    }

    if (result.success && result.data) {
      console.log('[API /theme] Returning theme data from backend API');
      return NextResponse.json({
        success: true,
        legacy_theme: false,
        data: result.data,
      });
    }

    console.log('[API /theme] No data from backend - returning empty theme structure');
    return NextResponse.json(EMPTY_THEME);
  } catch (error) {
    console.error('[API /theme] Error:', error);
    return NextResponse.json(EMPTY_THEME);
  }
}