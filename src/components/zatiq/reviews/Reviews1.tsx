import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Component-specific types
interface ReviewBlock {
  name: string;
  rating: number;
  comment: string;
  image: string;
}

interface Reviews1Settings {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  textColor?: string;
  nameColor?: string;
  starColor?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showAvatar?: boolean;
  showRating?: boolean;
}

interface Reviews1Props {
  settings?: Reviews1Settings;
  reviews?: ReviewBlock[];
}

const Reviews1: React.FC<Reviews1Props> = ({
  settings = {},
  reviews: reviewsProps = [],
}) => {
  if (reviewsProps.length <= 0) return null;

  const {
    title = 'Customer Reviews',
    subtitle = 'See what our customers are saying',
    backgroundColor = '#F9FAFB',
    titleColor = '#111827',
    cardBgColor = '#FFFFFF',
    textColor = '#4B5563',
    nameColor = '#111827',
    starColor = '#F97316',
    autoplay = true,
    autoplaySpeed = 3000,
    showAvatar = true,
    showRating = true,
  } = settings;

  const reviews = reviewsProps;

  // Configure autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: autoplaySpeed,
      stopOnInteraction: true,
    })
  );

  return (
    <div className="w-full py-8 md:py-14 overflow-hidden font-sans" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={autoplay ? [autoplayPlugin.current] : []}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-5 lg:-ml-6">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-5 lg:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className="p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl h-full flex flex-col"
                  style={{ backgroundColor: cardBgColor }}
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    {showAvatar && (
                      <div className="shrink-0">
                        <img
                          src={review.image}
                          alt={`Product reviewed by ${review.name}`}
                          className="w-20 h-20 md:w-24 md:h-24 object-contain"
                        />
                      </div>
                    )}

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      {/* Stars */}
                      {showRating && (
                        <div className="flex items-center gap-0.5 md:gap-1 mb-2">
                          {[...Array(5)].map((_, star) => (
                            <span
                              key={star}
                              className="text-base md:text-lg"
                              style={{
                                color: star < review.rating ? starColor : '#D1D5DB',
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Name */}
                      <h4
                        className="font-bold text-sm md:text-base mb-2 md:mb-3"
                        style={{ color: nameColor }}
                      >
                        {review.name}
                      </h4>
                    </div>
                  </div>

                  {/* Comment */}
                  <p
                    className="text-xs md:text-sm leading-relaxed mt-3 md:mt-4"
                    style={{ color: textColor }}
                  >
                    {review.comment}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="hidden md:flex border border-gray-300 bg-transparent hover:bg-white hover:border-gray-400 left-0 -translate-x-5" />
          <CarouselNext className="hidden md:flex border border-gray-300 bg-transparent hover:bg-white hover:border-gray-400 right-0 translate-x-5" />
        </Carousel>
      </div>
    </div>
  );
};

export default Reviews1;
