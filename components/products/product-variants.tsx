"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VariantOption {
  id: number;
  name: string;
  price?: number;
  image_url?: string | null;
}

interface VariantType {
  id: number;
  title: string;
  variants: VariantOption[];
  is_mandatory: boolean;
}

interface ProductVariantsProps {
  variantTypes: VariantType[];
  selectedVariants: Record<number, VariantOption>;
  onSelectVariant: (
    variantTypeId: number,
    variant: VariantOption,
    canToggle: boolean
  ) => void;
  onImageUpdate?: (imageUrl: string) => void;
  imageVariantTypeId?: number;
}

export const ProductVariants = ({
  variantTypes,
  selectedVariants,
  onSelectVariant,
  onImageUpdate,
  imageVariantTypeId,
}: ProductVariantsProps) => {
  if (!variantTypes || !variantTypes.length) {
    return <></>;
  }

  const handleImageUpdate = (variant: VariantOption, variantTypeId: number) => {
    if (imageVariantTypeId && imageVariantTypeId === variantTypeId) {
      if (variant.image_url && onImageUpdate) {
        onImageUpdate(variant.image_url);
      }
    }
  };

  return (
    <ul className="flex flex-col gap-4.5">
      {variantTypes.map((variantType) =>
        variantType.variants.length ? (
          <li key={variantType.id} className="flex flex-col gap-3">
            <label className="text-sm sm:text-base font-[450] text-[#4B5563] dark:text-gray-300 capitalize">
              {variantType.title}
            </label>
            <ul className="flex gap-3 flex-wrap">
              {variantType.variants.map((variant) => (
                <li
                  role="button"
                  key={variant.id}
                  onClick={() => {
                    onSelectVariant(
                      variantType.id,
                      variant,
                      !variantType.is_mandatory
                    );
                    handleImageUpdate(variant, variantType.id);
                  }}
                  className={cn(
                    "lg:pb-2 lg:pt-2 lg:px-6 px-6 pb-2 pt-2 cursor-pointer rounded-full border-[1.2px] border-[#D1D5DB] dark:border-gray-500 bg-white dark:bg-black-18 text-black-1.2 dark:text-gray-200 transition-colors duration-150 flex items-center justify-center gap-2.5 font-medium",
                    {
                      "border-2 border-blue-zatiq/50 dark:border-blue-zatiq/50 bg-blue-zatiq/10 dark:bg-blue-zatiq/10":
                        selectedVariants[variantType.id]?.id === variant.id,
                    }
                  )}
                >
                  <span className="leading-none text-base text-[#4B5563] dark:text-gray-300 font-medium capitalize">
                    {variant.name}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <React.Fragment key={variantType.id}></React.Fragment>
        )
      )}
    </ul>
  );
};
