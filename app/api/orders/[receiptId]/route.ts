import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  try {
    const { receiptId } = await params;

    // Validate receipt ID
    if (!receiptId || receiptId.length < 5) {
      return NextResponse.json(
        { success: false, error: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    // Get receipt details
    const response = await paymentService.getReceiptDetails(receiptId);

    if (response.success) {
      return NextResponse.json({
        success: true,
        data: response.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Get receipt API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to get receipt details",
      },
      { status: 500 }
    );
  }
}
