"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Optimized FallbackImage component for fast image loading
 *
 * Usage:
 * - Product cards: priority={false}, sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * - Hero/above-fold: priority={true}, sizes="100vw"
 * - Thumbnails: priority={false}, sizes="150px"
 */
export const FallbackImage = ({
  src,
  fallbackSrc = "/placeholder.jpg",
  alt = "",
  priority = false,
  quality = 80, // Slightly lower quality = smaller file size
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fill,
  width,
  height,
  className,
  ...rest
}: FallbackImageProps) => {
  const [state, setState] = useState({ src, hasError: false, isLoading: true });

  // Reset error state when src prop changes (derived state pattern)
  if (state.src !== src) {
    setState({ src, hasError: false, isLoading: true });
  }

  // Determine the actual source to use
  const actualSrc =
    src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc;
  const displaySrc = state.hasError ? fallbackSrc : actualSrc;

  // Handle image load complete
  const handleLoadComplete = () => {
    if (state.isLoading) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Image
      src={displaySrc}
      alt={alt}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder="empty"
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => {
        if (!state.hasError) {
          setState((prev) => ({ ...prev, hasError: true, isLoading: false }));
        }
      }}
      onLoad={handleLoadComplete}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        ...(state.isLoading && {
          backgroundColor: "#f3f4f6", // Light gray placeholder background
        }),
        ...rest.style,
      }}
      {...rest}
    />
  );
};

export default FallbackImage;
