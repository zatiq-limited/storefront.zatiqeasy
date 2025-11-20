import React, { useEffect, useRef, useState } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface SpecialOffersSlider3Props {
  title?: string;
  titleHighlight?: string;
  highlightColor?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  images?: Image[];
  bgColor?: string;
}

const SpecialOffersSlider3: React.FC<SpecialOffersSlider3Props> = ({
  title = 'Buy Bottle now',
  titleHighlight = '25% off',
  highlightColor = '#2563eb',
  buttonText = 'Buy Now',
  buttonColor = '#2563eb',
  buttonHoverColor = '#1d4ed8',
  images = [],
  bgColor = '#ffffff'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: '100px 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  if (images.length <= 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full px-4 pb-8 md:pb-14 font-sans"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1296px] mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          {/* Top Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt || `Product ${index + 1}`}
                className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              />
            ))}
          </div>

          {/* Text + CTA */}
          <div className="text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {title}
              {titleHighlight && (
                <>
                  <br />and get <span style={{ color: highlightColor }}>{titleHighlight}</span>
                </>
              )}
            </h2>
            <button
              className="font-semibold py-3 px-6 rounded-3xl transition-colors text-base"
              style={{
                backgroundColor: buttonColor,
                color: '#ffffff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonColor}
            >
              {buttonText}
            </button>
          </div>

          {/* Bottom Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {images.slice(2, 4).map((image, index) => (
              <img
                key={index + 2}
                src={image.src}
                alt={image.alt || `Product ${index + 3}`}
                className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Desktop Layout - Artistic Positioning */}
        <div className="hidden lg:block relative h-[580px]">
          {/* Top Left Image */}
          {images[0] && (
            <img
              src={images[0].src}
              alt={images[0].alt}
              className={`absolute top-0 left-[5%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '0ms' }}
            />
          )}

          {/* Top Right Image */}
          {images[1] && (
            <img
              src={images[1].src}
              alt={images[1].alt}
              className={`absolute top-[60px] right-[8%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '100ms' }}
            />
          )}

          {/* Center Content */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-[56px] font-bold text-gray-900 leading-tight mb-8">
              {title}
              {titleHighlight && (
                <>
                  <br />and get <span style={{ color: highlightColor }}>{titleHighlight}</span>
                </>
              )}
            </h2>
            <button
              className="font-semibold py-3 px-6 rounded-3xl transition-colors text-base shadow-lg"
              style={{
                backgroundColor: buttonColor,
                color: '#ffffff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonColor}
            >
              {buttonText}
            </button>
          </div>

          {/* Bottom Left Image */}
          {images[2] && (
            <img
              src={images[2].src}
              alt={images[2].alt}
              className={`absolute bottom-28 left-[20%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '200ms' }}
            />
          )}

          {/* Bottom Right Image */}
          {images[3] && (
            <img
              src={images[3].src}
              alt={images[3].alt}
              className={`absolute bottom-0 right-[25%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '300ms' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider3;
