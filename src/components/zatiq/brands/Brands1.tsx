import React from "react";
import { Marquee } from "@/components/ui/marquee";

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  url?: string;
}

interface Brands1Props {
  settings?: {
    title?: string;
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BrandBlock[];
}

const Brands1: React.FC<Brands1Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;
  const brands = blocks;
  const title = settings?.title;

  return (
    <div className="w-full bg-white pb-8 md:pb-14 px-4">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold text-center mb-6 md:mb-8 text-gray-900">
            {title}
          </h2>
        )}

        {/* Marquee */}
        <Marquee pauseOnHover className="[--duration:40s] [--gap:64px]">
          {brands.map((brand, index) => (
            <div
              key={`brand-${index}`}
              className="flex items-center justify-center"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-4 sm:h-6 md:h-8 w-3/4 object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Brands1;
