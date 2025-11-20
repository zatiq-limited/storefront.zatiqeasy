import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id?: number;
  name?: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  image?: string;
  buttonText?: string;
  url?: string;
}

interface SpecialOffersSlider1Props {
  title?: string;
  titleColor?: string;
  bgColor?: string;
  products?: Product[];
}

const SpecialOffersSlider1: React.FC<SpecialOffersSlider1Props> = ({
  title,
  titleColor,
  bgColor,
  products = []
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="w-full max-w-[1296px] mx-auto font-sans px-4 pb-8 md:pb-14">
      {/* Title */}
      {title && (
        <h2
          className="w-full max-w-[1296px] font-inter font-semibold text-2xl md:text-[32px] leading-8 md:leading-[42px] tracking-[0%] text-center mb-6 md:mb-8"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
      )}

      {/* Products Carousel */}
      {products.length > 0 && (
        <div
          className="relative w-full max-w-[1296px] min-h-[542px] rounded-2xl py-6 px-4 md:px-9"
          style={{ backgroundColor: bgColor }}
        >
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
                  key={product.id || index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="w-full min-h-[494px] bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
                    {/* Image Container - Upper part of card */}
                    <div className="w-full min-h-72 p-4 flex flex-col">
                      {/* Discount Badge */}
                      {product.discount && (
                        <span className="bg-red-500 text-white text-[12px] leading-4 font-medium tracking-[0%] py-2 px-4 rounded gap-1.5 inline-flex items-center justify-center self-start mb-4">
                          {product.discount}
                        </span>
                      )}

                      {/* Product Image */}
                      {product.image && (
                        <div className="flex items-center justify-center flex-1">
                          <img
                            src={product.image}
                            alt={product.name || 'Product'}
                            className="w-full max-w-[384px] h-auto max-h-[200px] object-contain mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="text-center px-4 pb-6">
                      {product.name && (
                        <h3 className="max-w-[362px] mx-auto text-gray-800 font-medium text-[14px] leading-5 tracking-[0%] text-center mb-2">
                          {product.name}
                        </h3>
                      )}

                      {/* Price */}
                      {(product.price !== undefined || product.originalPrice !== undefined) && (
                        <div className="max-w-[362px] mx-auto flex items-center justify-center gap-2 mb-4">
                          {product.price !== undefined && (
                            <span className="text-[20px] leading-7 font-semibold tracking-[0%] text-gray-900">
                              BDT {product.price.toFixed(2)}
                            </span>
                          )}
                          {product.originalPrice !== undefined && (
                            <span className="text-[14px] leading-[21px] font-normal tracking-[0%] text-gray-400 line-through">
                              BDT {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Shop Now Button */}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] leading-4 font-medium tracking-[0%] py-2 px-4 rounded-md gap-1.5 transition-colors inline-flex items-center justify-center">
                        <span className="max-w-[57px]">{product.buttonText || 'Shop now'}</span>
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {products.length > 1 && (
              <>
                <CarouselPrevious className="shadow-md bg-transparent hover:bg-gray-50" />
                <CarouselNext className="shadow-md bg-transparent hover:bg-gray-50" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default SpecialOffersSlider1;
