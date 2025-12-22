import { NextRequest, NextResponse } from "next/server";
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zatiqeasy.com";

/**
 * Send OTP for phone verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/live/order-verification/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { status: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

/**
 * Verify OTP
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/live/order-verification/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { status: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
