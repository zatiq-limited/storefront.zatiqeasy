"use client";

import React from "react";
import { CheckCircle, Package } from "lucide-react";
import { useLandingStore } from "@/stores/landingStore";
import { useShopStore } from "@/stores/shopStore";

export function GripOrderStatus() {
  const { orderPlaced, orderId, trackLink, clearOrderState } =
    useLandingStore();
  const { shopDetails } = useShopStore();

  if (!orderPlaced || !orderId) {
    return null;
  }

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <h3 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-400 mb-2">
            Order Placed Successfully!
          </h3>

          <p className="text-green-700 dark:text-green-300 mb-4">
            Thank you for your order. Your order ID is{" "}
            <span className="font-semibold">#{orderId}</span>
          </p>

          {/* Order Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {/* Track Order Button */}
            {trackLink && (
              <a
                href={trackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Package className="w-5 h-5" />
                Track Order
              </a>
            )}

            {/* View Receipt Button */}
            <a
              href={`${baseUrl}/receipt/${orderId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 font-medium rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Receipt
            </a>
          </div>

          {/* New Order Button */}
          <button
            onClick={() => {
              clearOrderState();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-6 text-sm text-green-600 dark:text-green-400 hover:underline cursor-pointer"
          >
            Place another order
          </button>
        </div>
      </div>
    </div>
  );
}

export default GripOrderStatus;
