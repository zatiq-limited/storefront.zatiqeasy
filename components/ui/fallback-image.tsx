"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export const FallbackImage = ({
  src,
  fallbackSrc = "/placeholder.jpg",
  alt = "",
  ...rest
}: FallbackImageProps) => {
  const [state, setState] = useState({ src, hasError: false });

  // Reset error state when src prop changes (derived state pattern)
  if (state.src !== src) {
    setState({ src, hasError: false });
  }

  // Determine the actual source to use
  // If src is empty/null/undefined, use fallback immediately
  const actualSrc = 
    src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc;
  const displaySrc = state.hasError ? fallbackSrc : actualSrc;

  return (
    <Image
      {...rest}
      alt={alt}
      src={displaySrc}
      onError={() => {
        if (!state.hasError) {
          setState({ src, hasError: true });
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", ...rest.style }}
    />
  );
};

export default FallbackImage;
