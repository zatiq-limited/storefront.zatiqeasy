/**
 * Payment API Service
 * All payment gateway and order-related API calls
 */

import { apiClient } from "../client";
import type {
  CreateOrderPayload,
  OrderResponse,
  PaymentProcessPayload,
  PaymentProcessResponse,
  ReceiptDetails,
  ApiResponse,
  PaymentStatus,
} from "../types";

const PAYMENT_API_BASE =
  process.env.NEXT_PUBLIC_PAYMENT_API_URL ||
  "https://easybill.zatiq.tech/api/v1";

/**
 * Helper to get error message from unknown error
 */
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return defaultMessage;
}

export const paymentService = {
  /**
   * Create a new order/receipt
   * Returns payment_url directly for gateway payments
   * Encryption/decryption handled automatically by interceptors
   */
  async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    try {
      // Interceptor will handle encryption automatically
      const { data } = await apiClient.post("/api/v1/live/receipts", payload);

      // Type assertion for decrypted response
      type CreateOrderResponse = {
        payment_url?: string;
        receipt_id?: string;
        receipt_url?: string;
        data?: {
          receipt_id?: string;
          receipt_url?: string;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
      const responseData = data as CreateOrderResponse;

      // Interceptor will handle decryption automatically
      return {
        success: true,
        data: {
          payment_url: responseData.payment_url,
          receipt_id: responseData.data?.receipt_id || responseData.receipt_id,
          receipt_url:
            responseData.data?.receipt_url || responseData.receipt_url,
          ...responseData.data,
        },
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Create order error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to create order"),
      };
    }
  },

  /**
   * Process payment for an existing order
   * Encryption/decryption handled automatically by interceptors
   */
  async processPayment(
    payload: PaymentProcessPayload
  ): Promise<PaymentProcessResponse> {
    try {
      // Interceptor will handle encryption automatically
      const { data } = await apiClient.post(
        "/api/v1/live/pendingPayment",
        payload
      );

      // Type assertion for decrypted response
      type PaymentData = {
        payment_url?: string;
        transaction_id?: string;
        [key: string]: unknown;
      };

      // Interceptor will handle decryption automatically
      return {
        success: true,
        data: data as PaymentData,
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Payment processing error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to process payment"),
      };
    }
  },

  /**
   * Get receipt/order details
   */
  async getReceiptDetails(
    receiptId: string
  ): Promise<ApiResponse<ReceiptDetails>> {
    try {
      const { data } = await apiClient.get(
        `${PAYMENT_API_BASE}/receipts/view/${receiptId}`,
        {
          headers: {
            "Device-Type": "Web",
            "Application-Type": "Online_Shop",
          },
        }
      );

      // Type assertion for response
      type ReceiptResponse = {
        data?: ReceiptDetails;
      } & ReceiptDetails;

      const receiptData = data as ReceiptResponse;

      // Interceptor handles decryption if needed
      return {
        success: true,
        data: receiptData.data || receiptData,
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Get receipt details error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to get receipt details"),
      };
    }
  },

  /**
   * Download receipt PDF
   */
  async downloadReceipt(receiptId: string): Promise<Blob> {
    try {
      const { data } = await apiClient.get<Blob>(
        `${PAYMENT_API_BASE}/receipts/${receiptId}/download`,
        {
          headers: {
            "Device-Type": "Web",
            "Application-Type": "Online_Shop",
          },
        }
      );

      // Response is handled as Blob by the fetch client
      return data as Blob;
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Download receipt error:", error);
      }
      throw new Error(getErrorMessage(error, "Failed to download receipt"));
    }
  },

  /**
   * Check payment status
   */
  async checkPaymentStatus(receiptId: string): Promise<
    ApiResponse<{
      status: PaymentStatus;
      transaction_id?: string;
      payment_details?: Record<string, unknown>;
    }>
  > {
    try {
      const { data } = await apiClient.get(
        `${PAYMENT_API_BASE}/payments/status/${receiptId}`,
        {
          headers: {
            "Device-Type": "Web",
            "Application-Type": "Online_Shop",
          },
        }
      );

      // Type assertion for payment status response
      type PaymentStatusData = {
        status: PaymentStatus;
        transaction_id?: string;
        payment_details?: Record<string, unknown>;
      };

      // Interceptor handles decryption if needed
      return {
        success: true,
        data: data as PaymentStatusData,
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Check payment status error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to check payment status"),
      };
    }
  },

  /**
   * Verify payment transaction
   */
  async verifyPayment(
    transactionId: string
  ): Promise<{ success: boolean; status?: string; message?: string }> {
    try {
      const { data } = await apiClient.get<ApiResponse<{ status: string }>>(
        `${PAYMENT_API_BASE}/live/payment/verify/${transactionId}`
      );

      // Type assertion for response
      type VerificationResponse = ApiResponse<{ status: string }> & {
        message?: string;
      };

      const response = data as VerificationResponse;

      return {
        success: true,
        status: response.data?.status,
        message: response.message,
      };
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Payment verification error:", error);
      }
      return {
        success: false,
        message: getErrorMessage(error, "Failed to verify payment"),
      };
    }
  },

  /**
   * Handle payment webhook (for server-side use)
   */
  async handlePaymentWebhook(
    gateway: string,
    webhookData: Record<string, unknown>
  ): Promise<ApiResponse> {
    try {
      const { data } = await apiClient.post(
        `${PAYMENT_API_BASE}/webhooks/${gateway}`,
        webhookData,
        {
          headers: {
            "Device-Type": "Server",
            "Application-Type": "Webhook_Handler",
          },
        }
      );

      return {
        success: true,
        data: data as Record<string, unknown>,
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Handle webhook error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to handle webhook"),
      };
    }
  },

  /**
   * Retry failed payment
   */
  async retryPayment(receiptId: string): Promise<PaymentProcessResponse> {
    try {
      // First get receipt details to determine retry amount
      const receiptResponse = await this.getReceiptDetails(receiptId);

      if (!receiptResponse.success || !receiptResponse.data) {
        throw new Error("Failed to get receipt details");
      }

      const receipt = receiptResponse.data;

      // Create payment payload with due amount
      const paymentPayload: PaymentProcessPayload = {
        receipt_id: receiptId,
        pay_now_amount: receipt.due_amount,
        redirect_root_url:
          typeof window !== "undefined" ? window.location.origin : "",
      };

      // Process payment
      return await this.processPayment(paymentPayload);
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Retry payment error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to retry payment"),
      };
    }
  },

  /**
   * Cancel payment/order
   */
  async cancelOrder(receiptId: string, reason?: string): Promise<ApiResponse> {
    try {
      const { data } = await apiClient.post(
        `${PAYMENT_API_BASE}/receipts/${receiptId}/cancel`,
        {
          reason: reason || "Customer requested cancellation",
        },
        {
          headers: {
            "Device-Type": "Web",
            "Application-Type": "Online_Shop",
          },
        }
      );

      return {
        success: true,
        data: data as Record<string, unknown>,
      };
    } catch (error: unknown) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Cancel order error:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to cancel order"),
      };
    }
  },

  /**
   * Get supported payment methods for a shop
   */
  async getPaymentMethods(
    shopId: string | number
  ): Promise<{ success: boolean; methods?: string[]; error?: string }> {
    try {
      const { data } = await apiClient.get<ApiResponse<{ methods: string[] }>>(
        `${PAYMENT_API_BASE}/live/payment-methods/${shopId}`
      );

      type PaymentMethodsResponse = ApiResponse<{ methods: string[] }>;
      const response = data as PaymentMethodsResponse;

      return {
        success: true,
        methods: response.data?.methods || [],
      };
    } catch (error) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Error fetching payment methods:", error);
      }
      return {
        success: false,
        error: getErrorMessage(error, "Failed to fetch payment methods"),
      };
    }
  },
};
