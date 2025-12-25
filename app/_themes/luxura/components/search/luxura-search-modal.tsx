"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { formatPrice } from "@/lib/utils/formatting";

interface LuxuraSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchText?: string;
}

export function LuxuraSearchModal({ isOpen, onClose, searchText: initialSearchText = "" }: LuxuraSearchModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);

  const [searchText, setSearchText] = useState(initialSearchText);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";

  // Search products
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);

    setSearchResults(filtered);
  }, [products]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, handleSearch]);

  // Navigate to product
  const navigateToProduct = (productId: number | string) => {
    router.push(`${baseUrl}/products/${productId}`);
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[250] flex justify-center pt-20"
          >
            <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-[800px] bg-white dark:bg-black-27 rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center border-b dark:border-gray-700 p-4">
                <Search size={20} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={t("search_for_products")}
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 text-lg"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-2"
                  aria-label="Close search"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="divide-y dark:divide-gray-700">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigateToProduct(product.id)}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <FallbackImage
                            src={product.images?.[0] || product.image_url || ""}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {formatPrice(product.price, currency)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ArrowRight size={18} className="text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : searchText.trim() ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p>{t("no_products_found")}</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p>{t("type_to_search")}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LuxuraSearchModal;
