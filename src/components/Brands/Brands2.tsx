import React from 'react';

interface Brands2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultBrands = [
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

export default function Brands2({ settings, blocks, pageData }: Brands2Props) {
  const brands = settings?.brands || defaultBrands;

  return (
    <div className="w-full bg-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-[1050px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 lg:gap-x-[30px] gap-y-6 md:gap-y-8">
          {brands.map((brand: any, index: number) => (
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
}
