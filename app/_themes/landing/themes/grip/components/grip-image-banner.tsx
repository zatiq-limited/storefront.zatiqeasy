"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripImageBannerProps {
  content?: ContentInterface[] | ContentInterface | null;
}

export function GripImageBanner({ content }: GripImageBannerProps) {
  // Accept either an array of banners or a single banner object
  const banner = useMemo(() => {
    if (!content) return null;
    if (Array.isArray(content)) return content.length > 0 ? content[0] : null;
    return content;
  }, [content]);

  const title = banner?.title;
  const imageSrc = banner?.image_url;

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="pb-10 md:pb-16 lg:pb-24 xl:pb-28 space-y-10">
      {title && (
        <h2 className="text-grip-black dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold text-center">
          {title}
        </h2>
      )}

      <Image
        src={imageSrc}
        alt={title || "Banner image"}
        width={1920}
        height={1080}
        className="w-full h-auto rounded-md"
      />
    </div>
  );
}

export default GripImageBanner;
