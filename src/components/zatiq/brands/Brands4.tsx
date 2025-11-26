import React from "react";
import { Marquee } from "@/components/ui/marquee";

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  url?: string;
}

interface Brands4Props {
  settings?: {
    title?: string;
    backgroundColor?: string;
  };
  blocks?: BrandBlock[];
}

const Brands4: React.FC<Brands4Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;
  const brands = blocks;
  const title = settings?.title;

  return (
    <div className="w-full font-montserrat bg-white pb-8 md:pb-14 px-4">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold text-center mb-6 md:mb-8 text-gray-900">
            {title}
          </h2>
        )}

        {/* Marquee */}
        <Marquee pauseOnHover className="[--duration:40s] [--gap:48px]">
          {brands.map((brand, index) => (
            <div
              key={`brand-${index}`}
              className="flex items-center justify-center"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-6 sm:h-8 md:h-10 w-auto object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Brands4;
