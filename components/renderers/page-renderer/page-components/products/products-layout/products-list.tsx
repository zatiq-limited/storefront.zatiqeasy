"use client";

import Link from "next/link";
import { getInventoryThumbImageUrl } from "@/lib/utils/formatting";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ProductsListProps } from "./types";

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => {
        const handle =
          product.product_code?.toLowerCase() || product.id.toString();
        const productImage = getInventoryThumbImageUrl(
          product.image_url || product.images?.[0] || ""
        );

        return (
          <Link
            key={product.id}
            href={`/products/${handle}`}
            className="block group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Image */}
              <div className="w-full sm:w-48 h-48 shrink-0 overflow-hidden bg-gray-100 rounded-lg relative">
                <FallbackImage
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.old_price && (
                    <span className="text-lg text-gray-500 line-through">
                      ৳{product.old_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
