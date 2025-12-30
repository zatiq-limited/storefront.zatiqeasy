"use client";

import { ShoppingCart, ArrowRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";

export function ArcadiaCheckoutRedirect() {
  const { shopDetails } = useShopStore();
  const cartProducts = useCartStore((state) => state.products);

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";
  const cartCount = Object.keys(cartProducts).length;

  // Calculate total
  const totalAmount = Object.values(cartProducts).reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  if (cartCount === 0) {
    return null;
  }

  const handleCheckout = () => {
    window.location.href = `${baseUrl}/checkout`;
  };

  return (
    <section className="py-12 md:py-20 bg-linear-to-br from-violet-50 via-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-landing-primary/10 rounded-full">
              <ShoppingCart className="w-8 h-8 text-landing-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Checkout?
            </h2>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <span className="text-gray-600">Items in Cart</span>
              <span className="font-semibold text-gray-900">{cartCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-landing-primary">
                {totalAmount.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-landing-primary to-blue-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Security Note */}
          <p className="mt-6 text-sm text-gray-500">
            🔒 Secure checkout with multiple payment options
          </p>
        </div>
      </div>
    </section>
  );
}

export default ArcadiaCheckoutRedirect;
