import { PaymentType, PaymentStatus, OrderStatus } from './types';

/**
 * Format price in BDT
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (type: PaymentType): string => {
  const names: Record<PaymentType, string> = {
    [PaymentType.BKASH]: 'bKash',
    [PaymentType.NAGAD]: 'Nagad',
    [PaymentType.AAMARPAY]: 'AamarPay',
    [PaymentType.COD]: 'Cash on Delivery',
    [PaymentType.SELF_MFS]: 'Self MFS',
    [PaymentType.ZATIQ_SECURE]: 'Zatiq Secure',
  };
  return names[type] || type;
};

/**
 * Get payment method display color
 */
export const getPaymentMethodColor = (type: PaymentType): string => {
  const colors: Record<PaymentType, string> = {
    [PaymentType.BKASH]: '#e2136e', // bKash pink
    [PaymentType.NAGAD]: '#ff6200', // Nagad orange
    [PaymentType.AAMARPAY]: '#0d47a1', // AamarPay blue
    [PaymentType.COD]: '#4caf50', // Green for COD
    [PaymentType.SELF_MFS]: '#7c4dff', // Purple for self MFS
    [PaymentType.ZATIQ_SECURE]: '#00bcd4', // Cyan for Zatiq
  };
  return colors[type] || '#666666';
};

/**
 * Check if payment method requires redirect
 */
export const isRedirectPayment = (type: PaymentType): boolean => {
  return [PaymentType.BKASH, PaymentType.NAGAD, PaymentType.AAMARPAY].includes(type);
};

/**
 * Check if payment method is a mobile financial service
 */
export const isMfsPayment = (type: PaymentType): boolean => {
  return [PaymentType.BKASH, PaymentType.NAGAD].includes(type);
};

/**
 * Get payment status display text
 */
export const getPaymentStatusText = (status: PaymentStatus): string => {
  const statusTexts: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pending',
    [PaymentStatus.PROCESSING]: 'Processing',
    [PaymentStatus.SUCCESS]: 'Paid',
    [PaymentStatus.FAILED]: 'Failed',
    [PaymentStatus.CANCELLED]: 'Cancelled',
    [PaymentStatus.REFUNDED]: 'Refunded',
  };
  return statusTexts[status] || status;
};

/**
 * Get payment status color
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: '#ff9800', // Orange
    [PaymentStatus.PROCESSING]: '#2196f3', // Blue
    [PaymentStatus.SUCCESS]: '#4caf50', // Green
    [PaymentStatus.FAILED]: '#f44336', // Red
    [PaymentStatus.CANCELLED]: '#9e9e9e', // Grey
    [PaymentStatus.REFUNDED]: '#9c27b0', // Purple
  };
  return colors[status] || '#666666';
};

/**
 * Get order status display text
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  return status;
};

/**
 * Get order status color
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    'Order Placed': '#ff9800', // Orange
    'Processing': '#2196f3', // Blue
    'Shipped': '#03a9f4', // Light Blue
    'Delivered': '#4caf50', // Green
    'Cancelled': '#f44336', // Red
  };
  return colors[status] || '#666666';
};

/**
 * Generate unique receipt ID
 */
export const generateReceiptId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ZQ${timestamp}${random}`.toUpperCase();
};

/**
 * Validate phone number for Bangladesh
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Bangladesh phone number regex
  const phoneRegex = /^(01[3-9]\d{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
};

/**
 * Calculate delivery charge based on address
 */
export const calculateDeliveryCharge = (
  address: string,
  insideDhakaCharge: number,
  outsideDhakaCharge: number
): number => {
  const dhakaAreas = [
    'dhaka', 'mirpur', 'dhanmondi', 'gulshan', 'banani', 'uttara', 'mohammadpur',
    'farmgate', 'shahbagh', 'new market', 'azampur', 'kawran bazar', 'bashundhara',
    'baridhara', 'badda', 'khilgaon', 'malibagh', 'mogbazar', 'tejgaon'
  ];

  const addressLower = address.toLowerCase();
  const isInsideDhaka = dhakaAreas.some(area => addressLower.includes(area));

  return isInsideDhaka ? insideDhakaCharge : outsideDhakaCharge;
};

/**
 * Calculate tax amount
 */
export const calculateTaxAmount = (total: number, taxPercentage: number): number => {
  return Math.round((total * taxPercentage) / 100);
};

/**
 * Generate transaction ID for payment methods
 */
export const generateTransactionId = (paymentType: PaymentType): string => {
  const prefix = paymentType.toUpperCase().substring(0, 2);
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Parse payment error message
 */
export const parsePaymentError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error.message) {
      return error.error.message;
    }
  }

  return 'Payment failed. Please try again.';
};

/**
 * Check if payment is successful based on status
 */
export const isPaymentSuccessful = (status: PaymentStatus): boolean => {
  return status === PaymentStatus.SUCCESS;
};

/**
 * Check if payment can be retried
 */
export const canRetryPayment = (status: PaymentStatus): boolean => {
  return [PaymentStatus.FAILED, PaymentStatus.CANCELLED].includes(status);
};

/**
 * Get payment method instructions for self MFS
 */
export const getSelfMfsInstructions = (type: PaymentType, phoneNumber: string, amount: number): string => {
  const formattedAmount = formatPrice(amount);

  if (type === PaymentType.BKASH) {
    return `1. Go to your bKash mobile menu
2. Select "Payment"
3. Enter merchant number: ${phoneNumber}
4. Enter amount: ${formattedAmount}
5. Enter your PIN to confirm
6. Save the transaction ID for verification`;
  }

  if (type === PaymentType.NAGAD) {
    return `1. Go to your Nagad mobile menu
2. Select "Send Money"
3. Enter merchant number: ${phoneNumber}
4. Enter amount: ${formattedAmount}
5. Enter your PIN to confirm
6. Save the transaction ID for verification`;
  }

  return 'Please contact merchant for payment instructions.';
};

/**
 * Create payment URL for redirect methods
 */
export const createPaymentUrl = (gateway: PaymentType, paymentId: string): string => {
  const urls: Record<PaymentType, string> = {
    [PaymentType.BKASH]: `https://checkout.pay.bkash.com/bkash-checkout/payment/${paymentId}`,
    [PaymentType.NAGAD]: `https://nagad.com.bd/payment/${paymentId}`,
    [PaymentType.AAMARPAY]: `https://secure.aamarpay.com/pay.php?id=${paymentId}`,
    [PaymentType.COD]: '',
    [PaymentType.SELF_MFS]: '',
    [PaymentType.ZATIQ_SECURE]: '',
  };

  return urls[gateway] || '';
};