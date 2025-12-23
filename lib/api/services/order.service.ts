/**
 * Order API Service
 * All order/receipt-related API calls
 */

import { apiClient } from "../client";
import type {
  CreateOrderPayload,
  OrderResponse,
  ReceiptDetails,
  ApiResponse,
} from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const orderService = {
  /**
   * Create a new order/receipt
   * Returns payment_url for gateway payments
   * Automatically handles encryption via interceptor
   */
  async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    // Retry logic for order placement
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { data } = await apiClient.post<{
          payment_url?: string;
          receipt_id?: string | number;
          receipt_url?: string;
          data?: Record<string, unknown>;
          [key: string]: unknown;
        }>("/api/v1/live/receipts", payload);

        // Data is already decrypted by interceptor
        return {
          success: true,
          data: {
            payment_url: data.payment_url,
            receipt_id: (data.data?.receipt_id || data.receipt_id) as
              | string
              | number
              | undefined,
            receipt_url: (data.data?.receipt_url || data.receipt_url) as
              | string
              | undefined,
            ...data.data,
          },
        };
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Order creation attempt ${attempt} failed:`, error);
        }

        // If this is the last attempt, return error
        if (attempt === MAX_RETRIES) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create order";
          return {
            success: false,
            error: errorMessage,
          };
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    // This should never be reached
    return {
      success: false,
      error: "Failed to create order after maximum retries",
    };
  },

  /**
   * Get receipt/order details
   */
  async getReceipt(receiptId: string | number): Promise<ReceiptDetails | null> {
    try {
      const { data } = await apiClient.get<ApiResponse<ReceiptDetails>>(
        `/api/v1/live/receipts/${receiptId}`
      );

      if (data?.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching receipt:", error);
      }
      return null;
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    receiptId: string | number,
    status: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const { data } = await apiClient.patch<ApiResponse>(
        `/api/v1/live/receipts/${receiptId}/status`,
        { status }
      );

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating order status:", error);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};
