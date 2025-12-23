// Payment Gateway Types
export enum PaymentType {
  BKASH = "bkash",
  NAGAD = "nagad",
  AAMARPAY = "aamarpay",
  COD = "cod",
  SELF_MFS = "self_mfs",
  ZATIQ_SECURE = "zatiq_secure",
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum OrderStatus {
  ORDER_PLACED = "Order Placed",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

// Order/Receipt Types
export interface OrderItem {
  name: string;
  price: number;
  image_url?: string;
  inventory_id: string | number;
  qty: number;
  warranty?: string;
  variants?: {
    variant_type_id?: string | number;
    variant_id?: string | number;
  }[];
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface CreateOrderPayload {
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  email?: string;
  delivery_charge: number;
  delivery_zone?: string;
  tax_amount: number;
  tax_percentage?: number;
  total_amount: number;
  discount_amount?: number;
  pay_now_amount: number;
  advance_payment_amount?: number;
  payment_type: PaymentType | string;
  redirect_root_url?: string;
  receipt_items: OrderItem[];
  type?: "Online" | "Offline";
  status?: OrderStatus | string;
  note?: string;
  // For Self MFS
  mfs_payment_phone?: string;
  mfs_transaction_id?: string;
  mfs_provider?: string;
}

export interface OrderResponse {
  success: boolean;
  data?: {
    id: number;
    receipt_id: string;
    receipt_url?: string;
    payment_url?: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
  };
  error?: string;
}

// Payment Processing Types
export interface PaymentProcessPayload {
  receipt_id: string;
  pay_now_amount: number;
  redirect_root_url: string;
}

export interface PaymentProcessResponse {
  success: boolean;
  data?: {
    payment_url: string;
    transaction_id?: string;
  };
  error?: string;
}

// Receipt/Order Details
export interface ReceiptDetails {
  id: number;
  receipt_id: string;
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_charge: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_type: PaymentType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  receipt_items: OrderItem[];
  created_at: string;
  updated_at: string;
  transaction_id?: string;
  payment_details?: {
    gateway_transaction_id?: string;
    gateway_response?: Record<string, unknown>;
    paid_at?: string;
  };
}

// Payment Gateway Specific Types
export interface BkashPaymentResponse {
  paymentID: string;
  paymentCreateTime: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface NagadPaymentResponse {
  orderId: string;
  payment_ref_id: string;
  amount: string;
  client_mobile_no: string;
  merchant_mobile_no: string;
  order_status: string;
  error_code?: string;
  error_message?: string;
}

export interface AamarPayPaymentResponse {
  pay_id: string;
  tran_id: string;
  val_id: string;
  amount: string;
  store_amount: string;
  card_type: string;
  card_issuer: string;
  card_brand: string;
  card_issuer_country: string;
  card_sub_brand: string;
  currency: string;
  bank_tran_id: string;
  status: string;
  error_code?: string;
  error_message?: string;
}

// Webhook Types
export interface PaymentWebhook {
  gateway: PaymentType;
  event_type: string;
  data: {
    receipt_id: string;
    transaction_id: string;
    amount: number;
    status: PaymentStatus;
    signature?: string;
    timestamp: string;
    raw_response: Record<string, unknown>;
  };
}

// API Response Wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Payment Gateway Config
export interface PaymentGatewayConfig {
  enabled: boolean;
  test_mode: boolean;
  merchant_id?: string;
  merchant_username?: string;
  merchant_password?: string;
  app_key?: string;
  app_secret?: string;
  api_base_url?: string;
  webhook_url?: string;
  callback_url?: string;
}

// Store Configuration for Payment
export interface PaymentConfig {
  accepted_payment_types: PaymentType[];
  advance_payment_enabled: boolean;
  advance_payment_percentage?: number;
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
  tax_enabled: boolean;
  tax_percentage?: number;
  order_confirmation_enabled: boolean;
  order_confirmation_email?: string;
  order_confirmation_sms?: boolean;
}
