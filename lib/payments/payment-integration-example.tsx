/**
 * Example of how to properly integrate bKash payment with the checkout flow
 * This matches the implementation pattern from the old storefront.zatiqeasy.com project
 */

"use client";

import { useState } from 'react';
import { PaymentMethodSelector } from '@/components/payments/payment-method-selector';
import { orderManager } from '@/lib/orders/order-manager';
import { PaymentType } from '@/lib/payments/types';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';

/**
 * Complete Checkout with Payment Integration
 */
export function CheckoutWithPayment() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const cart = useCartStore();
  const { checkoutData } = useCheckoutStore();

  /**
   * Step 1: Create order first, then handle payment
   * This matches the old project's flow where order creation returns payment URL
   */
  const handlePlaceOrder = async () => {
    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      // Validate required fields
      if (!checkoutData.customerName || !checkoutData.customerPhone || !checkoutData.customerAddress) {
        throw new Error('Please fill in all required fields');
      }

      // Create order with selected payment method
      const orderResponse = await orderManager.createOrderFromCart(cart, {
        customerName: checkoutData.customerName,
        customerPhone: checkoutData.customerPhone,
        customerAddress: checkoutData.customerAddress,
        paymentType: checkoutData.selectedPaymentMethod || PaymentType.COD,
        shopId: 1, // This should come from shop context
        deliveryChargeInsideDhaka: 60,
        deliveryChargeOutsideDhaka: 120,
        taxPercentage: 0,
        note: checkoutData.note,
      });

      if (orderResponse.success && orderResponse.data) {
        const order = orderResponse.data;

        // Store order details
        setCreatedOrder(order);

        // Clear cart on successful order creation
        cart.clearCart();

        // Handle different payment scenarios
        if (order.payment_url) {
          // For gateway payments (bKash, Nagad, AamarPay), redirect to payment URL
          // This matches the old project's flow
          window.location.replace(order.payment_url);
        } else if (order.receipt_url) {
          // For COD or successful orders without payment URL
          window.location.href = `/payment-confirm?status=success&receipt_url=${order.receipt_url}`;
        } else {
          // Fallback: go to receipt page
          window.location.href = `/receipt/${order.receipt_id}`;
        }
      } else {
        throw new Error(orderResponse.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      setOrderError(error.message || 'Failed to place order');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  /**
   * Step 2: Handle payment redirect (alternative flow)
   * This is used if you want to create order first, then show payment options
   */
  const handlePaymentRedirect = (paymentUrl: string) => {
    // Redirect to payment gateway
    window.location.replace(paymentUrl);
  };

  /**
   * Step 3: Handle payment success
   */
  const handlePaymentSuccess = (transactionId: string) => {
    // This is called when payment is successful
    // In most cases, the redirect handles this, but you can use it for:
    // - Analytics tracking
    // - Custom success handling
    // - Additional order processing

    if (createdOrder) {
      window.location.href = `/payment-confirm?status=success&receipt_url=${createdOrder.receipt_id}`;
    }
  };

  /**
   * Step 4: Handle payment error
   */
  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setOrderError(error.message);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Error Display */}
      {orderError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {orderError}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>৳{cart.getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>৳60</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>৳{cart.getTotal() + 60}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <p>{checkoutData.customerName || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <p>{checkoutData.customerPhone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <p>{checkoutData.customerAddress || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Two different integration approaches: */}

      {/* APPROACH 1: Create Order First (Recommended - matches old project) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <PaymentMethodSelector
          amount={cart.getTotal() + 60}
          // Don't pass receiptId here as order hasn't been created yet
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

        <button
          onClick={handlePlaceOrder}
          disabled={isCreatingOrder || cart.items.length === 0}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isCreatingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      {/* APPROACH 2: Alternative - Order Created First, Then Payment */}
      {/*
      {createdOrder && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Complete Payment</h3>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Order created successfully! Order ID: {createdOrder.receipt_id}
          </div>

          <PaymentMethodSelector
            amount={createdOrder.total_amount}
            receiptId={createdOrder.receipt_id}
            onPaymentRedirect={handlePaymentRedirect}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      )}
      */}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm">
        <h4 className="font-semibold mb-2">Payment Process:</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Select your preferred payment method</li>
          <li>Click "Place Order" to create your order</li>
          <li>You'll be redirected to the payment gateway (for bKash/Nagad/AamarPay)</li>
          <li>Complete payment on the payment page</li>
          <li>You'll be redirected back with order confirmation</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * Usage in a page:
 */
export default function CheckoutPage() {
  return (
    <CheckoutWithPayment />
  );
}