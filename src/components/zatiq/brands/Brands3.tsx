import React from "react";

// Component-specific types
interface BrandBlock {
  name: string;
  image: string;
  url?: string;
}

interface Brands3Settings {
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
  grayscale?: boolean;
}

interface Brands3Props {
  settings?: Brands3Settings;
  blocks?: BrandBlock[];
}

// Layout pattern for Pinterest/masonry-style grid (matches original 9-brand design)
const layoutPattern: string[] = [
  "col-span-2 row-span-4", // 0 - large left block
  "col-span-2 row-span-2", // 1 - wide short below large
  "col-span-1 row-span-3", // 2 - tall narrow
  "col-span-1 row-span-3", // 3 - tall narrow
  "col-span-1 row-span-4", // 4 - tall
  "col-span-1 row-span-4", // 5 - tall
  "col-span-2 row-span-2", // 6 - wide short
  "col-span-1 row-span-2", // 7 - small
  "col-span-1 row-span-4", // 8 - tall
];

const Brands3: React.FC<Brands3Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;

  const {
    title = "Featured Brands",
    backgroundColor = "#FFFFFF",
    titleColor = "#111827",
    grayscale = false,
  } = settings;

  const brands = blocks;

  const commonCardClasses =
    "border border-gray-200 p-6 lg:p-8 flex items-center justify-center " +
    "hover:border-gray-300 hover:shadow-md transition-all duration-300 " +
    "cursor-pointer bg-white";

  const imgClasses = (hasGrayscale: boolean) =>
    `max-w-full max-h-full object-contain ${
      hasGrayscale ? "grayscale hover:grayscale-0 transition-all duration-300" : ""
    }`;

  const renderBrandCard = (brand: BrandBlock, index: number) => {
    const patternClass = layoutPattern[index % layoutPattern.length];

    const card = (
      <div key={index} className={`${commonCardClasses} ${patternClass}`}>
        <img
          src={brand.image}
          alt={brand.name}
          className={imgClasses(grayscale)}
        />
      </div>
    );

    if (brand.url) {
      return (
        <a key={index} href={brand.url} target="_blank" rel="noreferrer">
          {card}
        </a>
      );
    }

    return card;
  };

  return (
    <section
      className="w-full pb-8 md:pb-14 px-4 2xl:px-0"
      style={{ backgroundColor }}
    >
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

        {/* Mobile: Simple Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white aspect-square"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className={imgClasses(grayscale)}
              />
            </div>
          ))}
        </div>

        {/* Desktop: Pinterest/Masonry-style Grid */}
        <div
          className="hidden md:grid grid-cols-6 auto-rows-[60px] gap-0"
          style={{ gridAutoFlow: "dense" }}
        >
          {brands.map((brand, index) => renderBrandCard(brand, index))}
        </div>
      </div>
    </section>
  );
};

export default Brands3;
