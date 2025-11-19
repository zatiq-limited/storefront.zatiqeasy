import React, { useEffect, useRef, useState } from 'react';
const sp1 = '/assets/spOffer/sp1.png';
const sp2 = '/assets/spOffer/sp2.png';
const sp3 = '/assets/spOffer/sp3.png';
const sp4 = '/assets/spOffer/sp4.png';

const SpecialOffersSlider3: React.FC = () => {
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

  return (
    <div ref={containerRef} className="w-full bg-white px-4 pb-8 md:pb-14 font-sans ">
      <div className="max-w-[1296px] mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          {/* Top Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img
              src={sp1}
              alt="Bottle 1"
              className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '0ms' }}
            />
            <img
              src={sp2}
              alt="Bottle 2"
              className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '100ms' }}
            />
          </div>

          {/* Text + CTA */}
          <div className="text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Buy Bottle now<br />and get <span className="text-blue-600">25% off</span>
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-3xl transition-colors text-base">
              Buy Now
            </button>
          </div>

          {/* Bottom Images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img
              src={sp3}
              alt="Bottle 3"
              className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '200ms' }}
            />
            <img
              src={sp4}
              alt="Bottle 4"
              className={`w-full aspect-square object-cover rounded-xl transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: '300ms' }}
            />
          </div>
        </div>

        {/* Desktop Layout - Artistic Positioning */}
        <div className="hidden lg:block relative h-[580px]">
          {/* Top Left Bottle */}
          <img
            src={sp1}
            alt="Bottle 1"
            className={`absolute top-0 left-[5%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: '0ms' }}
          />

          {/* Top Right Bottle */}
          <img
            src={sp2}
            alt="Bottle 2"
            className={`absolute top-[60px] right-[8%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: '100ms' }}
          />

          {/* Center Content */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-[56px] font-bold text-gray-900 leading-tight mb-8">
              Buy Bottle now<br />and get <span className="text-blue-600">25% off</span>
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-3xl transition-colors text-base shadow-lg">
              Buy Now
            </button>
          </div>

          {/* Bottom Left Bottle */}
          <img
            src={sp3}
            alt="Bottle 3"
            className={`absolute bottom-28 left-[20%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: '200ms' }}
          />

          {/* Bottom Right Bottle */}
          <img
            src={sp4}
            alt="Bottle 4"
            className={`absolute bottom-0 right-[25%] w-[196px] h-[196px] object-cover rounded-xl shadow-lg transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider3;
