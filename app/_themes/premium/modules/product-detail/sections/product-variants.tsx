"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { VariantType, Variant } from "@/stores/productsStore";
import type { VariantsState, VariantState } from "@/types/cart.types";

interface ProductVariantsProps {
  variantTypes: VariantType[];
  selectedVariants: VariantsState;
  onSelectVariant: (variantTypeId: number | string, variantState: VariantState) => void;
  onImageChange?: (index: number) => void;
  images?: string[];
  imageVariantTypeId?: number | null;
}

export function ProductVariants({
  variantTypes,
  selectedVariants,
  onSelectVariant,
  onImageChange,
  images = [],
  imageVariantTypeId,
}: ProductVariantsProps) {
  if (!variantTypes || variantTypes.length === 0) {
    return null;
  }

  const handleVariantClick = (variantType: VariantType, variant: Variant) => {
    const variantState: VariantState = {
      variant_type_id: variantType.id,
      variant_id: variant.id,
      price: variant.price,
      variant_name: variant.name,
      variant_type_name: variantType.title,
      image_url: variant.image_url ?? undefined,
    };

    onSelectVariant(variantType.id || variantType.title, variantState);

    // Update image if this variant type controls the image
    if (imageVariantTypeId && imageVariantTypeId === variantType.id && onImageChange && variant.image_url) {
      const imageIndex = images.findIndex((img) => img === variant.image_url);
      if (imageIndex !== -1) {
        onImageChange(imageIndex);
      }
    }
  };

  return (
    <ul className="flex flex-col gap-[18px]">
      {variantTypes.map((variantType) =>
        variantType.variants && variantType.variants.length > 0 ? (
          <li key={variantType.id || variantType.title} className="flex flex-col gap-[12px]">
            <label className="text-sm sm:text-base font-[450] text-[#4B5563] dark:text-gray-300 capitalize">
              {variantType.title}
            </label>
            <ul className="flex gap-3 flex-wrap">
              {variantType.variants.map((variant) => {
                const isSelected =
                  selectedVariants[variantType.id || variantType.title]?.variant_id === variant.id;

                return (
                  <li
                    role="button"
                    key={variant.id}
                    onClick={() => handleVariantClick(variantType, variant)}
                    className={cn(
                      "lg:pb-[8px] lg:pt-[9px] lg:px-[24px] px-6 pb-2 pt-[9px] cursor-pointer rounded-full border-[1.2px] border-[#D1D5DB] dark:border-gray-500 bg-white dark:bg-black-18 text-black-1.2 dark:text-gray-200 transition-colors duration-150 flex items-center justify-center gap-[10px] font-medium",
                      {
                        "border-2 border-blue-zatiq/50 dark:border-blue-zatiq/50 bg-blue-zatiq/10 dark:bg-blue-zatiq/10":
                          isSelected,
                      }
                    )}
                  >
                    <span className="leading-none text-base text-[#4B5563] dark:text-gray-300 font-medium capitalize">
                      {variant.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ) : null
      )}
    </ul>
  );
}

export default ProductVariants;
