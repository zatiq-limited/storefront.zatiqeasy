"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useShopStore } from "@/stores/shopStore";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from "@/stores/cartStore";
import { useProductDetails } from "@/hooks/useProductDetails";
import { CartFloatingBtn } from "@/components/features/cart/cart-floating-btn";

// Dynamic imports
const ProductDetails = dynamic(() => import("./product-details"), {
  ssr: true,
});

export function AuroraProductDetailPage({
  handle: propHandle,
}: {
  handle?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const { shopDetails } = useShopStore();

  // Get product handle from props first, then params (can be productHandle, handle, or product_id)
  const handle =
    propHandle ||
    ((params?.productHandle ||
      params?.handle ||
      params?.product_id ||
      "") as string);

  const { product, isLoading, error } = useProductDetails(handle);
  const totalProducts = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectSubtotal);

  const baseUrl = shopDetails?.baseUrl || "";
  const hasItems = totalProducts > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-zatiq" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container xl:grid xl:grid-cols-5 gap-5">
        <div className="xl:col-span-5">
          <ProductDetails product={product} />
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartFloatingBtn
        onClick={() => router.push(`${baseUrl}/checkout`)}
        showCartFloatingBtn={hasItems}
        totalPrice={totalPrice}
        totalProducts={totalProducts}
        theme="Aurora"
      />
    </>
  );
}

export default AuroraProductDetailPage;
