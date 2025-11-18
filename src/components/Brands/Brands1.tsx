import React from 'react';

interface Brands1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultBrands = [
  { name: 'Sony', logo: '/assets/Brands/sony.png' },
  { name: 'Skullcandy', logo: '/assets/Brands/Skullcandy.png' },
  { name: 'Bose', logo: '/assets/Brands/Bose.png' },
  { name: 'Oppo', logo: '/assets/Brands/oppo.png' },
  { name: 'Panasonic', logo: '/assets/Brands/parasonic.png' },
  { name: 'Samsung', logo: '/assets/Brands/samsung.png' },
];

export default function Brands1({ settings, blocks, pageData }: Brands1Props) {
  const brands = settings?.brands || defaultBrands;

  return (
    <div className="w-full bg-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-16">
          {brands.map((brand: any, index: number) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
