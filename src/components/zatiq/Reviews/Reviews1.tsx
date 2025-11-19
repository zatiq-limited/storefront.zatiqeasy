import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const image1 = '/assets/Review/image.png';
const image2 = '/assets/Review/image2.png';
const image3 = '/assets/Review/image3.png';

const Reviews1: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

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

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered, cardsPerView]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = reviews.length - cardsPerView;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = reviews.length - cardsPerView;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      handlePrev();
    }
  };

  // Calculate transform percentage
  const getTransformValue = () => {
    const cardWidth = 100 / cardsPerView;
    return -(currentIndex * cardWidth);
  };

  // Calculate total pages for pagination
  const totalPages = reviews.length - cardsPerView + 1;

  return (
    <div className="w-full bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 lg:mb-12">
          Happy customers
        </h2>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Navigation Button - Hidden on Mobile */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-transparent border border-gray-300 rounded-full items-center justify-center p-3 transition-all hover:border-gray-400 hover:bg-white"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          {/* Right Navigation Button - Hidden on Mobile */}
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-transparent border border-gray-300 rounded-full items-center justify-center p-3 transition-all hover:border-gray-400 hover:bg-white"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-4 md:gap-5 lg:gap-6"
              style={{
                transform: `translateX(calc(${getTransformValue()}% - ${currentIndex * (cardsPerView === 1 ? 0 : cardsPerView === 2 ? 10 : 12)}px))`
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]"
                >
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
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-orange-500 w-6'
                    : 'bg-gray-300 w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews1;
