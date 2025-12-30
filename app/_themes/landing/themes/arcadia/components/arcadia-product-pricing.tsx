"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useLandingProduct } from "../../../context/landing-product-context";

interface ArcadiaProductPricingProps {
  onBuyNow?: (link: string | null) => void;
}

export function ArcadiaProductPricing({
  onBuyNow,
}: ArcadiaProductPricingProps) {
  const { shopDetails } = useShopStore();
  const { product, productPricing } = useLandingProduct();

  const currency = shopDetails?.country_currency || "BDT";

  // Calculate discount percentage
  const discountPercentage =
    product?.old_price && product.old_price > product.price
      ? Math.floor(
          ((product.old_price - product.price) / product.old_price) * 100
        )
      : 0;

  // Only show if there's a discount
  if (!discountPercentage || discountPercentage <= 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-28 bg-linear-to-br from-white to-violet-50">
      <div className="container px-4 text-center">
        <div className="bg-landing-primary/10 p-8 rounded-2xl backdrop-blur-lg max-w-2xl mx-auto">
          {/* Badge */}
          <span className="text-sm font-semibold bg-white/60 px-4 py-1 rounded-full text-landing-primary">
            FLASH SALE
          </span>

          {/* Title */}
          <h2 className="text-4xl font-bold mt-4 mb-2 text-gray-900">
            Special Offer
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-gray-700">
            Limited time offer -{" "}
            <span className="font-bold">Save {discountPercentage}% Today!</span>
          </p>

          {/* Price */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-4xl sm:text-6xl font-bold text-gray-900">
              {productPricing.currentPrice} {currency}
            </span>
            <div className="text-center sm:text-left">
              <span className="text-xl sm:text-2xl line-through opacity-75 font-bold text-gray-600">
                {product?.old_price} {currency}
              </span>
              <p className="text-sm font-bold text-landing-primary">
                {discountPercentage}% OFF
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-3 md:mt-4 xl:mt-6">
            <button
              onClick={() => onBuyNow?.("buy-now")}
              className="flex items-center gap-4 lg:gap-6 py-4 md:py-5 xl:py-6 px-10 md:px-14 xl:px-16 bg-landing-primary rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12 text-white" />
              <span className="text-xl lg:text-2xl 2xl:text-3xl font-bold text-white leading-none">
                Buy Now
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArcadiaProductPricing;
