import React from 'react';
const sony = '/assets/Brands/sony.png';
const skullcandy = '/assets/Brands/Skullcandy.png';
const bose = '/assets/Brands/Bose.png';
const oppo = '/assets/Brands/oppo.png';
const panasonic = '/assets/Brands/parasonic.png';
const samsung = '/assets/Brands/samsung.png';

const brands = [
  { name: 'Sony', logo: sony },
  { name: 'Skullcandy', logo: skullcandy },
  { name: 'Bose', logo: bose },
  { name: 'Oppo', logo: oppo },
  { name: 'Panasonic', logo: panasonic },
  { name: 'Samsung', logo: samsung },
];

const Brands1: React.FC = () => {
  return (
    <div className="w-full bg-white py-8 md:py-12 px-4 md:px-8">
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
