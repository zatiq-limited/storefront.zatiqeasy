import { apiClient } from '@/lib/api/axios.config';
import {
  CreateOrderPayload,
  OrderResponse,
  PaymentProcessPayload,
  PaymentProcessResponse,
  ReceiptDetails,
  ApiResponse,
  PaymentWebhook,
  PaymentStatus
} from './types';
import { createEncryptedPayload, decryptApiResponse } from './encryption';

// Base URL for payment API (matching the old project)
const PAYMENT_API_BASE = process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'https://easybill.zatiq.tech/api/v1';

/**
 * Create a new order/receipt
 * Returns payment_url directly for gateway payments (matching old project)
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  try {
    // Create encrypted payload
    const encryptedPayload = createEncryptedPayload(payload);

    const response = await apiClient.post(`${PAYMENT_API_BASE}/live/receipts`, encryptedPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
        'Referer': process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
        'User-Agent': navigator.userAgent,
      },
    });

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    // Handle response structure matching old project
    // The old project expects payment_url directly in the response
    if (decryptedData.payment_url || decryptedData.data?.payment_url) {
      return {
        success: true,
        data: {
          ...decryptedData.data,
          payment_url: decryptedData.payment_url || decryptedData.data?.payment_url,
          receipt_id: decryptedData.receipt_id || decryptedData.data?.receipt_id,
          receipt_url: decryptedData.receipt_url || decryptedData.data?.receipt_url,
        },
      };
    }

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: any) {
    console.error('Create order error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create order',
    };
  }
};

/**
 * Process payment for an existing order
 */
export const processPayment = async (payload: PaymentProcessPayload): Promise<PaymentProcessResponse> => {
  try {
    // Create encrypted payload
    const encryptedPayload = createEncryptedPayload(payload);

    const response = await apiClient.post(`${PAYMENT_API_BASE}/live/pendingPayment`, encryptedPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
      },
    });

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: any) {
    console.error('Process payment error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to process payment',
    };
  }
};

/**
 * Get receipt/order details
 */
export const getReceiptDetails = async (receiptId: string): Promise<ApiResponse<ReceiptDetails>> => {
  try {
    const response = await apiClient.get(`${PAYMENT_API_BASE}/receipts/view/${receiptId}`, {
      headers: {
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
      },
    });

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: any) {
    console.error('Get receipt details error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get receipt details',
    };
  }
};

/**
 * Download receipt PDF
 */
export const downloadReceipt = async (receiptId: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`${PAYMENT_API_BASE}/receipts/${receiptId}/download`, {
      responseType: 'blob',
      headers: {
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Download receipt error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to download receipt');
  }
};

/**
 * Check payment status
 */
export const checkPaymentStatus = async (receiptId: string): Promise<ApiResponse<{
  status: PaymentStatus;
  transaction_id?: string;
  payment_details?: any;
}>> => {
  try {
    const response = await apiClient.get(`${PAYMENT_API_BASE}/payments/status/${receiptId}`, {
      headers: {
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
      },
    });

    // Decrypt response if needed
    const decryptedData = decryptApiResponse(response.data);

    return {
      success: true,
      data: decryptedData,
    };
  } catch (error: any) {
    console.error('Check payment status error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to check payment status',
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
    const response = await apiClient.post(`${PAYMENT_API_BASE}/webhooks/${gateway}`, webhookData, {
      headers: {
        'Device-Type': 'Server',
        'Application-Type': 'Webhook_Handler',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Handle webhook error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to handle webhook',
    };
  }
};

/**
 * Retry failed payment
 */
export const retryPayment = async (receiptId: string): Promise<PaymentProcessResponse> => {
  try {
    // First get receipt details to determine retry amount
    const receiptResponse = await getReceiptDetails(receiptId);

    if (!receiptResponse.success || !receiptResponse.data) {
      throw new Error('Failed to get receipt details');
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
  } catch (error: any) {
    console.error('Retry payment error:', error);
    return {
      success: false,
      error: error.message || 'Failed to retry payment',
    };
  }
};

/**
 * Cancel payment/order
 */
export const cancelOrder = async (receiptId: string, reason?: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(`${PAYMENT_API_BASE}/receipts/${receiptId}/cancel`, {
      reason: reason || 'Customer requested cancellation',
    }, {
      headers: {
        'Device-Type': 'Web',
        'Application-Type': 'Online_Shop',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Cancel order error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to cancel order',
    };
  }
};