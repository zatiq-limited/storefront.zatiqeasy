import { apiClient } from "@/lib/api/axios.config";
import {
  CreateOrderPayload,
  OrderResponse,
  PaymentProcessPayload,
  PaymentProcessResponse,
  ReceiptDetails,
  ApiResponse,
  PaymentWebhook,
  PaymentStatus,
} from "./types";
import { createEncryptedPayload, decryptApiResponse } from "./encryption";
import { getApiErrorMessage } from "./utils";

// Base URL for payment API (matching the old project)
const PAYMENT_API_BASE =
  process.env.NEXT_PUBLIC_PAYMENT_API_URL ||
  "https://easybill.zatiq.tech/api/v1";

/**
 * Create a new order/receipt
 * Returns payment_url directly for gateway payments (matching old project)
 */
export const createOrder = async (
  payload: CreateOrderPayload
): Promise<OrderResponse> => {
  try {
    // Create encrypted payload
    const encryptedPayload = createEncryptedPayload(payload);

    const response = await apiClient.post(
      `${PAYMENT_API_BASE}/live/receipts`,
      encryptedPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    // Decrypt response - response.data contains the encrypted string
    const decryptedData = decryptApiResponse(response.data);

    console.log("Decrypted API Response:", decryptedData);

    // Old project structure: payment_url at root OR data.receipt_url
    return {
      success: true,
      data: {
        payment_url: decryptedData.payment_url,
        receipt_id: decryptedData.data?.receipt_id || decryptedData.receipt_id,
        receipt_url:
          decryptedData.data?.receipt_url || decryptedData.receipt_url,
        ...decryptedData.data,
      },
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create order error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to create order"),
    };
  }
};

/**
 * Process payment for an existing order
 */
export const processPayment = async (
  payload: PaymentProcessPayload
): Promise<PaymentProcessResponse> => {
  try {
    // Create encrypted payload
    const encryptedPayload = createEncryptedPayload(payload);

    const response = await apiClient.post(
      `${PAYMENT_API_BASE}/live/pendingPayment`,
      encryptedPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Process payment error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to process payment"),
    };
  }
};

/**
 * Get receipt/order details
 */
export const getReceiptDetails = async (
  receiptId: string
): Promise<ApiResponse<ReceiptDetails>> => {
  try {
    const response = await apiClient.get(
      `${PAYMENT_API_BASE}/receipts/view/${receiptId}`,
      {
        headers: {
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    // Decrypt response - response.data contains the encrypted string
    const decryptedData = decryptApiResponse(response.data);

    // Old project structure: decryptedData has {success: true, data: {...actual receipt data}}
    const receiptData = decryptedData.data || decryptedData;

    return {
      success: true,
      data: receiptData,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get receipt details error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to get receipt details"),
    };
  }
};

/**
 * Download receipt PDF
 */
export const downloadReceipt = async (receiptId: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(
      `${PAYMENT_API_BASE}/receipts/${receiptId}/download`,
      {
        responseType: "blob",
        headers: {
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Download receipt error:", error);
    }
    throw new Error(getApiErrorMessage(error, "Failed to download receipt"));
  }
};

/**
 * Check payment status
 */
export const checkPaymentStatus = async (
  receiptId: string
): Promise<
  ApiResponse<{
    status: PaymentStatus;
    transaction_id?: string;
    payment_details?: Record<string, unknown>;
  }>
> => {
  try {
    const response = await apiClient.get(
      `${PAYMENT_API_BASE}/payments/status/${receiptId}`,
      {
        headers: {
          "Device-Type": "Web",
          "Application-Type": "Online_Shop",
        },
      }
    );

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Check payment status error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to check payment status"),
    };
  }
};

/**
 * Handle payment webhook (for server-side use)
 */
export const handlePaymentWebhook = async (
  gateway: string,
  webhookData: PaymentWebhook
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
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
      data: response.data,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Handle webhook error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to handle webhook"),
    };
  }
};

/**
 * Retry failed payment
 */
export const retryPayment = async (
  receiptId: string
): Promise<PaymentProcessResponse> => {
  try {
    // First get receipt details to determine retry amount
    const receiptResponse = await getReceiptDetails(receiptId);

    if (!receiptResponse.success || !receiptResponse.data) {
      throw new Error("Failed to get receipt details");
    }

    const receipt = receiptResponse.data;

    // Create payment payload with due amount
    const paymentPayload: PaymentProcessPayload = {
      receipt_id: receiptId,
      pay_now_amount: receipt.due_amount,
      redirect_root_url: window.location.origin,
    };

    // Process payment
    return await processPayment(paymentPayload);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Retry payment error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to retry payment"),
    };
  }
};

/**
 * Cancel payment/order
 */
export const cancelOrder = async (
  receiptId: string,
  reason?: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
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
      data: response.data,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Cancel order error:", error);
    }
    return {
      success: false,
      error: getApiErrorMessage(error, "Failed to cancel order"),
    };
  }
};
