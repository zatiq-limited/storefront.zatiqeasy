import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";

/**
 * Send OTP for phone verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data } = await apiClient.post(
      "/api/v1/live/order-verification/send",
      body
    );

    return NextResponse.json(data);
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

    const { data } = await apiClient.post(
      "/api/v1/live/order-verification/verify",
      body
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { status: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
