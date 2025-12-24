"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[150]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-[280px] max-w-[80vw] bg-white dark:bg-black-27 z-[200] shadow-xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("menu")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4">
              <nav className="space-y-2">
                <Link
                  href={baseUrl || "/"}
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t("home")}
                </Link>
                <Link
                  href={`${baseUrl}/products`}
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t("products")}
                </Link>
                <Link
                  href={`${baseUrl}/categories`}
                  onClick={onClose}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                >
                  {t("categories")}
                </Link>
              </nav>
            </div>

            {/* Categories Section */}
            {categories && categories.length > 0 && (
              <div className="p-4 border-t dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("categories")}
                </h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {categories.slice(0, 10).map((category) => (
                    <Link
                      key={category.id}
                      href={`${baseUrl}/categories/${category.id}?selected_category=${category.id}`}
                      onClick={onClose}
                      className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Shop Info */}
            <div className="p-4 border-t dark:border-gray-700 mt-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {shopDetails?.shop_name}
              </p>
              {shopDetails?.shop_phone && (
                <a
                  href={`tel:${shopDetails.shop_phone}`}
                  className="text-sm text-blue-500 hover:underline mt-1 block"
                >
                  {shopDetails.shop_phone}
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;
