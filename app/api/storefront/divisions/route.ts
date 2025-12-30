import { NextResponse } from "next/server";
import type { Division } from "@/types/shop.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

// Cache for divisions data (60 minutes)
let divisionsCache: { data: Division[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000;

export async function GET() {
  try {
    // Return cached data if available and not expired
    if (
      divisionsCache &&
      Date.now() - divisionsCache.timestamp < CACHE_DURATION
    ) {
      return NextResponse.json({
        status: true,
        data: divisionsCache.data,
      });
    }

    // Fetch from external API
    const response = await fetch(`${API_BASE_URL}/api/v1/divisions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Device-Type": "Web",
        "Application-Type": "Online_Shop",
        Referer: "https://shop.zatiqeasy.com",
        "User-Agent": "NextJS Server",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(
        `Failed to fetch divisions: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    // Check if API returned an error
    if (result.success === false || result.error) {
      console.error("API returned error:", result);
      throw new Error(
        result.message || result.error || "API returned error response"
      );
    }

    // Extract divisions data from response
    let divisionsData: Division[];

    if (Array.isArray(result)) {
      divisionsData = result;
    } else if (result.data && Array.isArray(result.data)) {
      divisionsData = result.data;
    } else if (result.divisions && Array.isArray(result.divisions)) {
      divisionsData = result.divisions;
    } else {
      console.error("Invalid API response structure:", result);
      throw new Error("Invalid response structure from divisions API");
    }

    // Update cache
    divisionsCache = {
      data: divisionsData,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      status: true,
      data: divisionsData,
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return NextResponse.json(
      {
        status: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch divisions",
      },
      { status: 500 }
    );
  }
}
