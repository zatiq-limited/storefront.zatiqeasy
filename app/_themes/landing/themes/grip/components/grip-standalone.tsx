"use client";

import React from "react";
import Image from "next/image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripStandaloneProps {
  content: ContentInterface | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

export function GripStandalone({ content }: GripStandaloneProps) {
  return (
    <div>
      {content && (
        <div className="relative overflow-hidden group cursor-pointer">
          <div
            className={`w-full ${
              content?.description
                ? "bg-linear-to-b from-white to-violet-50 pb-10 md:pb-16 lg:pb-24 xl:pb-28"
                : ""
            } transition-all duration-500`}
          >
            <div className="container mx-auto flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-[720px] xl:max-w-none mx-auto text-white transform transition-transform duration-500 group-hover:scale-[1.02]">
                {content?.title && (
                  <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl text-landing-primary font-inter text-center transition-colors duration-300 font-semibold">
                    {content?.title}
                  </h1>
                )}
              </div>

              {/* Full Width Image */}
              {content?.image_url && (
                <div className="w-full mt-5 md:mt-8 2xl:mt-11 relative">
                  <Image
                    src={content.image_url}
                    alt={content.title || "Standalone image"}
                    width={1920}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              )}

              {/* Description */}
              {content?.description && (
                <div className="max-w-[720px] xl:max-w-none mx-auto">
                  <p className="font-inter text-black-27 text-center text-sm xl:text-xl 2xl:text-2xl mt-5 md:mt-8 2xl:mt-11 leading-relaxed mx-3 md:mx-10">
                    {content?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GripStandalone;
