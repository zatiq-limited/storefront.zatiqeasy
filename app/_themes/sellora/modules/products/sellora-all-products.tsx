"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useShopInventories, useShopCategories } from "@/hooks";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import { FallbackImage } from "@/components/ui/fallback-image";
import { SelloraProductCard } from "../../components/cards";
import { GridContainer, Pagination } from "../../components/core";
import { FeaturedCollections } from "../../components/featured-collections";
import {
  PriceFilterSection,
  SortBySection,
  MobilePriceFilter,
  type PriceRange,
  type SortOption,
} from "../../components/all-products";

const PRODUCTS_PER_PAGE = 12;

interface Carousel {
  tag?: string;
  image_url: string;
  title?: string;
  sub_title?: string;
}

export function SelloraAllProducts() {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const products = useProductsStore((state) => state.products);
  const totalCartItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);
  const productsStoreIsLoading = useProductsStore((state) => state.isLoading);

  // Fetch shop inventories to populate products store (if not already fetched by parent)
  // sortByStock: false to preserve original API order
  const { isLoading: isInventoriesLoading } = useShopInventories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid, sortByStock: false }
  );

  // Fetch categories
  useShopCategories(
    { shopUuid: shopDetails?.shop_uuid ?? "" },
    { enabled: !!shopDetails?.shop_uuid }
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("");
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const isLoading = isInventoriesLoading || productsStoreIsLoading;

  // Generate price ranges based on products
  const priceRanges = useMemo((): PriceRange[] => {
    if (products.length === 0) return [];

    const prices = products.map((p) => p.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) return [];

    const range = maxPrice - minPrice;
    const step = Math.ceil(range / 4);

    return [
      { id: 1, min: minPrice, max: minPrice + step },
      { id: 2, min: minPrice + step + 1, max: minPrice + step * 2 },
      { id: 3, min: minPrice + step * 2 + 1, max: minPrice + step * 3 },
      { id: 4, min: minPrice + step * 3 + 1, max: maxPrice },
    ].filter((r) => r.min <= maxPrice);
  }, [products]);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalCartItems > 0;

  // Get first carousel for hero
  const carousels =
    (shopDetails?.shop_theme as unknown as { carousels?: Carousel[] })
      ?.carousels || [];
  const heroCarousel = carousels[0];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by price range
    if (selectedPriceRange) {
      filtered = filtered.filter((p) => {
        const price = p.price || 0;
        return (
          price >= selectedPriceRange.min && price <= selectedPriceRange.max
        );
      });
    }

    // Sort
    if (sortOrder === "price_asc") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "price_desc") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [products, selectedPriceRange, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Navigate to product details
  const navigateProductDetails = useCallback(
    (id: number | string) => {
      router.push(`${baseUrl}/products/${id}`);
    },
    [router, baseUrl]
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Show loading state while fetching products
  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mb-4" />
        <p className="text-sm text-muted-foreground">
          {t("loading_products") || "Loading products..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Variant Selector Modal */}
      <VariantSelectorModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Price Filter */}
      <MobilePriceFilter
        showMobileFilter={showMobileFilter}
        setShowMobileFilter={setShowMobileFilter}
        priceRanges={priceRanges}
        selectedRange={selectedPriceRange}
        onRangeSelect={(range) => {
          setSelectedPriceRange(range);
          setCurrentPage(1);
        }}
      />

      {/* Hero Banner */}
      <div className="relative h-50 sm:h-70 md:h-90 lg:h-100 max-w-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroCarousel?.image_url ? (
            <FallbackImage
              src={heroCarousel.image_url}
              alt={heroCarousel.title || "Products"}
              fill
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent dark:from-black/80 dark:via-black/50" />

        {/* Content */}
        <div className="relative h-full flex items-end pb-10 sm:pb-20">
          <div className="container w-full">
            <div className="max-w-full sm:max-w-xl md:max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                {heroCarousel?.title || t("all_products")}
              </h1>
              {heroCarousel?.sub_title && (
                <p className="text-sm md:text-base lg:text-lg xl:text-2xl font-normal text-white/90 max-w-[90%] sm:max-w-full">
                  {heroCarousel.sub_title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        {/* Header with Filter Button */}
        <div className="pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="inline text-base">{t("filter")}</span>
            </button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          {priceRanges.length > 0 && (
            <aside className="hidden lg:block w-full lg:w-56 xl:w-64 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-5">
                {/* Price Filter Section */}
                <PriceFilterSection
                  priceRanges={priceRanges}
                  selectedRange={selectedPriceRange}
                  onRangeSelect={(range) => {
                    setSelectedPriceRange(range);
                    setCurrentPage(1);
                  }}
                />

                {/* Sort By Section */}
                {filteredProducts.length >= 1 && (
                  <SortBySection
                    selectedSort={sortOrder}
                    onSortChange={(sort) => {
                      setSortOrder(sort);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {paginatedProducts.length > 0 ? (
              <GridContainer columns={{ mobile: 2, tablet: 2, desktop: 3 }}>
                {paginatedProducts.map((product) => (
                  <SelloraProductCard
                    key={product.id}
                    product={product}
                    onNavigate={() => navigateProductDetails(product.id)}
                    onSelectProduct={() => setSelectedProduct(product)}
                  />
                ))}
              </GridContainer>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {t("no_products_found") || "No Products Found"}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("try_adjusting_filters") || "Try adjusting your filters"}
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Featured Collections Section */}
        <FeaturedCollections title={t("featured_collections")} />
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        showCartFloatingBtn={hasItems}
        totalProducts={totalCartItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`${baseUrl}/checkout`)}
        theme="Sellora"
      />
    </>
  );
}

export default SelloraAllProducts;
