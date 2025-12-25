"use client";

import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripImageBannerProps {
  content: ContentInterface | null | undefined;
}

export function GripImageBanner({ content }: GripImageBannerProps) {
  if (!content?.image_url) {
    return null;
  }

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-2xl">
          <FallbackImage
            src={content.image_url}
            alt={content.title || "Banner"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default GripImageBanner;
