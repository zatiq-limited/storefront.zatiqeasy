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

interface Reviews2Settings {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  textColor?: string;
  nameColor?: string;
  roleColor?: string;
  starColor?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showAvatar?: boolean;
  showRating?: boolean;
}

interface Reviews2Props {
  settings?: Reviews2Settings;
  testimonials?: TestimonialBlock[];
}

const Reviews2: React.FC<Reviews2Props> = ({
  settings = {},
  testimonials: testimonialsProps = [],
}) => {
  if (testimonialsProps.length <= 0) return null;

  const {
    title = 'Customer Testimonials',
    subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    backgroundColor = '#F9FAFB',
    titleColor = '#111827',
    cardBgColor = '#FFFFFF',
    textColor = '#4B5563',
    nameColor = '#111827',
    roleColor = '#6B7280',
    starColor = '#F97316',
    autoplay = true,
    autoplaySpeed = 2000,
    showAvatar = true,
    showRating = true,
  } = settings;

  const testimonials = testimonialsProps;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Configure autoplay plugin with useMemo to update when settings change
  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: autoplaySpeed,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [autoplaySpeed]
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
    <div className="w-full py-8 md:py-14 font-volkhov" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base lg:text-lg px-4"
            style={{ color: textColor }}
          >
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
            plugins={autoplay ? [autoplayPlugin] : []}
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
                        rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 h-full
                        transition-all duration-500 ease-out
                        ${
                          isCurrent
                            ? "scale-100 opacity-100 z-10"
                            : "scale-85 opacity-50 blur-[1px] z-0"
                        }
                      `}
                      style={{
                        backgroundColor: cardBgColor,
                        transform: isCurrent ? "scale(1)" : `scale(0.85)`,
                      }}
                    >
                      <div className="flex flex-col gap-4 md:gap-6 items-start h-full">
                        {/* Avatar Image */}
                        {showAvatar && (
                          <div className="shrink-0 mx-auto">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 text-center w-full">
                          {/* Review Text */}
                          <p
                            className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4"
                            style={{ color: textColor }}
                          >
                            "{testimonial.text}"
                          </p>

                          {/* Stars */}
                          {showRating && (
                            <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4 justify-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className="text-sm md:text-base"
                                  style={{ color: starColor }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Divider */}
                          <hr className="my-3 md:my-4 border-gray-200" />

                          {/* Name and Role */}
                          <div>
                            <h4
                              className="text-sm md:text-base font-semibold"
                              style={{ color: nameColor }}
                            >
                              {testimonial.name}
                            </h4>
                            <p
                              className="text-xs md:text-sm"
                              style={{ color: roleColor }}
                            >
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
