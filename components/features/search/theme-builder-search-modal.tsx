"use client";

import React, { useState, useEffect, useMemo, useCallback, startTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useShopInventories } from "@/hooks/useShopInventories";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";

interface ThemeBuilderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

/**
 * Search Modal for Theme Builder
 * Generic search component used when legacy_theme === false
 * Filters products from Zustand store or fetches if not available
 */
export function ThemeBuilderSearchModal({
  isOpen,
  onClose,
  initialQuery = "",
}: ThemeBuilderSearchModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const storeProducts = useProductsStore((state) => state.products);

  // Fetch products if store is empty
  const { data: fetchedProducts, isLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    {
      enabled: isOpen && storeProducts.length === 0 && !!shopDetails?.shop_uuid,
      syncToStore: true
    }
  );

  // Use store products first, fallback to fetched products
  // Memoized to prevent dependency changes on every render
  const products: Product[] = useMemo(() => {
    return storeProducts.length > 0 ? storeProducts : (fetchedProducts || []);
  }, [storeProducts, fetchedProducts]);

  const [searchQuery, setSearchQuery] = useState("");
  const baseUrl = shopDetails?.baseUrl || "";
  const currency = shopDetails?.country_currency || "BDT";

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.product_code?.toLowerCase().includes(query) ||
          product.short_description?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [searchQuery, products]);

  // Handle product click - navigate to product page
  const handleProductClick = useCallback(
    (productId: number | string) => {
      router.push(`${baseUrl}/products/${productId}`);
      onClose();
      setSearchQuery("");
    },
    [router, baseUrl, onClose]
  );

  // Close on escape key
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

  // Set initial query when modal opens, reset when closes
  // Using startTransition to avoid cascading renders (React 19 best practice)
  useEffect(() => {
    startTransition(() => {
      if (isOpen && initialQuery) {
        setSearchQuery(initialQuery);
      } else if (!isOpen) {
        setSearchQuery("");
      }
    });
  }, [isOpen, initialQuery]);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[10%] sm:top-[15%] left-0 right-0 z-[100] px-4"
          >
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search_products") || "Search products..."}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 text-base"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Loader2 size={24} className="mx-auto mb-2 animate-spin" />
                      <p>{t("loading") || "Loading products..."}</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                            <FallbackImage
                              src={getInventoryThumbImageUrl(
                                (product.images && product.images.length > 0
                                  ? product.images[0]
                                  : product.image_url) || ""
                              )}
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
                            <p className="text-sm font-semibold text-primary">
                              {currency} {product.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      {t("no_products_found") || "No products found"}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state when no query */}
              {!searchQuery.trim() && (
                <div className="p-8 text-center text-gray-400">
                  <Search size={40} className="mx-auto mb-3 opacity-50" />
                  <p>{t("search_hint") || "Start typing to search products"}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ThemeBuilderSearchModal;
