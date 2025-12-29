"use client";

import { useCallback } from "react";
import { cn, getInventoryThumbImageUrl } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { VariantType, Variant } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface ProductVariantsProps {
  variantTypes: VariantType[];
  selectedVariants: VariantsState;
  onSelectVariant: (
    variantTypeId: number | string,
    variantState: VariantState
  ) => void;
  onImageChange?: (index: number) => void;
  images?: string[];
  imageVariantTypeId?: number;
}

// Normalize URL for comparison (remove query params, trailing slashes, protocol differences)
const normalizeUrl = (url?: string | null): string => {
  if (!url) return "";
  try {
    const cleanUrl = url.split("?")[0].split("#")[0];
    return cleanUrl.replace(/\/$/, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

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
        const imageIndex = images.findIndex(
          (img) => normalizeUrl(img) === normalizeUrl(variant.image_url)
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
    <ul className="flex flex-col gap-4.5">
      {variantTypes.map((variantType) => {
        const selectedVariant = selectedVariants[variantType.id];
        const isImageVariant = imageVariantTypeId === variantType.id;

        if (!variantType.variants?.length) return null;

        return (
          <li key={variantType.id} className="flex flex-col gap-3">
            {/* Variant Type Label */}
            <label className="text-sm sm:text-base font-[450] text-[#4B5563] dark:text-gray-300 capitalize">
              {variantType.title}
            </label>

            {/* Variant Options */}
            <ul className="flex gap-3 flex-wrap">
              {variantType.variants.map((variant) => {
                const isSelected = selectedVariant?.variant_id === variant.id;
                const hasImage = Boolean(variant.image_url);

                return (
                  <li
                    role="button"
                    key={variant.id}
                    onClick={() => handleVariantSelect(variantType, variant)}
                    className={cn(
                      "cursor-pointer transition-colors duration-150 flex items-center justify-center font-medium",
                      isImageVariant && hasImage
                        ? "w-14 h-14 sm:w-16 sm:h-16 p-0.5 rounded-md overflow-hidden border"
                        : "lg:pb-2 lg:pt-2.25 lg:px-6 px-6 pb-2 pt-2.25 rounded-full border-[1.2px] border-[#D1D5DB] dark:border-gray-500 bg-white dark:bg-black-18 text-black-1.2 dark:text-gray-200",
                      isSelected
                        ? isImageVariant && hasImage
                          ? "ring-2 ring-blue-zatiq ring-offset-2 dark:ring-offset-gray-900"
                          : "border-2 border-blue-zatiq/50 dark:border-blue-zatiq/50 bg-blue-zatiq/10 dark:bg-blue-zatiq/10"
                        : isImageVariant && hasImage
                          ? "border-gray-200 dark:border-gray-700 hover:border-foreground"
                          : ""
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
                      <span className="leading-none text-base text-[#4B5563] dark:text-gray-300 font-medium capitalize">
                        {variant.name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

export default ProductVariants;
