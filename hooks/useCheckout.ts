/**
 * Checkout Hook
 * Handles checkout logic, validation, and API calls
 * Integrates with cartStore, checkoutStore, and shopStore
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useCartStore, selectCartProducts, selectSubtotal } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useShopStore } from "@/stores/shopStore";
import { orderService } from "@/lib/api/services/order.service";
import type { CreateOrderPayload, OrderItem, OrderResponse } from "@/lib/api/types";
import type { CartProduct } from "@/types";

// Checkout result types
interface CheckoutResult {
  success: boolean;
  receiptId?: string | number;
  paymentUrl?: string;
  receiptUrl?: string;
  error?: string;
}

// Checkout validation errors
interface ValidationErrors {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  cartEmpty?: string;
  acceptTerms?: string;
}

// Hook options
interface UseCheckoutOptions {
  onSuccess?: (result: CheckoutResult) => void;
  onError?: (error: string) => void;
  redirectUrl?: string;
}

export function useCheckout(options: UseCheckoutOptions = {}) {
  const { onSuccess, onError, redirectUrl } = options;

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [lastResult, setLastResult] = useState<CheckoutResult | null>(null);

  // Get data from stores
  const cartProducts = useCartStore(selectCartProducts);
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    customerName,
    customerEmail,
    fullPhoneNumber,
    fullAddress,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    selectedPaymentMethod,
    isFullOnlinePayment,
    promoCode,
    discountAmount,
    acceptedTerms,
    resetCheckout,
  } = useCheckoutStore();

  const { shopDetails } = useShopStore();

  // Calculate delivery charge based on zone
  const deliveryCharge = useMemo(() => {
    if (!shopDetails) return 0;

    const specificCharges = shopDetails.specific_delivery_charges || {};
    const zone = selectedDeliveryZone || "Others";

    // Check for specific zone charge
    if (specificCharges[zone] !== undefined) {
      return specificCharges[zone];
    }

    // Use "Others" charge or default
    return shopDetails.others_delivery_charge || 0;
  }, [shopDetails, selectedDeliveryZone]);

  // Calculate tax
  const taxAmount = useMemo(() => {
    if (!shopDetails?.vat_tax) return 0;
    return (subtotal * shopDetails.vat_tax) / 100;
  }, [subtotal, shopDetails?.vat_tax]);

  // Calculate advance payment amount based on shop settings
  const advancePaymentAmount = useMemo(() => {
    if (!shopDetails || selectedPaymentMethod === "cod") return 0;

    const total = subtotal + deliveryCharge + taxAmount - discountAmount;

    // Full online payment
    if (isFullOnlinePayment) return total;

    const advanceType = shopDetails.advance_payment_type;

    switch (advanceType) {
      case "Full Payment":
        return total;
      case "Delivery Charge Only":
        return deliveryCharge;
      case "Percentage":
      case "percentage":
        const percentage = shopDetails.advanced_payment_percentage || 0;
        return Math.ceil((total * percentage) / 100);
      case "Fixed Amount":
      case "fixed":
        return shopDetails.advanced_payment_fixed_amount || 0;
      default:
        return 0;
    }
  }, [
    shopDetails,
    selectedPaymentMethod,
    isFullOnlinePayment,
    subtotal,
    deliveryCharge,
    taxAmount,
    discountAmount,
  ]);

  // Total amount
  const totalAmount = useMemo(() => {
    return subtotal + deliveryCharge + taxAmount - discountAmount;
  }, [subtotal, deliveryCharge, taxAmount, discountAmount]);

  // Validate checkout data
  const validate = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (cartProducts.length === 0) {
      errors.cartEmpty = "Your cart is empty";
    }

    if (!customerName?.trim()) {
      errors.customerName = "Name is required";
    }

    if (!fullPhoneNumber?.trim()) {
      errors.customerPhone = "Phone number is required";
    }

    if (!fullAddress?.trim()) {
      errors.customerAddress = "Address is required";
    }

    if (!acceptedTerms) {
      errors.acceptTerms = "Please accept the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [cartProducts.length, customerName, fullPhoneNumber, fullAddress, acceptedTerms]);

  // Transform cart products to order items
  const transformCartToOrderItems = useCallback(
    (products: CartProduct[]): OrderItem[] => {
      return products.map((product) => {
        const variants = product.selectedVariants
          ? Object.entries(product.selectedVariants).map(([typeId, variantId]) => ({
              variant_type_id: Number(typeId),
              variant_id: Number(variantId),
            }))
          : [];

        return {
          inventory_id: Number(product.id),
          name: product.name,
          qty: product.qty,
          price: product.price,
          image_url: product.image_url,
          variants,
        };
      });
    },
    []
  );

  // Place order function
  const placeOrder = useCallback(async (): Promise<CheckoutResult> => {
    // Reset states
    setError(null);
    setLastResult(null);

    // Validate
    if (!validate()) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Ensure shop is loaded
    if (!shopDetails?.id) {
      const errorMsg = "Shop information not available";
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);

    try {
      // Build order payload
      const payload: CreateOrderPayload = {
        shop_id: shopDetails.id,
        customer_name: customerName.trim(),
        customer_phone: fullPhoneNumber.trim(),
        customer_address: fullAddress.trim(),
        delivery_charge: deliveryCharge,
        delivery_zone: selectedDeliveryZone || "Others",
        tax_amount: taxAmount,
        tax_percentage: shopDetails.vat_tax || 0,
        total_amount: totalAmount,
        payment_type: selectedPaymentMethod,
        pay_now_amount: advancePaymentAmount,
        advance_payment_amount: advancePaymentAmount > 0 ? advancePaymentAmount : undefined,
        discount_amount: discountAmount > 0 ? discountAmount : undefined,
        shop_promo_code_id: promoCode?.id?.toString(),
        receipt_items: transformCartToOrderItems(cartProducts),
        type: "online",
        status: "pending",
        email: customerEmail?.trim() || undefined,
        district: selectedDistrict || undefined,
        redirect_root_url: redirectUrl || (typeof window !== "undefined" ? window.location.origin : undefined),
      };

      // Call API
      const response: OrderResponse = await orderService.createOrder(payload);

      if (response.success && response.data) {
        const result: CheckoutResult = {
          success: true,
          receiptId: response.data.receipt_id,
          paymentUrl: response.data.payment_url,
          receiptUrl: response.data.receipt_url,
        };

        setLastResult(result);

        // Clear cart on success
        clearCart();

        // Reset checkout state
        resetCheckout();

        // Call success callback
        onSuccess?.(result);

        // If there's a payment URL, redirect
        if (result.paymentUrl && typeof window !== "undefined") {
          window.location.href = result.paymentUrl;
        }

        return result;
      } else {
        const errorMsg = response.error || "Failed to place order";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [
    validate,
    shopDetails,
    customerName,
    fullPhoneNumber,
    fullAddress,
    customerEmail,
    deliveryCharge,
    selectedDeliveryZone,
    selectedDistrict,
    taxAmount,
    totalAmount,
    selectedPaymentMethod,
    advancePaymentAmount,
    discountAmount,
    promoCode,
    cartProducts,
    redirectUrl,
    transformCartToOrderItems,
    clearCart,
    resetCheckout,
    onSuccess,
    onError,
  ]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setValidationErrors({});
  }, []);

  return {
    // Actions
    placeOrder,
    validate,
    clearError,

    // State
    isLoading,
    error,
    validationErrors,
    lastResult,

    // Calculated values
    subtotal,
    deliveryCharge,
    taxAmount,
    discountAmount,
    advancePaymentAmount,
    totalAmount,

    // Checkout data (for display)
    customerName,
    customerEmail,
    customerPhone: fullPhoneNumber,
    customerAddress: fullAddress,
    paymentMethod: selectedPaymentMethod,

    // Cart info
    cartItemCount: cartProducts.length,
    isCartEmpty: cartProducts.length === 0,
  };
}

// Legacy interface for backward compatibility
interface CheckoutData {
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shipping: {
    address: string;
    division: string;
    district: string;
    upazila: string;
    postal_code: string;
  };
  items: CartProduct[];
  payment_method: string;
  notes: string;
}

// Legacy function for direct API calls (backward compatibility)
export async function placeOrderDirect(
  data: CheckoutData,
  shopId: number | string
): Promise<CheckoutResult> {
  const payload: CreateOrderPayload = {
    shop_id: shopId,
    customer_name: data.customer.name,
    customer_phone: data.customer.phone,
    customer_address: `${data.shipping.address}, ${data.shipping.upazila}, ${data.shipping.district}, ${data.shipping.division}`,
    email: data.customer.email,
    delivery_charge: 0, // Should be calculated based on zone
    delivery_zone: "Others",
    tax_amount: 0,
    total_amount: data.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    payment_type: data.payment_method,
    pay_now_amount: 0,
    receipt_items: data.items.map((item) => ({
      inventory_id: Number(item.id),
      name: item.name,
      qty: item.qty,
      price: item.price,
      image_url: item.image_url,
    })),
    notes: data.notes,
  };

  const response = await orderService.createOrder(payload);

  if (response.success && response.data) {
    return {
      success: true,
      receiptId: response.data.receipt_id,
      paymentUrl: response.data.payment_url,
      receiptUrl: response.data.receipt_url,
    };
  }

  return {
    success: false,
    error: response.error || "Failed to place order",
  };
}
