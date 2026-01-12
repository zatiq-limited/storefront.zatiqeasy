"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { GridContainer } from "../../components/core";
import { AuroraProductCard } from "../../components/cards";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { useShallowSearchParams } from "@/lib/utils/shallow-routing";

const PRODUCTS_PER_PAGE = 12;

export function AuroraCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useShallowSearchParams(); // Use shallow params for instant updates
  const { shopDetails } = useShopStore();
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);
  const products = useProductsStore((state) => state.products);
  const categories = useProductsStore((state) => state.categories);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get category ID from route params
  const routeCategoryId = params?.category as string;

  // Get selected_category from URL search params (for leaf category filtering)
  const selectedCategoryParam = searchParams.get("selected_category");

  // Use selected_category param if available, otherwise use route category ID
  const activeCategoryId = selectedCategoryParam || routeCategoryId;

  // Track previous category to reset page when category changes
  const prevCategoryRef = useRef(activeCategoryId);
  if (prevCategoryRef.current !== activeCategoryId) {
    prevCategoryRef.current = activeCategoryId;
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }

  // Find the current category (for title - use route category)
  const currentCategory = useMemo(() => {
    if (!routeCategoryId || !categories) return null;
    return categories.find((cat) => String(cat.id) === routeCategoryId) || null;
  }, [routeCategoryId, categories]);

  // Filter products by active category (selected_category or route category)
  const categoryProducts = useMemo(() => {
    if (!activeCategoryId || !products) return [];

    return products.filter((product: Product) => {
      if (!product.categories) return false;
      return product.categories.some(
        (cat: { id: number | string; name: string }) =>
          String(cat.id) === activeCategoryId
      );
    });
  }, [activeCategoryId, products]);

  // Check loading state
  const isLoading = !products || products.length === 0;

  // Pagination
  const totalPages = Math.ceil(categoryProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = categoryProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Navigate to product detail
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  return (
    <div className="container pb-20">
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Category Title */}
      <h2 className="text-[38px] md:text-[64px] font-normal text-blue-zatiq py-5">
        {currentCategory?.name || "Category"}
      </h2>

      {/* Category Horizontal List */}
      <CategoryHorizontalList fromCategory />

      <div className="w-full h-8 md:h-10" />

      {/* Products Grid */}
      <GridContainer>
        {isLoading ? (
          // Loading Skeletons
          [...Array(9)].map((_, index) => <ProductSkeleton key={index} />)
        ) : paginatedProducts && paginatedProducts.length > 0 ? (
          // Product Cards
          paginatedProducts.map((product) => (
            <AuroraProductCard
              key={product.id}
              product={product}
              onSelectProduct={() => setSelectedProduct(product)}
              onNavigate={() => navigateProductDetails(product.id)}
            />
          ))
        ) : (
          // Empty State
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <h3 className="text-center text-lg mt-5 text-gray-600 dark:text-gray-400">
              No products found
            </h3>
          </div>
        )}
      </GridContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalCartItems}
        theme="Aurora"
      />
    </div>
  );
}

export default AuroraCategoryPage;
