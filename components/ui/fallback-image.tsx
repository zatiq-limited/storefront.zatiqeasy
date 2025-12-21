"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/**
 * FallbackImage Component
 * Matches old project's implementation from FallbackImage.js
 * Displays a fallback image if the main image fails to load
 */
export const FallbackImage = ({
  src,
  fallbackSrc = "/placeholder.jpg",
  ...rest
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src as string);

  return (
    <Image
      {...rest}
      src={imgSrc || fallbackSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", ...rest.style }}
    />
  );
};

export default FallbackImage;
