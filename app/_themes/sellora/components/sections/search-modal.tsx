"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";

interface SelloraSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelloraSearchModal({ isOpen, onClose }: SelloraSearchModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.short_description?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [searchQuery, products]);

  // Handle product click
  const handleProductClick = useCallback(
    (productId: number | string) => {
      router.push(`${baseUrl}/products/${productId}`);
      onClose();
      setSearchQuery("");
    },
    [router, baseUrl, onClose]
  );

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 pt-20 px-4"
          >
            <div className="max-w-2xl mx-auto bg-white dark:bg-black-18 rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search_products") || "Search products..."}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="max-h-[60vh] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <FallbackImage
                              src={getInventoryThumbImageUrl(product.image_url || "")}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-blue-zatiq font-semibold">
                              {currency} {product.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      {t("no_products_found") || "No products found"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SelloraSearchModal;
