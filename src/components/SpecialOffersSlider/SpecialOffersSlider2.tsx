import React from 'react';

interface SpecialOffersSlider2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Polarized sunglasses for men',
    price: 56.0,
    originalPrice: 80.0,
    discount: '-30% off',
    image: '/assets/SpecialOfferSlider/sunglass.png',
    countdown: {
      days: 12,
      hours: 10,
      minutes: 12,
    },
  },
  {
    id: 2,
    name: 'Polarized sunglasses for men',
    price: 56.0,
    originalPrice: 80.0,
    discount: '-30% off',
    image: '/assets/SpecialOfferSlider/sunglass.png',
    countdown: {
      days: 12,
      hours: 10,
      minutes: 12,
    },
  },
  {
    id: 3,
    name: 'Polarized sunglasses for men',
    price: 56.0,
    originalPrice: 80.0,
    discount: '-30% off',
    image: '/assets/SpecialOfferSlider/sunglass.png',
    countdown: {
      days: 12,
      hours: 10,
      minutes: 12,
    },
  },
];

export default function SpecialOffersSlider2({ settings, blocks, pageData }: SpecialOffersSlider2Props) {
  const products = settings?.products || defaultProducts;

  return (
    <div className="bg-linear-to-br from-[#D4F1E8] to-[#C8E9DD] py-6 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div key={product.id}>
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow py-6 px-4">
                {/* Discount Badge */}
                <div className="relative">
                  <span className="absolute -top-2 left-0 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-md z-10">
                    {product.discount}
                  </span>

                  {/* Product Image */}
                  <div className="flex items-center justify-center bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-64 h-48 object-contain"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="text-center">
                  <h3 className="text-gray-800 font-medium text-sm mb-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      BDT {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      BDT {product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Shop Now Button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg text-xs mb-4">
                    Shop now
                  </button>

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <div className="bg-gray-100 px-3 py-2 rounded-md">
                      <span className="font-semibold text-sm">{product.countdown.days}d</span>
                    </div>
                    <span className="text-gray-400">:</span>
                    <div className="bg-gray-100 px-3 py-2 rounded-md">
                      <span className="font-semibold text-sm">{product.countdown.hours}h</span>
                    </div>
                    <span className="text-gray-400">:</span>
                    <div className="bg-gray-100 px-3 py-2 rounded-md">
                      <span className="font-semibold text-sm">{product.countdown.minutes}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
