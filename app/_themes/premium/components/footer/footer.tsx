"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";

export function PremiumFooter() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const baseUrl = shopDetails?.baseUrl || "";
  const shopName = shopDetails?.shop_name || "Shop";
  const shopLogo = shopDetails?.image_url;
  const shopAddress = shopDetails?.address;
  const shopPhone = shopDetails?.shop_phone;

  return (
    <footer className="bg-gray-50 dark:bg-black-27 border-t dark:border-gray-800">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-[1400px] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {shopLogo ? (
                <FallbackImage
                  src={shopLogo}
                  alt={shopName}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {shopName}
                </span>
              )}
            </div>
            {shopAddress && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {shopAddress}
              </p>
            )}
            {shopPhone && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("phone")}: {shopPhone}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("quick_links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${baseUrl}/products`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-zatiq transition-colors text-sm"
                >
                  {t("all_products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/checkout`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-zatiq transition-colors text-sm"
                >
                  {t("cart")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("categories")}
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${baseUrl}/categories/${category.id}?selected_category=${category.id}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-zatiq transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t("contact_us")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("contact_description") || "Get in touch with us for any inquiries."}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {shopName}. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PremiumFooter;
