import { NextRequest, NextResponse } from "next/server";
import { PaymentType, OrderStatus } from "@/lib/payments/types";
import { validatePhoneNumber } from "@/lib/payments/utils";
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.zatiqeasy.com";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "shop_id",
      "customer_name",
      "customer_phone",
      "customer_address",
      "delivery_charge",
      "tax_amount",
      "total_amount",
      "payment_type",
      "pay_now_amount",
      "receipt_items",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment type
    if (!Object.values(PaymentType).includes(body.payment_type)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment type" },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!validatePhoneNumber(body.customer_phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Create order payload with all fields from old project
    const orderPayload = {
      shop_id: Number(body.shop_id),
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_address: body.customer_address,
      delivery_charge: Number(body.delivery_charge),
      delivery_zone: body.delivery_zone || "Others",
      tax_amount: Number(body.tax_amount),
      tax_percentage: body.tax_percentage || 0,
      total_amount: Number(body.total_amount),
      payment_type: body.payment_type,
      pay_now_amount: Number(body.pay_now_amount),
      advance_payment_amount: body.advance_payment_amount
        ? Number(body.advance_payment_amount)
        : 0,
      discount_amount: body.discount_amount || 0,
      discount_percentage: body.discount_percentage || 0,
      shop_promo_code_id: body.shop_promo_code_id,
      receipt_items: body.receipt_items,
      type: "Online",
      status: OrderStatus.ORDER_PLACED,
      notes: body.notes || "",
      email: body.email,
      district: body.district,
      redirect_root_url: body.redirect_root_url,
      mfs_payment_phone: body.mfs_payment_phone,
      mfs_transaction_id: body.mfs_transaction_id,
      mfs_provider: body.mfs_provider,
    };

    // Encrypt the request payload
    const encryptedPayload = encryptData(orderPayload);

    // Retry logic for order placement (matching old project)
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/live/receipts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload: encryptedPayload }),
        });

        if (!response.ok) {
          throw new Error(`Order placement failed: ${response.statusText}`);
        }

        const result = await response.json();
        const decryptedData = decryptData(result);

        return NextResponse.json(decryptedData);
      } catch (error) {
        console.error(`Order placement attempt ${attempt} failed:`, error);

        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    // This should never be reached due to throw in loop
    throw new Error("Failed to place order after maximum retries");
  } catch (error: unknown) {
    console.error("Create order API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
