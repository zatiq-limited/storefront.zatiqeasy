import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const image1 = '/assets/Review/image.png';
const image2 = '/assets/Review/image2.png';
const image3 = '/assets/Review/image3.png';

// Component-specific types
interface ReviewBlock {
  name: string;
  rating: number;
  comment: string;
  image: string;
}

interface Reviews1Props {
  settings?: {
    title?: string;
    subtitle?: string;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
  reviews?: ReviewBlock[];
}

const Reviews1: React.FC<Reviews1Props> = ({ settings = {}, reviews: reviewsProps = [] }) => {
  // Default review data
  const defaultReviews: ReviewBlock[] = [
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

  const reviews = reviewsProps.length > 0 ? reviewsProps : defaultReviews;
  const title = settings?.title || 'Happy customers';

  // Configure autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: settings?.autoplaySpeed || 3000, stopOnInteraction: true })
  );

  return (
    <div className="w-full bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 lg:mb-12">
          {title}
        </h2>

        {/* Carousel Container */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={settings?.autoplay !== false ? [autoplayPlugin.current] : []}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-5 lg:-ml-6">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-5 lg:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
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
