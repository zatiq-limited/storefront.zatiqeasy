import { NextRequest, NextResponse } from "next/server";
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zatiqeasy.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Encrypt the request payload
    const encryptedPayload = encryptData(body);

    // Validate promo code with external API
    const response = await fetch(
      `${API_BASE_URL}/api/v1/live/shop_promo_codes/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: encryptedPayload }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "PromoCode is not valid!" },
        { status: 400 }
      );
    }

    const result = await response.json();
    const decryptedData = decryptData(result);

    return NextResponse.json(decryptedData);
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { success: false, message: "PromoCode is not valid!" },
      { status: 500 }
    );
  }
}
