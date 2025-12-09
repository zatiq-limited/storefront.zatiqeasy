import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Component-specific types
interface ReviewBlock {
  name?: string;
  author?: string;
  comment?: string;
  rating?: number;
  avatar?: string;
}

interface Reviews3Settings {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  textColor?: string;
  nameColor?: string;
  starColor?: string;
  quoteColor?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showAvatar?: boolean;
  showRating?: boolean;
}

interface Reviews3Props {
  settings?: Reviews3Settings;
  reviews?: ReviewBlock[];
  blocks?: ReviewBlock[];
}

const Reviews3: React.FC<Reviews3Props> = ({
  settings = {},
  reviews: reviewsProps = [],
  blocks = [],
}) => {
  // Support both reviews prop and blocks from JSON
  const reviewsData = blocks.length > 0 ? blocks : reviewsProps;
  if (reviewsData.length <= 0) return null;

  const {
    title = 'Customer Reviews',
    subtitle = 'We are showcasing some user opinions and comments',
    backgroundColor = '#F9FAFB',
    titleColor = '#111827',
    cardBgColor = '#FFFFFF',
    textColor = '#374151',
    nameColor = '#111827',
    starColor = '#F97316',
    quoteColor = '#D1D5DB',
    autoplay = true,
    autoplaySpeed = 3000,
    showAvatar = true,
    showRating = true,
  } = settings;

  // Normalize review data to handle both formats
  const reviews = reviewsData.map((review) => ({
    name: review.name || review.author || 'Anonymous',
    comment: review.comment || '',
    rating: review.rating || 5,
    avatar: review.avatar || '',
  }));

  // Carousel API state for custom navigation
  const [api, setApi] = React.useState<CarouselApi>();

  // Configure autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: autoplaySpeed,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <div className="w-full py-8 md:py-14 px-4 font-sans" style={{ backgroundColor }}>
      <div className="container mx-auto md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 lg:mb-10 px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
              <p
                className="text-xs md:text-sm lg:text-base"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 md:gap-3 shrink-0">
              <button
                onClick={() => api?.scrollPrev()}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-shadow"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-shadow"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-full px-4 overflow-visible">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={autoplay ? [autoplayPlugin.current] : []}
            setApi={setApi}
            className="w-full overflow-visible"
          >
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-5 lg:pl-6 basis-full md:basis-1/2 lg:basis-1/3 py-4 px-2"
                >
                  <div
                    className="p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg h-full flex flex-col w-full max-w-full relative z-10"
                    style={{ backgroundColor: cardBgColor }}
                  >
                    {/* Quote Icon */}
                    <div className="mb-3 md:mb-4">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: quoteColor }}
                      >
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                      </svg>
                    </div>

                    {/* Star Rating */}
                    {showRating && (
                      <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-base md:text-lg lg:text-xl"
                            style={{
                              color: i < review.rating ? starColor : '#D1D5DB',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Review Text */}
                    <p
                      className="text-xs md:text-sm lg:text-base leading-relaxed mb-4 md:mb-6 flex-1"
                      style={{ color: textColor }}
                    >
                      {review.comment}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-2 md:gap-3 mt-auto min-w-0">
                      {showAvatar && (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                        />
                      )}
                      <h4
                        className="font-semibold text-sm md:text-base truncate"
                        style={{ color: nameColor }}
                      >
                        {review.name}
                      </h4>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Reviews3;
