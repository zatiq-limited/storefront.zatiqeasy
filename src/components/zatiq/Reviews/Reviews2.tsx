import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'James K.',
    role: 'Traveler',
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    name: 'Alex P.',
    role: 'Designer',
    text: 'I was looking for. Thank you for making it pleasant and most of all hassle free! All is great.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    name: 'Evan W.',
    role: 'Founder',
    text: 'Exactly what I needed for my project. Outstanding quality and amazing customer service throughout.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    name: 'Sarah M.',
    role: 'Business Owner',
    text: 'Exceptional service and product quality. Would highly recommend to anyone looking for premium solutions.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
  {
    name: 'Mike T.',
    role: 'Developer',
    text: 'Best purchase I made this year. The attention to detail is remarkable and the support team is fantastic.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  },
];

const Reviews2: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReversed, setIsReversed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 1024) {
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

  // Ping-pong auto-play effect
  useEffect(() => {
    if (!isPaused && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = testimonials.length - cardsPerView;

          // At the end, reverse direction
          if (!isReversed && prevIndex >= maxIndex) {
            setIsReversed(true);
            return Math.max(0, prevIndex - 1);
          }

          // At the beginning, go forward
          if (isReversed && prevIndex <= 0) {
            setIsReversed(false);
            return Math.min(maxIndex, prevIndex + 1);
          }

          // Continue in current direction
          return isReversed
            ? Math.max(0, prevIndex - 1)
            : Math.min(maxIndex, prevIndex + 1);
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPaused, isReversed, cardsPerView]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = testimonials.length - cardsPerView;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = testimonials.length - cardsPerView;
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

  return (
    <div className="w-full py-8 md:py-12 lg:py-16 bg-gray-50 overflow-hidden font-volkhov">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            This Is What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm md:text-base lg:text-lg px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Navigation Button - Hidden on Mobile */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full items-center justify-center p-3 transition-all hover:border-gray-400 hover:shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          {/* Right Navigation Button - Hidden on Mobile */}
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full items-center justify-center p-3 transition-all hover:border-gray-400 hover:shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-5 lg:gap-6"
              style={{
                transform: `translateX(calc(${getTransformValue()}% - ${currentIndex * (cardsPerView === 1 ? 0 : cardsPerView === 2 ? 10 : cardsPerView === 3 ? 12 : 12)}px))`
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                >
                  <article className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 lg:p-8 shadow-lg h-full hover:shadow-xl transition-shadow w-full">
                    <div className="flex flex-col gap-4 md:gap-6 items-start h-full">
                      {/* Avatar Image */}
                      <div className="shrink-0 mx-auto">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center w-full">
                        {/* Review Text */}
                        <p className="text-xs md:text-sm leading-relaxed text-gray-600 mb-3 md:mb-4">
                          "{testimonial.text}"
                        </p>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-400 text-sm md:text-base">
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Divider */}
                        <hr className="my-3 md:my-4 border-gray-200" />

                        {/* Name and Role */}
                        <div>
                          <h4 className="text-sm md:text-base font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews2;
