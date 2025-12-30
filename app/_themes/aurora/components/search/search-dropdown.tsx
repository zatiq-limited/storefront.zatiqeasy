"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoveUpRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getInventoryThumbImageUrl } from "@/lib/utils";
import type { InventoryProduct } from "@/types";

interface SearchDropdownProps {
  onClose?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ onClose }) => {
  const router = useRouter();
  const { shopDetails, setSearchModalOpen } = useShopStore();
  const { products: allProducts } = useProductsStore();
  const [searchText, setSearchText] = useState("");

  const countryCurrency = shopDetails?.country_currency || "BDT";
  const baseUrl = shopDetails?.baseUrl || "";

  // Filter products based on search text
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return [];

    const searchLower = searchText.toLowerCase();
    return (allProducts || [])
      .filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const productCode = product.product_code?.toLowerCase() || "";
        return name.includes(searchLower) || productCode.includes(searchLower);
      })
      .slice(0, 20);
  }, [allProducts, searchText]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleProductClick = useCallback(
    (productId: string | number) => {
      router.push(`${baseUrl}/products/${productId}`);
      setSearchModalOpen(false);
      onClose?.();
    },
    [router, baseUrl, setSearchModalOpen, onClose]
  );

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-zatiq bg-transparent text-black-2 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
          onChange={handleChange}
          value={searchText}
          autoFocus
        />
      </div>

      {/* Search Results */}
      {filteredProducts.length > 0 && (
        <div className="max-h-[75vh] w-full overflow-y-auto p-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id || index}
              className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-black-18 cursor-pointer transition-colors py-2 border-b first:border-y"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="w-full h-24 md:h-34 flex items-center gap-6 md:gap-7">
                {/* Product Image */}
                <FallbackImage
                  src={getInventoryThumbImageUrl(
                    product.images?.[0] || product.image_url || ""
                  )}
                  alt={product.name || "Product"}
                  height={140}
                  width={100}
                  className="h-full aspect-[96/120] object-cover rounded"
                />

                {/* Product Info */}
                <div className="w-full py-3 flex justify-between items-end lg:items-center">
                  <div className="flex flex-col gap-3 lg:gap-10">
                    <p className="text-gray-700 dark:text-gray-300 text-base xl:text-xl leading-4.5 line-clamp-3">
                      {product.name}
                    </p>
                    <p className="text-zinc-900 dark:text-gray-300 text-base md:text-3xl font-bold leading-4.5">
                      {countryCurrency} {product.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex h-full items-center">
                    <div className="h-6 w-6 md:h-8 md:w-8 lg:w-10 lg:h-10 bg-gray-600 rounded-full flex justify-center items-center">
                      <MoveUpRight className="text-white h-4 w-4 lg:h-6 lg:w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchText.trim() && filteredProducts.length === 0 && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No products found for &quot;{searchText}&quot;
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
