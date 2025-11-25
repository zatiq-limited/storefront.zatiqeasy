import React from "react";

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  description: string;
  url?: string;
}

interface Brands2Settings {
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  grayscale?: boolean;
}

interface Brands2Props {
  settings?: Brands2Settings;
  blocks?: BrandBlock[];
}

const Brands2: React.FC<Brands2Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;

  const {
    title = 'Our Trusted Partners',
    backgroundColor = '#FFFFFF',
    titleColor = '#111827',
    descriptionColor = '#6B7280',
    grayscale = true,
  } = settings;

  const brands = blocks;

  return (
    <div className="w-full py-8 md:py-14 px-4 2xl:px-0" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto">
        {/* Title */}
        {title && (
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 lg:gap-x-[30px] gap-y-6 md:gap-y-8">
          {brands.map((brand, index) => (
            <div key={index} className="flex flex-col items-start">
              {/* Brand Logo */}
              <div className="mb-3 md:mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className={`h-8 sm:h-10 md:h-10 w-10/12 object-contain ${
                    grayscale ? 'grayscale hover:grayscale-0 transition-all duration-300' : ''
                  }`}
                />
              </div>
              {/* Brand Description */}
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: descriptionColor }}
              >
                {brand.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands2;
