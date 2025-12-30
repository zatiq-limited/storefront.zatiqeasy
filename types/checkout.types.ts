import type { CartProduct } from "./cart.types";
import type { Division, District, Upazila } from "./shop.types";

// Checkout state for Zustand store
export interface CheckoutState {
  // Location selection
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;

  // Location data (from API)
  divisions: Division[];
  districts: Record<string, District[]>;
  upazilas: Record<string, Record<string, Upazila[]>>;

  // Payment
  selectedPaymentMethod: PaymentMethod;
  isFullOnlinePayment: boolean;

  // Promo
  promoCode: PromoCode | null;
  promoCodeSearch: string;
  promoCodeMessage: string;
  discountAmount: number;

  // Customer
  fullPhoneNumber: string;
  countryCallingCode: string;
  isPhoneVerified: boolean;

  // Terms
  acceptedTerms: boolean;
}

// Checkout actions
export interface CheckoutActions {
  setSelectedDivision: (division: string) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedUpazila: (upazila: string) => void;
  setSelectedDeliveryZone: (zone: string) => void;
  setDivisions: (divisions: Division[]) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  setIsFullOnlinePayment: (isFull: boolean) => void;
  setPromoCode: (code: PromoCode | null) => void;
  setPromoCodeSearch: (search: string) => void;
  setPromoCodeMessage: (message: string) => void;
  setDiscountAmount: (amount: number) => void;
  setFullPhoneNumber: (phone: string) => void;
  setCountryCallingCode: (code: string) => void;
  setIsPhoneVerified: (verified: boolean) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  resetCheckout: () => void;
}

// Payment methods
export type PaymentMethod =
  | "cod"
  | "bkash"
  | "nagad"
  | "aamarpay"
  | "partial_payment"
  | "zatiq_seller_pay"
  | "self_mfs";

// Promo code
export interface PromoCode {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount?: number;
  is_active: boolean;
  expires_at?: string;
}

// Checkout form data
export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  email?: string;
  customer_address: string;
  division?: string;
  district?: string;
  upazila?: string;
  delivery_zone?: string;
  note?: string;
  mfs_provider?: string;
  mfs_payment_phone?: string;
  mfs_transaction_id?: string;
}

// Checkout calculations
export interface CheckoutCalculations {
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  advancePayment: number;
  dueAmount: number;
}

// Delivery charge calculation params
export interface DeliveryChargeParams {
  products: CartProduct[];
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;
  specificDeliveryCharges: Record<string, number>;
  othersDeliveryCharge: number;
}
