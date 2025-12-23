/**
 * API Services - Main Export
 * Centralized API access point
 *
 * Usage:
 * import { shopService, orderService, paymentService } from '@/lib/api';
 *
 * const profile = await shopService.getProfile({ shop_id: '123' });
 * const order = await orderService.createOrder(payload);
 */

// Export API client
export { apiClient, default as client } from "./client";

// Export all types
export * from "./types";

// Export all services
export { shopService } from "./services/shop.service";
export { orderService } from "./services/order.service";
export { paymentService } from "./services/payment.service";
export { otpService } from "./services/otp.service";
export { contactService } from "./services/contact.service";
export { analyticsService } from "./services/analytics.service";

// Convenience exports for common operations
export const api = {
  shop: () => import("./services/shop.service").then((m) => m.shopService),
  order: () => import("./services/order.service").then((m) => m.orderService),
  payment: () =>
    import("./services/payment.service").then((m) => m.paymentService),
  otp: () => import("./services/otp.service").then((m) => m.otpService),
  contact: () =>
    import("./services/contact.service").then((m) => m.contactService),
  analytics: () =>
    import("./services/analytics.service").then((m) => m.analyticsService),
};
