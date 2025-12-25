"use client";

import React from "react";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";

export function GripFooter() {
  const { shopDetails } = useShopStore();

  const shopName = shopDetails?.shop_name || "Store";
  const logoUrl = shopDetails?.image_url;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo */}
          {logoUrl ? (
            <FallbackImage
              src={logoUrl}
              alt={shopName}
              width={150}
              height={60}
              className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <span className="text-2xl md:text-3xl font-bold">{shopName}</span>
          )}

          {/* Contact Info */}
          {(shopDetails?.shop_email || shopDetails?.shop_phone) && (
            <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400">
              {shopDetails.shop_email && (
                <a
                  href={`mailto:${shopDetails.shop_email}`}
                  className="hover:text-white transition-colors"
                >
                  {shopDetails.shop_email}
                </a>
              )}
              {shopDetails.shop_email && shopDetails.shop_phone && (
                <span className="hidden sm:inline">•</span>
              )}
              {shopDetails.shop_phone && (
                <a
                  href={`tel:${shopDetails.shop_phone}`}
                  className="hover:text-white transition-colors"
                >
                  {shopDetails.shop_phone}
                </a>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gray-700" />

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {currentYear} {shopName}. All rights reserved.
          </p>

          {/* Powered by */}
          <p className="text-xs text-gray-600">
            Powered by{" "}
            <a
              href="https://zatiq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-landing-primary hover:underline"
            >
              Zatiq
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default GripFooter;
