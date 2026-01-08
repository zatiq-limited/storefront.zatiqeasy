"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { useShopInventories } from "@/hooks";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";

interface BasicSearchDropdownProps {
  onClose?: () => void;
}

export function BasicSearchDropdown({ onClose }: BasicSearchDropdownProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const storeProducts = useProductsStore((state) => state.products);
  const [searchText, setSearchText] = useState("");

  const currency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";

  // Fetch products if store is empty (handles page reload scenario)
  const { data: fetchedProducts, isLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    { enabled: storeProducts.length === 0 && !!shopDetails?.shop_uuid }
  );

  // Use store products if available, otherwise use fetched products
  const products = useMemo(
    () =>
      storeProducts.length > 0
        ? storeProducts
        : (fetchedProducts as Product[]) || [],
    [storeProducts, fetchedProducts]
  );

  // Filter products based on search text
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return [];

    const searchLower = searchText.toLowerCase();
    return (products || [])
      .filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const productCode = product.product_code?.toLowerCase() || "";
        const description = product.short_description?.toLowerCase() || "";
        return (
          name.includes(searchLower) ||
          productCode.includes(searchLower) ||
          description.includes(searchLower)
        );
      })
      .slice(0, 10);
  }, [products, searchText]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchText("");
  }, []);

  const handleProductClick = useCallback(
    (productId: string | number) => {
      router.push(`${baseUrl}/products/${productId}`);
      onClose?.();
    },
    [router, baseUrl, onClose]
  );

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={t("search_items") || "Search products..."}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-zatiq bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            onChange={handleChange}
            value={searchText}
            autoFocus
          />
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {filteredProducts.length > 0 && (
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <FallbackImage
                  src={getInventoryThumbImageUrl(
                    (product.images && product.images.length > 0
                      ? product.images[0]
                      : product.image_url) || ""
                  )}
                  alt={product.name || "Product"}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {product.name}
                </p>
                <p className="text-sm text-blue-zatiq font-semibold mt-0.5">
                  {currency} {product.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && searchText.trim() && (
        <div className="p-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-zatiq" />
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchText.trim() && filteredProducts.length === 0 && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          {t("no_products_found") || "No products found"}
        </div>
      )}
    </div>
  );
}

export default BasicSearchDropdown;
