/**
 * API Service Types
 * Centralized type definitions for all API services
 */

// ============================================
// Shop Service Types
// ============================================

export interface ShopProfile {
  id: string | number;
  shop_uuid: string;
  shop_name: string;
  shop_description?: string;
  image_url?: string;
  currency_code?: string;
  country_currency?: string;
  shop_email?: string;
  shop_phone?: string;
  message_on_top?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  shop_theme?: {
    theme: string;
    enable_buy_now_on_product_card?: boolean;
    singleProductTheme?: boolean;
  };
  metadata?: {
    settings?: {
      shop_settings?: {
        enable_product_image_download?: boolean;
      };
    };
  };
  pixel_id?: string;
  gtm_id?: string;
  tiktok_pixel_id?: string;
  hasPixelAccess?: boolean;
  hasGTMAccess?: boolean;
  hasTikTokPixelAccess?: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  old_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  quantity: number;
  category_id?: string;
  category_name?: string;
  sku?: string;
  has_variant?: boolean;
  variant_types?: any[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: number | string | null;
  sub_categories?: Category[];
}

// ============================================
// Order Service Types
// ============================================

export interface OrderItem {
  inventory_id: number;
  name: string;
  qty: number;
  price: number;
  image_url?: string;
  variants?: {
    variant_type_id?: number;
    variant_id?: number;
  }[];
}

export interface CreateOrderPayload {
  shop_id: number | string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_charge: number;
  delivery_zone?: string;
  tax_amount: number;
  tax_percentage?: number;
  total_amount: number;
  payment_type: string;
  pay_now_amount: number;
  advance_payment_amount?: number;
  discount_amount?: number;
  discount_percentage?: number;
  shop_promo_code_id?: string;
  receipt_items: OrderItem[];
  type?: string;
  status?: string;
  notes?: string;
  email?: string;
  district?: string;
  redirect_root_url?: string;
  mfs_payment_phone?: string;
  mfs_transaction_id?: string;
  mfs_provider?: string;
}

export interface OrderResponse {
  success: boolean;
  data?: {
    payment_url?: string;
    receipt_id?: string | number;
    receipt_url?: string;
    [key: string]: any;
  };
  error?: string;
}

// ============================================
// Payment Service Types
// ============================================

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface PaymentProcessPayload {
  receipt_id: string | number;
  pay_now_amount: number;
  payment_type?: string;
  redirect_root_url?: string;
  mfs_payment_phone?: string;
  mfs_provider?: string;
}

export interface PaymentProcessResponse {
  success: boolean;
  data?: {
    payment_url?: string;
    transaction_id?: string;
    [key: string]: any;
  };
  error?: string;
}

export interface ReceiptDetails {
  receipt_id: string | number;
  shop_id: string | number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  due_amount: number;
  payment_status: string;
  items: OrderItem[];
  [key: string]: any;
}

// ============================================
// OTP Service Types
// ============================================

export interface SendOTPRequest {
  shop_id: number | string;
  phone: string;
}

export interface SendOTPResponse {
  status: boolean;
  message: string;
  data?: {
    otp_id?: string;
    expires_at?: number;
  };
}

export interface VerifyOTPRequest {
  shop_id: number | string;
  phone: string;
  otp: string;
}

export interface VerifyOTPResponse {
  status: boolean;
  message: string;
  data?: {
    verified_at?: number;
    expires_at?: number;
  };
}

export interface ResendOTPRequest {
  shop_id: number | string;
  phone: string;
}

export interface ResendOTPResponse {
  status: boolean;
  message: string;
  data?: {
    otp_id?: string;
    expires_at?: number;
  };
}

// ============================================
// Contact Service Types
// ============================================

export interface ContactFormPayload {
  shop_id: number | string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

// ============================================
// Analytics Service Types
// ============================================

export interface AnalyticsEvent {
  event_type: string;
  shop_id: number | string;
  customer_id?: string;
  data: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsResponse {
  success: boolean;
  message?: string;
}

// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}
