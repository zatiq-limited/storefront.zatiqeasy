/**
 * Analytics API Service
 * Track analytics events (Facebook Pixel, GTM, TikTok, etc.)
 */

import { apiClient } from "../client";
import type { AnalyticsEvent, AnalyticsResponse } from "../types";

export const analyticsService = {
  /**
   * Track analytics event
   */
  async trackEvent(event: AnalyticsEvent): Promise<AnalyticsResponse> {
    try {
      // In production, send to analytics API
      await apiClient.post("/api/analytics/track", {
        ...event,
        timestamp: event.timestamp || Date.now(),
      });

      return {
        success: true,
        message: "Event tracked successfully",
      };
    } catch (error) {
      // Analytics errors should not break the app
      // Log in development but fail silently in production
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
        console.error("Analytics tracking error:", error);
      }
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to track event",
      };
    }
  },

  /**
   * Track page view
   */
  async trackPageView(
    shopId: string | number,
    url: string,
    title?: string
  ): Promise<AnalyticsResponse> {
    return this.trackEvent({
      event_type: "page_view",
      shop_id: shopId,
      data: {
        url,
        title: title || document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      },
    });
  },

  /**
   * Track product view
   */
  async trackProductView(
    shopId: string | number,
    productId: string | number,
    productName: string,
    price: number
  ): Promise<AnalyticsResponse> {
    return this.trackEvent({
      event_type: "product_view",
      shop_id: shopId,
      data: {
        product_id: productId,
        product_name: productName,
        price,
      },
    });
  },

  /**
   * Track add to cart
   */
  async trackAddToCart(
    shopId: string | number,
    productId: string | number,
    productName: string,
    price: number,
    quantity: number
  ): Promise<AnalyticsResponse> {
    return this.trackEvent({
      event_type: "add_to_cart",
      shop_id: shopId,
      data: {
        product_id: productId,
        product_name: productName,
        price,
        quantity,
        total: price * quantity,
      },
    });
  },

  /**
   * Track checkout initiation
   */
  async trackCheckoutInit(
    shopId: string | number,
    totalAmount: number,
    itemCount: number
  ): Promise<AnalyticsResponse> {
    return this.trackEvent({
      event_type: "checkout_init",
      shop_id: shopId,
      data: {
        total_amount: totalAmount,
        item_count: itemCount,
      },
    });
  },

  /**
   * Track purchase
   */
  async trackPurchase(
    shopId: string | number,
    orderId: string | number,
    totalAmount: number,
    paymentMethod: string
  ): Promise<AnalyticsResponse> {
    return this.trackEvent({
      event_type: "purchase",
      shop_id: shopId,
      data: {
        order_id: orderId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      },
    });
  },
};
