import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
const image1 = '/assets/Review/image.png';
const image2 = '/assets/Review/image2.png';
const image3 = '/assets/Review/image3.png';

const Reviews1: React.FC = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const reviews = [
    {
      name: 'Victoria Gardner',
      rating: 5,
      comment: 'Very satisfied with the bag! A wonderful shopper, not too big and not too small, but as it should be 👌 The bag looks more expensive than it costs.',
      image: image1
    },
    {
      name: 'Alexandra D.',
      rating: 5,
      comment: 'A wonderful compact bag, holds a lot of things, good tailoring, smooth seams, strong fittings, good quality.',
      image: image2
    },
    {
      name: 'Jenny Wilson',
      rating: 4,
      comment: 'Elegant blouse and the color is very nice, the seams are neat. 🎁 Excellent quality fabric, for summer weather is very good because the fabric is light and does not stick to the body.',
      image: image3
    },
    {
      name: 'Alexandra D.',
      rating: 5,
      comment: 'A wonderful compact bag, holds a lot of things, good tailoring, smooth seams, strong fittings, good quality.',
      image: image2
    },
    {
      name: 'Jenny Wilson',
      rating: 4,
      comment: 'Elegant blouse and the color is very nice, the seams are neat. 🎁 Excellent quality fabric, for summer weather is very good because the fabric is light and does not stick to the body.',
      image: image3
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 lg:mb-12">
          Happy customers
        </h2>

        {/* Swiper Container with Navigation */}
        <div className="relative px-8 md:px-12 overflow-hidden">
          {/* Left Navigation Button */}
          <button
            ref={prevRef}
            className="absolute left-7 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-transparent border border-gray-300 rounded-full flex items-center justify-center p-3 transition-all hover:border-gray-400"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          {/* Right Navigation Button */}
          <button
            ref={nextRef}
            className="absolute right-7 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-transparent border border-gray-300 rounded-full flex items-center justify-center p-3 transition-all hover:border-gray-400"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.custom-pagination',
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper: any) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="reviews-swiper pb-12"
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={i} className="h-auto">
                <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl h-full flex flex-col">
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <div className="shrink-0">
                      <img
                        src={review.image}
                        alt={`Product reviewed by ${review.name}`}
                        className="w-20 h-20 md:w-24 md:h-24 object-contain"
                      />
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 md:gap-1 mb-2">
                        {[...Array(5)].map((_, star) => (
                          <span key={star} className={`text-base md:text-lg ${star < review.rating ? 'text-orange-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>

                      {/* Name */}
                      <h4 className="font-bold text-sm md:text-base text-gray-900 mb-2 md:mb-3">
                        {review.name}
                      </h4>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mt-3 md:mt-4">
                    {review.comment}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Dots */}
          <div className="custom-pagination flex justify-center gap-2 mt-6"></div>
        </div>

        {/* Custom Pagination Styles */}
        <style>{`
          .custom-pagination .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #d1d5db;
            opacity: 1;
            transition: all 0.3s ease;
          }
          .custom-pagination .swiper-pagination-bullet-active {
            background: #f97316;
            width: 24px;
            border-radius: 5px;
          }
          .reviews-swiper .swiper-slide {
            height: auto;
          }
          .reviews-swiper .swiper-slide > div {
            height: 100%;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Reviews1;
