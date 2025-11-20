import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const avatar1 = '/assets/avatar/a1.jpg';
const avatar2 = '/assets/avatar/a2.jpg';
const avatar3 = '/assets/avatar/a3.jpg';

// Component-specific types
interface ReviewBlock {
  name: string;
  comment: string;
  rating: number;
  avatar: string;
}

interface Reviews3Props {
  settings?: {
    title?: string;
    subtitle?: string;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
  reviews?: ReviewBlock[];
}

const Reviews3: React.FC<Reviews3Props> = ({ settings = {}, reviews: reviewsProps = [] }) => {
  // Default review data
  const defaultReviews: ReviewBlock[] = [
    {
      name: 'Amina Rahman',
      comment: 'The portable Bluetooth speaker delivers surprisingly powerful sound for its size. Perfect for outdoor use. I just wish the charging time was a bit shorter. Overall, a solid buy for casual music lovers.',
      rating: 4,
      avatar: avatar1,
    },
    {
      name: 'Liam Ahmed',
      comment: "The smart home camera has decent video quality during the day, but night vision isn't very clear. Setup was easy, but I had some trouble with the app notifications. It does the job, but not perfect.",
      rating: 4,
      avatar: avatar2,
    },
    {
      name: 'Sofia Islam',
      comment: 'I bought the smartwatch mainly for fitness tracking, and it works well for steps and heart rate. But the battery barely lasts two days, which is disappointing. I hope future updates improve the performance.',
      rating: 5,
      avatar: avatar3,
    },
    {
      name: 'Amina Rahman',
      comment: 'The portable Bluetooth speaker delivers surprisingly powerful sound for its size. Perfect for outdoor use. I just wish the charging time was a bit shorter. Overall, a solid buy for casual music lovers.',
      rating: 4,
      avatar: avatar1,
    },
    {
      name: 'Liam Ahmed',
      comment: "The smart home camera has decent video quality during the day, but night vision isn't very clear. Setup was easy, but I had some trouble with the app notifications. It does the job, but not perfect.",
      rating: 4,
      avatar: avatar2,
    },
  ];

  const reviews = reviewsProps.length > 0 ? reviewsProps : defaultReviews;
  const title = settings?.title || 'Customer Opinions';
  const subtitle = settings?.subtitle || 'We are showcasing some user opinions and comments';

  // Carousel API state for custom navigation
  const [api, setApi] = React.useState<CarouselApi>();

  // Configure autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: settings?.autoplaySpeed || 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="w-full bg-gray-50 pb-8 md:pb-14 px-4 font-sans">
      <div className="container mx-auto md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 lg:mb-10 px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                {title}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm lg:text-base">
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
            plugins={settings?.autoplay !== false ? [autoplayPlugin.current] : []}
            setApi={setApi}
            className="w-full overflow-visible"
          >
            <CarouselContent className="-ml-4 md:-ml-5 lg:-ml-6">
              {reviews.map((review, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-5 lg:pl-6 basis-full md:basis-1/2 lg:basis-1/3 py-4 px-2"
                >
                  <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg h-full flex flex-col w-full max-w-full relative z-10">
                    {/* Quote Icon */}
                    <div className="mb-3 md:mb-4">
                      <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                      </svg>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-base md:text-lg lg:text-xl ${i < review.rating ? 'text-orange-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-xs md:text-sm lg:text-base leading-relaxed mb-4 md:mb-6 flex-1">
                      {review.comment}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-2 md:gap-3 mt-auto min-w-0">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                      />
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{review.name}</h4>
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
