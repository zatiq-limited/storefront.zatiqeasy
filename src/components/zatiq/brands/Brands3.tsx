import React from "react";

// Component-specific types
interface BrandBlock {
  name: string;
  image: string;
  url?: string;
}

interface Brands3Props {
  settings?: {
    title?: string;
    backgroundColor?: string;
  };
  blocks?: BrandBlock[];
}

const Brands3: React.FC<Brands3Props> = ({ settings = {}, blocks = [] }) => {
  if (blocks.length <= 0) return null;
  const brands = blocks;
  const title = settings?.title;

  return (
    <section className="w-full pb-8 md:pb-14 px-4 2xl:px-0">
      <div className="max-w-[1440px] mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900">
          {title}
        </h2>

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
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Desktop: Complex Grid Layout */}
        <div className="hidden md:grid grid-cols-6 grid-rows-6 gap-0">
          {/* Zara - Large */}
          <div className="col-span-2 row-span-4 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[0]?.image}
              alt={brands[0]?.name }
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Brooks */}
          <div className="col-span-2 row-span-2 col-start-1 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[1]?.image}
              alt={brands[1]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* FILA */}
          <div className="row-span-3 col-start-3 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[2]?.image}
              alt={brands[2]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Adidas */}
          <div className="row-span-3 col-start-3 row-start-4 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[3]?.image}
              alt={brands[3]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Hermes */}
          <div className="row-span-4 col-start-4 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[4]?.image}
              alt={brands[4]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Dior */}
          <div className="row-span-4 col-start-5 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[5]?.image}
              alt={brands[5]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* New Balance */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[6]?.image}
              alt={brands[6]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Puma */}
          <div className="row-span-2 col-start-6 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[7]?.image}
              alt={brands[7]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* H&M */}
          <div className="row-span-4 col-start-6 row-start-3 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[8]?.image}
              alt={brands[8]?.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands3;
