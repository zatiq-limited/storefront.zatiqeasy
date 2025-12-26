"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";

export function ArcadiaNavbar() {
  const { shopDetails } = useShopStore();
  const cartProducts = useCartStore((state) => state.products);
  const cartCount = Object.keys(cartProducts).length;

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={baseUrl || "/"} className="flex items-center gap-3 group">
            {shopDetails?.image_url ? (
              <Image
                src={shopDetails.image_url}
                alt={shopDetails.shop_name || "Shop"}
                width={200}
                height={50}
                className="h-10 md:h-12 w-auto max-w-45 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="font-bold text-xl md:text-2xl text-landing-primary group-hover:text-landing-primary/80 transition-colors">
                {shopDetails?.shop_name || "Shop"}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            href={`${baseUrl}/cart`}
            className="relative p-2 md:p-3 rounded-full bg-linear-to-br from-blue-500 to-landing-primary text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default ArcadiaNavbar;
