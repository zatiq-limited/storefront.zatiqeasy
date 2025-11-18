import React from 'react';

interface Brands3Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultBrands = [
  { name: 'Zara', image: '/assets/Brands/D/Zara.png' },
  { name: 'Brooks', image: '/assets/Brands/D/brooks.png' },
  { name: 'FILA', image: '/assets/Brands/D/FILA.png' },
  { name: 'Adidas', image: '/assets/Brands/D/adidas.png' },
  { name: 'Hermes', image: '/assets/Brands/D/hermes.png' },
  { name: 'Dior', image: '/assets/Brands/D/Dior.png' },
  { name: 'New Balance', image: '/assets/Brands/D/NB.png' },
  { name: 'Puma', image: '/assets/Brands/D/Puma.png' },
  { name: 'H&M', image: '/assets/Brands/D/H&M.png' },
];

export default function Brands3({ settings, blocks, pageData }: Brands3Props) {
  const brands = settings?.brands || defaultBrands;
  const title = settings?.title || 'Shop by brand';

  return (
    <section className="w-full py-8 md:py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900">
          {title}
        </h2>

        {/* Mobile: Simple Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
          {brands.map((brand: any, index: number) => (
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
              src="/assets/Brands/D/Zara.png"
              alt="Zara"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Brooks */}
          <div className="col-span-2 row-span-2 col-start-1 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/brooks.png"
              alt="Brooks"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* FILA */}
          <div className="row-span-3 col-start-3 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/FILA.png"
              alt="FILA"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Adidas */}
          <div className="row-span-3 col-start-3 row-start-4 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/adidas.png"
              alt="Adidas"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Hermes */}
          <div className="row-span-4 col-start-4 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/hermes.png"
              alt="Hermes"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Dior */}
          <div className="row-span-4 col-start-5 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/Dior.png"
              alt="Dior"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* New Balance */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/NB.png"
              alt="New Balance"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Puma */}
          <div className="row-span-2 col-start-6 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/Puma.png"
              alt="Puma"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* H&M */}
          <div className="row-span-4 col-start-6 row-start-3 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/assets/Brands/D/H&M.png"
              alt="H&M"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
