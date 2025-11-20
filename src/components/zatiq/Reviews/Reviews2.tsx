import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Component-specific types
interface TestimonialBlock {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

interface Reviews2Props {
  settings?: {
    title?: string;
    subtitle?: string;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
  testimonials?: TestimonialBlock[];
}

const Reviews2: React.FC<Reviews2Props> = ({
  settings = {},
  testimonials: testimonialsProps = [],
}) => {
  if (testimonialsProps.length <= 0) return null;
  const testimonials = testimonialsProps;
  const title = settings?.title;
  const subtitle = settings?.subtitle;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Configure autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: settings?.autoplaySpeed || 2000,
      stopOnInteraction: true,
    })
  );

  // Track current slide for 3D effect
  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full pb-8 md:pb-14 font-volkhov">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            {title}
          </h2>
          <p className="text-gray-500 text-sm md:text-base lg:text-lg px-4">
            {subtitle}
          </p>
        </div>

        {/* Triple Slider Carousel - 3D Coverflow Effect */}
        <div className="relative overflow-visible px-4 md:px-8 lg:px-12">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={
              settings?.autoplay !== false ? [autoplayPlugin.current] : []
            }
            setApi={setApi}
            className="w-full overflow-visible"
          >
            <CarouselContent className="-ml-2">
              {testimonials.map((testimonial, index) => {
                // Calculate whether this is the current slide for 3D effect
                const isCurrent = index === current;

                return (
                  <CarouselItem
                    key={index}
                    className="pl-2 basis-full md:basis-1/2 lg:basis-2/5 py-2"
                  >
                    <article
                      className={`
                        rounded-xl md:rounded-2xl bg-white p-4 md:p-5 lg:p-6 h-full
                        transition-all duration-500 ease-out
                        ${
                          isCurrent
                            ? "scale-100 opacity-100 z-10"
                            : "scale-85 opacity-50 blur-[1px] z-0"
                        }
                      `}
                      style={{
                        transform: isCurrent ? "scale(1)" : `scale(0.85)`,
                      }}
                    >
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
                              <span
                                key={i}
                                className="text-orange-400 text-sm md:text-base"
                              >
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
                            <p className="text-xs md:text-sm text-gray-500">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Navigation Buttons - Centered Below */}
          <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            <button
              onClick={() => api?.scrollPrev()}
              className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-gray-400 hover:shadow-lg flex items-center justify-center transition-shadow disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-gray-400 hover:shadow-lg flex items-center justify-center transition-shadow disabled:opacity-50"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews2;
