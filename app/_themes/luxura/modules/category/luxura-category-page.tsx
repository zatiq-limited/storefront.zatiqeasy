"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/stores/cartStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { GridContainer } from "../../components/core";
import { LuxuraProductCard } from "../../components/cards";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import CategoryHorizontalList from "@/components/features/category/category-horizontal-list";
import Pagination from "@/components/pagination";
import ProductSkeleton from "@/components/shared/skeletons/product-skeleton";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";

const PRODUCTS_PER_PAGE = 12;

export function LuxuraCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
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
      <div className="pt-6 md:pt-9">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {currentCategory?.name || "Category"}
        </h2>
      </div>

      {/* Category Horizontal List */}
      <CategoryHorizontalList fromCategory className="my-6 md:my-8" />

      {/* Products Grid */}
      {isLoading ? (
        <GridContainer>
          {[...Array(12)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </GridContainer>
      ) : paginatedProducts && paginatedProducts.length > 0 ? (
        <GridContainer>
          {paginatedProducts.map((product) => (
            <LuxuraProductCard
              key={product.id}
              product={product}
              onSelectProduct={() => setSelectedProduct(product)}
              onNavigate={() => navigateProductDetails(product.id)}
            />
          ))}
        </GridContainer>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-lg">No products found in this category</p>
        </div>
      )}

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
        theme="Luxura"
      />
    </div>
  );
}

export default LuxuraCategoryPage;
