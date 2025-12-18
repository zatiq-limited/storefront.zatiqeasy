import type { VariantsState } from './cart.types';
import type { PaymentMethod } from './checkout.types';

// Order placement payload
export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  division?: string;
  district?: string;
  upazila?: string;
  delivery_zone?: string;
  payment_method: PaymentMethod;
  note?: string;
  promo_code_id?: number;
  visitor_id?: string;
  products: OrderProduct[];
}

// Order product in payload
export interface OrderProduct {
  inventory_id: number;
  quantity: number;
  selected_variants: VariantsState;
  price?: number;
}

// Order response from API
export interface OrderResponse {
  success: boolean;
  message?: string;
  data?: {
    order_id: number;
    receipt_id: string;
    track_link?: string;
    payment_url?: string;
    total_amount: number;
    advance_amount?: number;
    due_amount?: number;
  };
  error?: string;
}

// Receipt/Order details
export interface Receipt {
  id: number;
  receipt_id: string;
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  division?: string;
  district?: string;
  upazila?: string;
  delivery_zone?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatusType;
  note?: string;
  subtotal: number;
  delivery_charge: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  advance_amount: number;
  due_amount: number;
  track_link?: string;
  items: ReceiptItem[];
  created_at: string;
  updated_at: string;
}

// Receipt item
export interface ReceiptItem {
  id: number;
  inventory_id: number;
  inventory_name: string;
  inventory_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_variants?: VariantsState;
}

// Payment status
export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'partially_paid'
  | 'failed'
  | 'refunded';

// Order status
export type OrderStatusType =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

// Phone verification
export interface PhoneVerificationPayload {
  phone: string;
  country_code: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message?: string;
  otp_sent?: boolean;
}

export interface OTPVerificationPayload {
  phone: string;
  country_code: string;
  otp: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message?: string;
  verified?: boolean;
}
