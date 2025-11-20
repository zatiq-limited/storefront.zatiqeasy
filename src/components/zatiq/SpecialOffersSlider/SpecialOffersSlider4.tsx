import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Card {
  image: string;
  title: string;
  subtitle?: string;
  discount?: string;
  buttonText?: string;
  titleColor?: string;
  textColor?: string;
}

interface SpecialOffersSlider4Props {
  leftCard?: Card;
  rightCard?: Card;
  bgColor?: string;
}

const SpecialOffersSlider4: React.FC<SpecialOffersSlider4Props> = ({
  leftCard = {
    image: '/assets/spOffer/image-left.jpg',
    subtitle: 'Sale 20% off all store',
    title: 'Smartphone\nBLU G91 Pro 2022',
    buttonText: 'Shop Now',
    titleColor: '#010F1C',
    textColor: '#010F1C'
  },
  rightCard = {
    image: '/assets/spOffer/image-right.jpg',
    title: 'HyperX Cloud II\nWireless',
    discount: 'Sale 35% off',
    buttonText: 'Shop Now',
    titleColor: '#010F1C',
    textColor: '#010F1C'
  },
  bgColor = 'transparent'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
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
    <div
      ref={containerRef}
      className="w-full pb-8 md:pb-14 px-4 font-roboto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Card - Large card */}
          {leftCard && (
            <div className={`w-full lg:w-2/3 h-[260px] relative rounded-lg overflow-hidden flex items-center transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 lg:translate-x-0'
                : 'opacity-0 lg:-translate-x-16'
            }`}>
              {/* Background Image */}
              {leftCard.image && (
                <img
                  src={leftCard.image}
                  alt={leftCard.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay Content */}
              <div className="relative z-10 p-6 md:p-8 lg:p-14">
                {leftCard.subtitle && (
                  <p
                    className="text-sm md:text-base mb-1 font-normal leading-6"
                    style={{ color: leftCard.textColor || '#010F1C' }}
                  >
                    {leftCard.subtitle}
                  </p>
                )}
                {leftCard.title && (
                  <h2
                    className="text-xl md:text-2xl lg:text-3xl font-medium mb-2 leading-tight md:leading-9 whitespace-pre-line"
                    style={{ color: leftCard.titleColor || '#010F1C' }}
                  >
                    {leftCard.title}
                  </h2>
                )}
                {leftCard.buttonText && (
                  <button
                    className="inline-flex items-center gap-2 font-medium text-sm leading-6 hover:gap-3 transition-all"
                    style={{ color: leftCard.textColor || '#010F1C' }}
                  >
                    {leftCard.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Card - Small card */}
          {rightCard && (
            <div className={`w-full lg:w-1/3 h-[260px] relative rounded-lg overflow-hidden flex items-center transition-all duration-500 ease-out ${
              isVisible
                ? 'opacity-100 lg:translate-x-0'
                : 'opacity-0 lg:translate-x-16'
            }`}>
              {/* Background Image */}
              {rightCard.image && (
                <img
                  src={rightCard.image}
                  alt={rightCard.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay Content */}
              <div className="relative z-10 p-6 md:p-8 lg:p-10">
                {rightCard.title && (
                  <h2
                    className="text-lg md:text-xl font-medium mb-1 leading-6 whitespace-pre-line"
                    style={{ color: rightCard.titleColor || '#010F1C' }}
                  >
                    {rightCard.title}
                  </h2>
                )}
                {rightCard.discount && (
                  <p
                    className="text-sm md:text-base font-medium leading-6 mb-1"
                    style={{ color: rightCard.textColor || '#010F1C' }}
                  >
                    {rightCard.discount}
                  </p>
                )}
                {rightCard.buttonText && (
                  <button
                    className="inline-flex items-center gap-2 font-medium text-sm leading-6 hover:gap-3 transition-all"
                    style={{ color: rightCard.textColor || '#010F1C' }}
                  >
                    {rightCard.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersSlider4;
