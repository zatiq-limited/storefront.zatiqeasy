import React from 'react';

const Brands3: React.FC = () => {
  const brands = [
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

  return (
    <section className="w-full py-8 md:py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900">
          Shop by brand
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
              src="/src/assets/image/Brands/D/Zara.png"
              alt="Zara"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Brooks */}
          <div className="col-span-2 row-span-2 col-start-1 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/brooks.png"
              alt="Brooks"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* FILA */}
          <div className="row-span-3 col-start-3 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/FILA.png"
              alt="FILA"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Adidas */}
          <div className="row-span-3 col-start-3 row-start-4 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/adidas.png"
              alt="Adidas"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Hermes */}
          <div className="row-span-4 col-start-4 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/hermes.png"
              alt="Hermes"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Dior */}
          <div className="row-span-4 col-start-5 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/Dior.png"
              alt="Dior"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* New Balance */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/NB.png"
              alt="New Balance"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Puma */}
          <div className="row-span-2 col-start-6 row-start-1 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/Puma.png"
              alt="Puma"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* H&M */}
          <div className="row-span-4 col-start-6 row-start-3 border border-gray-200 p-6 lg:p-8 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <img
              src="/src/assets/image/Brands/D/H&M.png"
              alt="H&M"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands3;
