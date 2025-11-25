import React from "react";

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  url?: string;
}

interface Brands1Settings {
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  grayscale?: boolean;
}

interface Brands1Props {
  settings?: Brands1Settings;
  blocks?: BrandBlock[];
}

const Brands1: React.FC<Brands1Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;

  const {
    title = 'Our Brand Partners',
    backgroundColor = '#FFFFFF',
    titleColor = '#111827',
    grayscale = true,
  } = settings;

  const brands = blocks;

  return (
    <div className="w-full py-8 md:py-14 px-4" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Title */}
        {title && (
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-16">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className={`h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300 hover:scale-110 ${
                  grayscale ? 'grayscale hover:grayscale-0' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands1;
