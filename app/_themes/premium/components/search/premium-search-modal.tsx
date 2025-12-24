"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { formatPrice } from "@/lib/utils/formatting";

interface PremiumSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumSearchModal({ isOpen, onClose }: PremiumSearchModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(query)
      )
      .slice(0, 20);
  }, [products, searchQuery]);

  // Handle product click
  const handleProductClick = useCallback((product: Product) => {
    onClose();
    setSearchQuery("");
    router.push(`${baseUrl}/products/${product.id}`);
  }, [router, baseUrl, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] md:w-[85%] max-w-[1300px] max-h-[80vh] bg-white dark:bg-black-18 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
              <Search size={24} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_products") || "Search products..."}
                className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-[60vh]">
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {t("no_products_found") || "No products found"}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          <FallbackImage
                            src={product.images?.[0] || product.image_url || ""}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                            {product.name}
                          </h4>
                          <p className="text-blue-zatiq font-bold text-sm mt-1">
                            {formatPrice(product.price, currency)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {t("start_typing_to_search") || "Start typing to search..."}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PremiumSearchModal;
