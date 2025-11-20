import React from 'react';

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
  // Default brand data
  const defaultBrands: BrandBlock[] = [
    { name: 'Zara', image: '/src/assets/image/Brands/D/Zara.png' },
    { name: 'Brooks', image: '/src/assets/image/Brands/D/brooks.png' },
    { name: 'FILA', image: '/src/assets/image/Brands/D/FILA.png' },
    { name: 'Adidas', image: '/src/assets/image/Brands/D/adidas.png' },
    { name: 'Hermes', image: '/src/assets/image/Brands/D/hermes.png' },
    { name: 'Dior', image: '/src/assets/image/Brands/D/Dior.png' },
    { name: 'New Balance', image: '/src/assets/image/Brands/D/NB.png' },
    { name: 'Puma', image: '/src/assets/image/Brands/D/Puma.png' },
    { name: 'H&M', image: '/src/assets/image/Brands/D/H&M.png' },
  ];

  const brands = blocks.length > 0 ? blocks : defaultBrands;
  const title = settings?.title || 'Shop by brand';

  return (
    <section className="w-full pb-8 md:pb-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
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
              src={brands[0]?.image || "/src/assets/image/Brands/D/Zara.png"}
              alt={brands[0]?.name || "Zara"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Brooks */}
          <div className="col-span-2 row-span-2 col-start-1 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[1]?.image || "/src/assets/image/Brands/D/brooks.png"}
              alt={brands[1]?.name || "Brooks"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* FILA */}
          <div className="row-span-3 col-start-3 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[2]?.image || "/src/assets/image/Brands/D/FILA.png"}
              alt={brands[2]?.name || "FILA"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Adidas */}
          <div className="row-span-3 col-start-3 row-start-4 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[3]?.image || "/src/assets/image/Brands/D/adidas.png"}
              alt={brands[3]?.name || "Adidas"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Hermes */}
          <div className="row-span-4 col-start-4 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[4]?.image || "/src/assets/image/Brands/D/hermes.png"}
              alt={brands[4]?.name || "Hermes"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Dior */}
          <div className="row-span-4 col-start-5 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[5]?.image || "/src/assets/image/Brands/D/Dior.png"}
              alt={brands[5]?.name || "Dior"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* New Balance */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[6]?.image || "/src/assets/image/Brands/D/NB.png"}
              alt={brands[6]?.name || "New Balance"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Puma */}
          <div className="row-span-2 col-start-6 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[7]?.image || "/src/assets/image/Brands/D/Puma.png"}
              alt={brands[7]?.name || "Puma"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* H&M */}
          <div className="row-span-4 col-start-6 row-start-3 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src={brands[8]?.image || "/src/assets/image/Brands/D/H&M.png"}
              alt={brands[8]?.name || "H&M"}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands3;
