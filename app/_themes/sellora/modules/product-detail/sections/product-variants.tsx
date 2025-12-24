"use client";

import React, { useCallback } from "react";
import { cn, getInventoryThumbImageUrl } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { VariantType, Variant } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface ProductVariantsProps {
  variantTypes: VariantType[];
  selectedVariants: VariantsState;
  onSelectVariant: (variantTypeId: number | string, variantState: VariantState) => void;
  onImageChange?: (index: number) => void;
  images?: string[];
  imageVariantTypeId?: number;
}

export function ProductVariants({
  variantTypes,
  selectedVariants,
  onSelectVariant,
  onImageChange,
  images = [],
  imageVariantTypeId,
}: ProductVariantsProps) {
  // Handle variant selection
  const handleVariantSelect = useCallback(
    (variantType: VariantType, variant: Variant) => {
      const variantState: VariantState = {
        variant_name: variant.name,
        variant_id: variant.id,
        variant_type_id: variantType.id,
        variant_type_name: variantType.title,
        price: variant.price ?? 0,
        image_url: variant.image_url || undefined,
      };

      onSelectVariant(variantType.id, variantState);

      // If this variant type is tied to images, update the selected image
      if (
        imageVariantTypeId &&
        variantType.id === imageVariantTypeId &&
        variant.image_url &&
        onImageChange
      ) {
        const imageIndex = images.findIndex((img) =>
          img.includes(variant.image_url!)
        );
        if (imageIndex !== -1) {
          onImageChange(imageIndex);
        }
      }
    },
    [onSelectVariant, imageVariantTypeId, images, onImageChange]
  );

  if (!variantTypes || variantTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {variantTypes.map((variantType) => {
        const selectedVariant = selectedVariants[variantType.id];
        const isImageVariant = imageVariantTypeId === variantType.id;

        return (
          <div key={variantType.id} className="space-y-2">
            {/* Variant Type Label */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {variantType.title}:
              </span>
              {selectedVariant && (
                <span className="text-sm text-muted-foreground">
                  {selectedVariant.variant_name}
                </span>
              )}
            </div>

            {/* Variant Options */}
            <div className="flex flex-wrap gap-2">
              {variantType.variants?.map((variant) => {
                const isSelected = selectedVariant?.variant_id === variant.id;
                const hasImage = Boolean(variant.image_url);

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType, variant)}
                    className={cn(
                      "relative transition-all duration-200",
                      isImageVariant && hasImage
                        ? "w-14 h-14 sm:w-16 sm:h-16 p-0.5 rounded-md overflow-hidden"
                        : "px-4 py-2 text-sm font-medium rounded-md border",
                      isSelected
                        ? isImageVariant && hasImage
                          ? "ring-2 ring-foreground ring-offset-2"
                          : "bg-foreground text-background border-foreground"
                        : isImageVariant && hasImage
                        ? "border border-gray-200 dark:border-gray-700 hover:border-foreground"
                        : "bg-transparent text-foreground border-gray-300 dark:border-gray-600 hover:border-foreground"
                    )}
                  >
                    {isImageVariant && hasImage ? (
                      <FallbackImage
                        src={getInventoryThumbImageUrl(variant.image_url!)}
                        alt={variant.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      variant.name
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductVariants;
