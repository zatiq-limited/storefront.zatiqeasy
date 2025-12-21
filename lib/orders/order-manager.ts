import { CreateOrderPayload, OrderResponse, ReceiptDetails, PaymentType, OrderStatus, PaymentStatus, ApiResponse } from '@/lib/payments/types';
import { createOrder, getReceiptDetails } from '@/lib/payments/api';
import { formatPrice, validatePhoneNumber } from '@/lib/payments/utils';
import { CartStore } from '@/stores/cartStore';

/**
 * Order Manager - Handles order creation and management
 */
export class OrderManager {
  private static instance: OrderManager;
  private retryCount = 0;
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): OrderManager {
    if (!OrderManager.instance) {
      OrderManager.instance = new OrderManager();
    }
    return OrderManager.instance;
  }

  /**
   * Create a new order from cart
   */
  async createOrderFromCart(
    cart: CartStore,
    checkoutData: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      paymentType: PaymentType;
      shopId: number;
      deliveryChargeInsideDhaka: number;
      deliveryChargeOutsideDhaka: number;
      taxPercentage?: number;
      note?: string;
    }
  ): Promise<OrderResponse> {
    try {
      // Validate inputs
      if (!validatePhoneNumber(checkoutData.customerPhone)) {
        throw new Error('Please enter a valid phone number');
      }

      if (cart.items.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Calculate delivery charge
      const deliveryCharge = this.calculateDeliveryCharge(
        checkoutData.customerAddress,
        checkoutData.deliveryChargeInsideDhaka,
        checkoutData.deliveryChargeOutsideDhaka
      );

      // Calculate subtotal
      const subtotal = cart.getTotal();

      // Calculate tax
      const taxAmount = checkoutData.taxPercentage
        ? Math.round((subtotal * checkoutData.taxPercentage) / 100)
        : 0;

      // Calculate total amount
      const totalAmount = subtotal + deliveryCharge + taxAmount;

      // Prepare order items
      const receiptItems = cart.items.map(item => ({
        product_id: item.id,
        product_handle: item.handle || item.id,
        product_name: item.name,
        variant_id: item.variantId,
        variant_name: item.variantName,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        product_image: item.image,
      }));

      // Create order payload
      const orderPayload: CreateOrderPayload = {
        shop_id: checkoutData.shopId,
        customer_name: checkoutData.customerName,
        customer_phone: checkoutData.customerPhone,
        customer_address: checkoutData.customerAddress,
        delivery_charge: deliveryCharge,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_type: checkoutData.paymentType,
        pay_now_amount: totalAmount, // Pay full amount for now
        receipt_items: receiptItems,
        type: 'Online',
        status: OrderStatus.ORDER_PLACED,
        note: checkoutData.note,
      };

      // Create order with retry mechanism
      return await this.createOrderWithRetry(orderPayload);
    } catch (error) {
      console.error('Create order from cart error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }

  /**
   * Create order with retry mechanism
   */
  private async createOrderWithRetry(payload: CreateOrderPayload): Promise<OrderResponse> {
    try {
      const response = await createOrder(payload);
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        console.warn(`Order creation failed, retrying... (${this.retryCount}/${this.maxRetries})`);
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.createOrderWithRetry(payload);
      }
      throw error;
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(receiptId: string): Promise<ReceiptDetails | null> {
    try {
      const response = await getReceiptDetails(receiptId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get order details error:', error);
      return null;
    }
  }

  /**
   * Generate order summary for display
   */
  generateOrderSummary(receipt: ReceiptDetails) {
    return {
      receiptId: receipt.receipt_id,
      customerName: receipt.customer_name,
      customerPhone: receipt.customer_phone,
      customerAddress: receipt.customer_address,
      paymentType: receipt.payment_type,
      status: receipt.status,
      paymentStatus: receipt.payment_status,
      subtotal: receipt.receipt_items.reduce((sum, item) => sum + item.total_price, 0),
      deliveryCharge: receipt.delivery_charge,
      taxAmount: receipt.tax_amount,
      totalAmount: receipt.total_amount,
      paidAmount: receipt.paid_amount,
      dueAmount: receipt.due_amount,
      items: receipt.receipt_items,
      createdAt: new Date(receipt.created_at),
      transactionId: receipt.transaction_id,
    };
  }

  /**
   * Calculate delivery charge based on address
   */
  private calculateDeliveryCharge(
    address: string,
    insideDhakaCharge: number,
    outsideDhakaCharge: number
  ): number {
    const dhakaAreas = [
      'dhaka', 'mirpur', 'dhanmondi', 'gulshan', 'banani', 'uttara', 'mohammadpur',
      'farmgate', 'shahbagh', 'new market', 'azampur', 'kawran bazar', 'bashundhara',
      'baridhara', 'badda', 'khilgaon', 'malibagh', 'mogbazar', 'tejgaon'
    ];

    const addressLower = address.toLowerCase();
    const isInsideDhaka = dhakaAreas.some(area => addressLower.includes(area));

    return isInsideDhaka ? insideDhakaCharge : outsideDhakaCharge;
  }

  /**
   * Format order status for display
   */
  formatOrderStatus(status: OrderStatus): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Check if order can be cancelled
   */
  canCancelOrder(status: OrderStatus, paymentStatus: string): boolean {
    const cancelableStatuses = [OrderStatus.ORDER_PLACED, OrderStatus.PROCESSING];
    return cancelableStatuses.includes(status) && paymentStatus !== 'success';
  }

  /**
   * Check if order can be retried for payment
   */
  canRetryPayment(status: OrderStatus, paymentStatus: string): boolean {
    return status === OrderStatus.ORDER_PLACED && paymentStatus === 'pending';
  }

  /**
   * Get estimated delivery date
   */
  getEstimatedDeliveryDate(status: OrderStatus, createdAt: Date): Date | null {
    const deliveryEstimates = {
      [OrderStatus.ORDER_PLACED]: 3, // 3 days
      [OrderStatus.PROCESSING]: 2, // 2 days
      [OrderStatus.SHIPPED]: 1, // 1 day
      [OrderStatus.DELIVERED]: 0, // Already delivered
      [OrderStatus.CANCELLED]: null, // Cancelled
    };

    const days = deliveryEstimates[status];
    if (days === null || days === undefined) return null;

    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate;
  }

  /**
   * Generate receipt URL
   */
  generateReceiptUrl(receiptId: string): string {
    return `${window.location.origin}/receipt/${receiptId}`;
  }

  /**
   * Generate WhatsApp share message for order
   */
  generateWhatsAppMessage(receipt: ReceiptDetails): string {
    const orderSummary = this.generateOrderSummary(receipt);
    const message = `
🛒 Order Details 🛒
Order ID: ${orderSummary.receiptId}
Name: ${orderSummary.customerName}
Phone: ${orderSummary.customerPhone}
Total Amount: ${formatPrice(orderSummary.totalAmount)}
Payment Method: ${orderSummary.paymentType}
Status: ${this.formatOrderStatus(orderSummary.status)}

Track your order: ${this.generateReceiptUrl(orderSummary.receiptId)}
    `.trim();

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  /**
   * Update order payment status (for webhook processing)
   */
  async updateOrderPaymentStatus(data: {
    receiptId: string;
    paymentType: PaymentType;
    transactionId: string;
    status: PaymentStatus;
    amount: number;
    gatewayResponse: any;
  }): Promise<ApiResponse> {
    try {
      // Get current order details
      const order = await this.getOrderDetails(data.receiptId);
      if (!order) {
        return {
          success: false,
          error: 'Order not found',
        };
      }

      // Update payment status via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/api/v1/live/updatePaymentStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Device-Type': 'Server',
          'Application-Type': 'Webhook_Handler',
        },
        body: JSON.stringify({
          receipt_id: data.receiptId,
          payment_type: data.paymentType,
          transaction_id: data.transactionId,
          payment_status: data.status,
          amount: data.amount,
          gateway_response: data.gatewayResponse,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // TODO: Send notifications to customer
        if (data.status === PaymentStatus.SUCCESS) {
          await this.sendPaymentConfirmationNotification(order, data.transactionId);
        }

        return {
          success: true,
          data: result,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Failed to update payment status',
        };
      }
    } catch (error) {
      console.error('Update payment status error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment status',
      };
    }
  }

  /**
   * Send payment confirmation notification
   */
  private async sendPaymentConfirmationNotification(order: ReceiptDetails, transactionId: string) {
    try {
      // TODO: Implement notification system (SMS/Email)
      console.log(`Payment confirmed for order ${order.receipt_id} with transaction ${transactionId}`);

      // For now, just log the notification
      const notification = {
        receiptId: order.receipt_id,
        customerPhone: order.customer_phone,
        transactionId,
        amount: order.total_amount,
        timestamp: new Date().toISOString(),
      };

      console.log('Payment confirmation notification:', notification);
    } catch (error) {
      console.error('Send notification error:', error);
    }
  }
}

// Export singleton instance
export const orderManager = OrderManager.getInstance();

// Re-export for webhook usage
export const updateOrderPaymentStatus = orderManager.updateOrderPaymentStatus.bind(orderManager);