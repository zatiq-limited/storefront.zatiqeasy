import React from 'react';

// Component-specific types
interface BrandBlock {
  name: string;
  logo: string;
  description: string;
  url?: string;
}

interface Brands2Props {
  settings?: {
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BrandBlock[];
}

const Brands2: React.FC<Brands2Props> = ({ settings = {}, blocks = [] }) => {
  // Default brand data
  const defaultBrands: BrandBlock[] = [
    {
      name: 'Sony',
      logo: '/assets/Brands/sony.png',
      description: 'Get your best looking smile now!',
    },
    {
      name: 'Skullcandy',
      logo: '/assets/Brands/Skullcandy.png',
      description: 'DentalCare is most focused in helping you discover your most beautiful smile',
    },
    {
      name: 'Bose',
      logo: '/assets/Brands/Bose.png',
      description: 'Overcame any hurdle or any other problem.',
    },
    {
      name: 'Oppo',
      logo: '/assets/Brands/oppo.png',
      description: 'Overcame any hurdle or any other problem.',
    },
    {
      name: 'Samsung',
      logo: '/assets/Brands/samsung.png',
      description: 'Get your best looking smile now!',
    },
    {
      name: 'Philips',
      logo: '/assets/Brands/Philips.png',
      description: 'DentalCare is most focused in helping you discover your most beautiful smile',
    },
    {
      name: 'Oracle',
      logo: '/assets/Brands/oracle.png',
      description: 'Overcame any hurdle or any other problem.',
    },
    {
      name: 'Dell',
      logo: '/assets/Brands/Dell.png',
      description: 'Overcame any hurdle or any other problem.',
    },
  ];

  const brands = blocks.length > 0 ? blocks : defaultBrands;

  return (
    <div className="w-full bg-white pb-8 md:pb-14 px-4">
      <div className="max-w-[1050px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 lg:gap-x-[30px] gap-y-6 md:gap-y-8">
          {brands.map((brand, index) => (
            <div key={index} className="flex flex-col items-start">
              {/* Brand Logo */}
              <div className="mb-3 md:mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-10 md:h-10 w-10/12 object-contain"
                />
              </div>
              {/* Brand Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
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
