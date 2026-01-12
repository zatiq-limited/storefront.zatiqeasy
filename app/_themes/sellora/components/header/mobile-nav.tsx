"use client";

import React from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";

interface SelloraMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelloraMobileNav({ isOpen, onClose }: SelloraMobileNavProps) {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const categories = useProductsStore((state) => state.categories);

  const baseUrl = shopDetails?.baseUrl || "";
  const shopName = shopDetails?.shop_name || "Shop";

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
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-black-18 z-100 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {shopName}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              <div className="space-y-1">
                <Link
                  href={`${baseUrl}/products`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="font-medium">{t("products")}</span>
                  <ChevronRight size={20} />
                </Link>

                <Link
                  href={`${baseUrl}/categories`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="font-medium">{t("categories")}</span>
                  <ChevronRight size={20} />
                </Link>

                <Link
                  href={`${baseUrl}/about-us`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="font-medium">{t("about_us")}</span>
                  <ChevronRight size={20} />
                </Link>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="pt-4">
                    <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {t("categories")}
                    </p>
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category.id}
                        href={`${baseUrl}/categories/${category.id}?selected_category=${category.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <span>{category.name}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SelloraMobileNav;
