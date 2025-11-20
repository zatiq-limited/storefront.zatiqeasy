import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const sunglassImage = '/assets/SpecialOfferSlider/sunglass.png';

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

const SpecialOffersSlider2: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Polarized sunglasses for men',
      price: 56.0,
      originalPrice: 80.0,
      discount: '-30% off',
      image: sunglassImage,
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
      image: sunglassImage,
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
      image: sunglassImage,
      countdown: {
        days: 12,
        hours: 10,
        minutes: 12,
      },
    },
    {
      id: 4,
      name: 'Polarized sunglasses for men',
      price: 56.0,
      originalPrice: 80.0,
      discount: '-30% off',
      image: sunglassImage,
      countdown: {
        days: 12,
        hours: 10,
        minutes: 12,
      },
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="w-full max-w-[1296px] mx-auto font-sans px-4 pb-8 md:pb-14">
      {/* Title */}
      <h2 className="w-full max-w-[1296px] font-inter font-semibold text-2xl md:text-[32px] leading-8 md:leading-[42px] tracking-[0%] text-center text-black mb-6 md:mb-8">
        Special offers for you
      </h2>

      {/* Products Container */}
      <div className="relative w-full max-w-[1296px] min-h-[542px] bg-[#DCEEE7] rounded-2xl py-6 px-4 md:px-9">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={`${product.id}-${index}`}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="w-full min-h-[494px] bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
                  {/* Image Container - Upper part of card */}
                  <div className="w-full min-h-72 p-4 flex flex-col">
                    {/* Discount Badge */}
                    <span className="bg-red-500 text-white text-[12px] leading-4 font-medium tracking-[0%] py-2 px-4 rounded gap-1.5 inline-flex items-center justify-center self-start mb-4">
                      {product.discount}
                    </span>

                    {/* Product Image */}
                    <div className="flex items-center justify-center flex-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-[384px] h-auto max-h-[200px] object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="text-center px-4 pb-4">
                    <h3 className="max-w-[362px] mx-auto text-gray-800 font-medium text-[14px] leading-5 tracking-[0%] text-center mb-2">
                      {product.name}
                    </h3>

                    {/* Price Container */}
                    <div className="max-w-[362px] mx-auto flex items-center justify-center gap-2 mb-4">
                      <span className="text-[20px] leading-7 font-semibold tracking-[0%] text-gray-900">
                        BDT {product.price.toFixed(2)}
                      </span>
                      <span className="text-[14px] leading-[21px] font-normal tracking-[0%] text-gray-400 line-through">
                        BDT {product.originalPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Shop Now Button */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] leading-4 font-medium tracking-[0%] py-2 px-4 rounded-md gap-1.5 transition-colors inline-flex items-center justify-center mb-4">
                      <span className="max-w-[57px]">Shop now</span>
                    </button>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-md py-2.5 px-0.5 flex items-center justify-center">
                        <span className="font-semibold text-sm text-gray-700">{product.countdown.days}</span>
                      </div>
                      <span className="text-gray-400">:</span>
                      <div className="w-10 h-10 bg-gray-100 rounded-md py-2.5 px-0.5 flex items-center justify-center">
                        <span className="font-semibold text-sm text-gray-700">{product.countdown.hours}</span>
                      </div>
                      <span className="text-gray-400">:</span>
                      <div className="w-10 h-10 bg-gray-100 rounded-md py-2.5 px-0.5 flex items-center justify-center">
                        <span className="font-semibold text-sm text-gray-700">{product.countdown.minutes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="shadow-md bg-transparent hover:bg-gray-50" />
          <CarouselNext className="shadow-md bg-transparent hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  );
};

export default SpecialOffersSlider2;
