"use client";

import React from "react";
import { ShoppingCart, Tag, Shield } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";
import type { InventoryProduct } from "@/types/inventory.types";
import { useShopStore } from "@/stores/shopStore";

interface NirvanaProductPricingProps {
  product: InventoryProduct | null | undefined;
  content?: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function NirvanaProductPricing({ product, content, onBuyNow }: NirvanaProductPricingProps) {
  const { shopDetails } = useShopStore();

  const currency = shopDetails?.country_currency || "BDT";
  const isBuyNow = (content?.link ?? "buy-now") === "buy-now";

  const handleBuyNow = () => {
    if (!product) return;
    onBuyNow?.(isBuyNow ? "buy-now" : content?.link || null);
  };

  if (!product?.price) {
    return null;
  }

  const discountPercentage = product.old_price
    ? Math.round(((product.old_price - (product.price || 0)) / product.old_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4">
      <div className="relative mt-10 py-10 md:py-20 rounded-3xl">
        {/* Price Display Section */}
        <div className="relative space-y-6">
          <div className="flex flex-col items-center">
            {product.old_price && (
              <div className="flex items-center gap-3 group">
                <Tag className="w-5 h-5 text-red-500 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                <h2 className="text-2xl sm:text-3xl font-medium text-red-400 line-through group-hover:text-red-500 transition-colors duration-300">
                  Price {product.old_price} {currency}
                </h2>
                <span className="px-3 py-1 text-sm font-semibold text-red-500 bg-red-50 rounded-full transform hover:scale-105 transition-transform duration-300">
                  Save {discountPercentage}%
                </span>
              </div>
            )}

            {product.price && (
              <div className="relative group pt-3 md:pt-5">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-5 rounded-xl blur transition-opacity duration-300" />
                <h2 className="leading-tight text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent tracking-tight group-hover:tracking-normal transition-all duration-300">
                  {product.old_price ? "Discount Price" : "Price"}
                  <span className="inline-flex items-center gap-3 ml-3">
                    {product.price} {currency}
                  </span>
                </h2>
              </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-gray-500 mt-2 md:mt-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Product Image */}
        {content?.image_url && (
          <div className="relative mt-10 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <FallbackImage
              src={content.image_url}
              alt={product.name || "Product"}
              width={903}
              height={317}
              className="w-full aspect-[903/317] object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500"
            />
          </div>
        )}

        {/* Buy Now Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleBuyNow}
            className="group relative overflow-hidden inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-landing-primary to-landing-secondary hover:from-landing-primary hover:to-landing-secondary rounded-full transform hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <ShoppingCart className="w-7 h-7 text-white transform group-hover:rotate-12 transition-transform duration-300 ease-out" />
            <span className="text-2xl font-bold text-white tracking-wide group-hover:tracking-wider transition-all duration-300">
              {content?.button_text ?? "Buy Now"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NirvanaProductPricing;
