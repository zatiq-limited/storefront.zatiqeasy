"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGES } from "@/lib/constants";

interface ProductImageProps {
  /** Primary image URL */
  src: string;
  /** Alternate image shown on hover */
  hoverSrc?: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Container aspect ratio class (default: aspect-square) */
  aspectRatio?: string;
  /** Whether to enable hover zoom effect */
  enableZoom?: boolean;
  /** Whether to enable hover image swap */
  enableHoverSwap?: boolean;
  /** Image sizes for responsive loading */
  sizes?: string;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * Shared ProductImage component
 * Handles image display with hover effects, fallback, and loading states
 */
export function ProductImage({
  src,
  hoverSrc,
  alt,
  className,
  aspectRatio = "aspect-square",
  enableZoom = true,
  enableHoverSwap = true,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority = false,
  onError,
}: ProductImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Determine which image to show
  const displaySrc = hasError
    ? PLACEHOLDER_IMAGES.PRODUCT
    : enableHoverSwap && isHovered && hoverSrc
    ? hoverSrc
    : src || PLACEHOLDER_IMAGES.PRODUCT;

  return (
    <div
      className={cn("relative overflow-hidden", aspectRatio, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={displaySrc}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-transform duration-500 ease-out",
          enableZoom && isHovered && "scale-105"
        )}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    </div>
  );
}

export default ProductImage;
