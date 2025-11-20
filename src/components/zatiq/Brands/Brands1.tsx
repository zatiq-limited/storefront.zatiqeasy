import React from 'react';

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  url?: string;
}

interface Brands1Props {
  settings?: {
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BrandBlock[];
}

const Brands1: React.FC<Brands1Props> = ({ settings = {}, blocks = [] }) => {
  // Default brand data
  const defaultBrands: BrandBlock[] = [
    { name: 'Sony', logo: '/assets/Brands/sony.png' },
    { name: 'Skullcandy', logo: '/assets/Brands/Skullcandy.png' },
    { name: 'Bose', logo: '/assets/Brands/Bose.png' },
    { name: 'Oppo', logo: '/assets/Brands/oppo.png' },
    { name: 'Panasonic', logo: '/assets/Brands/parasonic.png' },
    { name: 'Samsung', logo: '/assets/Brands/samsung.png' },
  ];

  const brands = blocks.length > 0 ? blocks : defaultBrands;

  return (
    <div className="w-full bg-white pb-8 md:pb-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-16">
          {brands.map((brand, index) => (
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
};

export default Brands1;
