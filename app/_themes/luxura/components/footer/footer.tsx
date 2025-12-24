"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useTranslation } from "react-i18next";

export function LuxuraFooter() {
  const { shopDetails } = useShopStore();
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 mt-auto">
      <div className="w-[95%] md:w-[90%] lg:w-[78%] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {shopDetails?.shop_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {shopDetails?.details || "Your trusted online shopping destination"}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {shopDetails?.social_links?.facebook && (
                <Link
                  href={shopDetails.social_links.facebook}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="text-gray-600 dark:text-gray-400" />
                </Link>
              )}
              {shopDetails?.social_links?.instagram && (
                <Link
                  href={shopDetails.social_links.instagram}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="text-gray-600 dark:text-gray-400" />
                </Link>
              )}
              {shopDetails?.social_links?.twitter && (
                <Link
                  href={shopDetails.social_links.twitter}
                  target="_blank"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="text-gray-600 dark:text-gray-400" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("quick_links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${baseUrl}/`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/products`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/categories`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("categories")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("customer_service")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${baseUrl}/contact`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/shipping`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("shipping_info")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseUrl}/returns`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {t("returns_exchanges")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("contact")}
            </h3>
            <ul className="space-y-3">
              {shopDetails?.shop_email && (
                <li className="flex items-start gap-2">
                  <Mail size={18} className="text-gray-600 dark:text-gray-400 mt-0.5" />
                  <a
                    href={`mailto:${shopDetails.shop_email}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {shopDetails.shop_email}
                  </a>
                </li>
              )}
              {shopDetails?.shop_phone && (
                <li className="flex items-start gap-2">
                  <Phone size={18} className="text-gray-600 dark:text-gray-400 mt-0.5" />
                  <a
                    href={`tel:${shopDetails.shop_phone}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {shopDetails.shop_phone}
                  </a>
                </li>
              )}
              {shopDetails?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="text-gray-600 dark:text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shopDetails.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {shopDetails?.shop_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={`${baseUrl}/privacy`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                {t("privacy_policy")}
              </Link>
              <Link
                href={`${baseUrl}/terms`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                {t("terms_of_service")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LuxuraFooter;
