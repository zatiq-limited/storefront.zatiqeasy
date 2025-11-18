import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

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
  const swiperRef = useRef<any>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Handle slide change to track current position
  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
  };

  // Auto slide logic for ping-pong effect
  useEffect(() => {
    if (!isPaused && swiperRef.current?.swiper && testimonials.length > 1) {
      const swiper = swiperRef.current.swiper;

      const interval = setInterval(() => {
        const totalSlides = testimonials.length;
        const nextIndex = isReversed ? currentIndex - 1 : currentIndex + 1;

        // Check if we need to reverse direction
        if (!isReversed && currentIndex >= totalSlides - 1) {
          // At the last slide, start going backward
          setIsReversed(true);
          if (currentIndex > 0) {
            swiper.slideTo(currentIndex - 1);
          }
        } else if (isReversed && currentIndex <= 0) {
          // At the first slide, start going forward
          setIsReversed(false);
          if (currentIndex < totalSlides - 1) {
            swiper.slideTo(currentIndex + 1);
          }
        } else {
          // Normal sliding within bounds
          if (nextIndex >= 0 && nextIndex < totalSlides) {
            swiper.slideTo(nextIndex);
          }
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isReversed, isPaused, currentIndex]);

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

        {/* Testimonials Swiper */}
        <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Swiper
            ref={swiperRef}
            loop={false}
            centeredSlides={false}
            grabCursor={true}
            effect="coverflow"
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: false,
            }}
            autoplay={false} // We'll handle autoplay manually
            modules={[Autoplay, EffectCoverflow]}
            onSlideChange={handleSlideChange}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            watchSlidesProgress={true}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="w-full max-w-full transition-transform duration-300">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Reviews2;
