"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Product, VariantType } from "@/stores/productsStore";
import Image from "next/image";
import { useCartStore } from "@/stores";
import { useProductsStore } from "@/stores/productsStore";
import type { VariantState } from "@/types/cart.types";
import { useShopStore } from "@/stores/shopStore";
import { ShoppingCart, Zap, AlertCircle } from "lucide-react";
import { cn, titleCase } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@/app/components/pagination";
import { ProductSkeleton } from "@/app/components/skeletons/product-skeleton";
import { LazyAnimation } from "@/app/components/animations/lazy-animation";
import { CartQtyControl } from "@/components/cart/shared/cart-qty-control";
import { ROUTES } from "@/lib/constants";

// Constants
const MAX_PRODUCTS_PER_PAGE = 12;

// Types
interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  old_price?: number | null;
  image_url?: string;
  images?: string[];
  variant_types?: VariantType[];
  quantity?: number;
  has_variant?: boolean;
  onNavigate: () => void;
  onSelectProduct: () => void;
}

/**
 * Inventory Products Component
 * Displays product grid with sorting and pagination
 */
export function InventoryProducts() {
  // Note: selectedProduct state is set but not read - kept for future variant selector modal
  const [, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Get inventory state using direct selectors (avoiding getter issues)
  const products = useProductsStore((state) => state.products);
  const filters = useProductsStore((state) => state.filters);
  const isLoading = useProductsStore((state) => state.isLoading);
  const setFilters = useProductsStore((state) => state.setFilters);

  // Compute filtered products in the component
  const { filteredProducts, totalPages, currentPage, sortOption } =
    useMemo(() => {
      let filtered = [...products];

      // Apply search filter
      if (filters.search) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      // Apply category filter
      if (filters.category) {
        filtered = filtered.filter(
          (product) =>
            String(product.category_id) === String(filters.category) ||
            product.categories?.some(
              (cat) => String(cat.id) === String(filters.category)
            )
        );
      }

      // Apply sorting
      switch (filters.sort) {
        case "price-asc":
          filtered = filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered = filtered.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }

      return {
        filteredProducts: filtered,
        totalPages: Math.ceil(filtered.length / MAX_PRODUCTS_PER_PAGE),
        currentPage: filters.page,
        sortOption: filters.sort,
      };
    }, [products, filters]);

  // Setters
  const setCurrentPage = (page: number) => setFilters({ page });
  const setSortOption = (sort: string) => setFilters({ sort, page: 1 });

  // Navigate to product details
  const navigateProductDetails = (id: string | number) => {
    router.push(ROUTES.PRODUCT_DETAIL(String(id)));
  };

  // Handle sort change
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Get current page products
  const currentProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) {
      return [];
    }
    const start = (currentPage - 1) * MAX_PRODUCTS_PER_PAGE;
    const end = start + MAX_PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  return (
    <>
      <div className="space-y-6">
        {filteredProducts && filteredProducts.length > 0 ? (
          <div>
            {/* Header with category name and sort */}
            <div className="px-4 h-13.75 bg-white dark:bg-gray-800 rounded-xl mb-3 border border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <h2 className="font-medium text-gray-900 dark:text-gray-300 truncate w-[45%]">
                All Products
              </h2>
              <div className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                <span className="min-w-fit">Sort by:</span>
                <select
                  onChange={handleSort}
                  value={sortOption}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-30.5 bg-transparent dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price (Low &gt; High)</option>
                  <option value="price-desc">Price (High &gt; Low)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4">
              <AnimatePresence mode="wait">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onNavigate={() => navigateProductDetails(product.id)}
                    onSelectProduct={() => setSelectedProduct(product)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 mt-30 text-sm text-gray-600 dark:text-gray-400 max-w-46 mx-auto">
                <AlertCircle className="w-12 h-12 text-gray-400" />
                <p className="text-center tracking-[-0.56px]">
                  No item is currently available in this category. Hope we can
                  add it soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Product Card Component
 */
function ProductCard({
  id,
  name,
  price,
  old_price,
  image_url,
  images,
  variant_types,
  quantity = 0,
  has_variant = false,
  onNavigate,
  onSelectProduct,
}: ProductCardProps) {
  const router = useRouter();
  const {
    addProduct,
    updateQuantity,
    removeProduct,
    getProductsByInventoryId,
  } = useCartStore();
  const { shopDetails } = useShopStore();

  // Get quantity in cart for this product
  const cartProducts = getProductsByInventoryId(Number(id));
  const quantityInCart = cartProducts.reduce((sum, p) => sum + p.qty, 0);
  const isStockOut = quantity <= 0;

  // Product image URL
  const productImage = images?.[0] || image_url || "/placeholder-product.svg";

  // Currency
  const currency =
    shopDetails?.currency_code === "BDT"
      ? "Tk"
      : shopDetails?.currency_code || "$";

  // Calculate discount
  const validOldPrice = old_price ?? undefined;
  const discount =
    validOldPrice && validOldPrice > price ? validOldPrice - price : 0;

  // Calculate max stock for cart item
  const getMaxStock = () => {
    const currentCartItem = cartProducts[0];
    if (!currentCartItem) return quantity;

    if (
      currentCartItem.is_stock_manage_by_variant &&
      currentCartItem.stocks?.length > 0
    ) {
      const selectedVariantIds = Object.values(
        currentCartItem.selectedVariants || {}
      )
        .filter((v): v is VariantState => Boolean(v))
        .map((v) => v.variant_id);

      if (selectedVariantIds.length > 0) {
        const matchingStock = currentCartItem.stocks.find((stock) =>
          selectedVariantIds.every((variantId: number) =>
            stock.combination.includes(`${variantId}`)
          )
        );
        return matchingStock?.quantity ?? currentCartItem.quantity;
      }
    }
    return currentCartItem.quantity ?? quantity;
  };

  const maxStock = getMaxStock();
  const isCartIncrementDisabled =
    isStockOut || (typeof maxStock === "number" && quantityInCart >= maxStock);

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct();
      return;
    }

    // Type assertion needed due to type differences between Product and InventoryProduct
    addProduct({
      id: Number(id),
      shop_id: 0,
      name,
      price,
      old_price: validOldPrice || price,
      quantity: quantity || 0,
      is_active: true,
      has_variant: has_variant || false,
      images: images || (image_url ? [image_url] : []),
      image_url: productImage,
      categories: [],
      variant_types: variant_types || [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: 0,
      qty: 1,
      selectedVariants: {},
    } as Parameters<typeof addProduct>[0]);
  };

  // Buy now handler
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (has_variant || variant_types?.length) {
      onSelectProduct();
      return;
    }

    // Type assertion needed due to type differences between Product and InventoryProduct
    addProduct({
      id: Number(id),
      shop_id: 0,
      name,
      price,
      old_price: validOldPrice || price,
      quantity: quantity || 0,
      is_active: true,
      has_variant: has_variant || false,
      images: images || (image_url ? [image_url] : []),
      image_url: productImage,
      categories: [],
      variant_types: variant_types || [],
      stocks: [],
      is_stock_manage_by_variant: false,
      reviews: [],
      total_inventory_sold: 0,
      qty: 1,
      selectedVariants: {},
    } as Parameters<typeof addProduct>[0]);

    router.push(ROUTES.CHECKOUT);
  };

  // Increment quantity handler
  const handleSumQty = () => {
    if (variant_types?.length) {
      onSelectProduct();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      updateQuantity(cartProduct.cartId, quantityInCart + 1);
    }
  };

  // Decrement quantity handler
  const handleSubQty = () => {
    if (variant_types?.length) {
      onSelectProduct();
      return;
    }
    const cartProduct = cartProducts[0];
    if (cartProduct?.cartId) {
      if (quantityInCart <= 1) {
        removeProduct(cartProduct.cartId);
      } else {
        updateQuantity(cartProduct.cartId, quantityInCart - 1);
      }
    }
  };

  // Direct quantity change handler
  const handleQtyChange = (value: number) => {
    const cartProduct = cartProducts[0];
    if (!cartProduct?.cartId) return;

    if (value <= 0) {
      removeProduct(cartProduct.cartId);
    } else {
      updateQuantity(cartProduct.cartId, value);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 hover:border-blue-zatiq dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg"
    >
      {/* Product Image */}
      <div
        role="button"
        tabIndex={0}
        onClick={onNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onNavigate();
          }
        }}
        aria-label={`View ${name} details`}
        className="relative cursor-pointer"
      >
        <div className="relative w-full h-48 sm:h-52 overflow-hidden">
          <Image
            src={productImage}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-300 p-2 rounded-xl hover:shadow-sm dark:hover:shadow-gray-600",
              !isStockOut && "hover:scale-105"
            )}
          />

          {/* Discount Badge */}
          {!isStockOut && discount > 0 && (
            <div className="absolute bottom-3 right-2 md:top-3 md:right-3">
              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                Save {Number(discount.toFixed(2)).toLocaleString()} {currency}
              </span>
            </div>
          )}

          {/* Stock Out Overlay */}
          {isStockOut && (
            <div className="absolute inset-2 bg-gray-600/50 flex items-center justify-center rounded-md">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div
        className={cn(
          "px-4 py-3 flex flex-col items-center justify-between",
          name && name.length <= 20 ? "gap-4" : "gap-1"
        )}
      >
        {/* Price */}
        <div className="flex items-center gap-2">
          {validOldPrice && validOldPrice > price && (
            <span className="text-red-500 text-sm line-through">
              {currency} {validOldPrice}
            </span>
          )}
          <span className="text-lg sm:text-xl font-bold text-black dark:text-gray-100">
            {currency} {price || "0.00"}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-center text-black dark:text-gray-100 font-normal text-lg line-clamp-2">
          {titleCase(name)}
        </h3>
      </div>

      {/* Cart Controls */}
      <div className="px-4 pb-4 flex flex-col gap-2 mt-auto">
        <LazyAnimation>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={cartProducts.length}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {quantityInCart > 0 ? (
                <div className="flex flex-col gap-2">
                  <CartQtyControl
                    className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 flex items-center justify-between"
                    qty={quantityInCart}
                    maxStock={maxStock}
                    disableSumBtn={isCartIncrementDisabled}
                    sumQty={handleSumQty}
                    subQty={handleSubQty}
                    onQtyChange={handleQtyChange}
                  />
                  {shopDetails?.shop_theme?.enable_buy_now_on_product_card && (
                    <button
                      disabled={isStockOut}
                      className="w-full bg-blue-zatiq hover:bg-blue-zatiq/75 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      onClick={handleBuyNow}
                    >
                      <Zap size={16} />
                      {isStockOut ? "Out of Stock" : "Buy Now"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Add to Cart Button */}
                  <button
                    disabled={isStockOut}
                    className="w-full bg-white border border-blue-zatiq hover:bg-blue-zatiq disabled:bg-gray-100 text-blue-zatiq hover:text-white disabled:text-gray-400 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={16} />
                    {isStockOut ? "Out of Stock" : "Add to Cart"}
                  </button>

                  {/* Buy Now Button */}
                  {shopDetails?.shop_theme?.enable_buy_now_on_product_card && (
                    <button
                      disabled={isStockOut}
                      className="w-full bg-blue-zatiq hover:bg-green-600 disabled:bg-gray-300 text-white border hover:border-blue-zatiq font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      onClick={handleBuyNow}
                    >
                      <Zap size={16} />
                      {isStockOut ? "Out of Stock" : "Buy Now"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </LazyAnimation>
      </div>
    </motion.div>
  );
}

// Export as default
export default InventoryProducts;
