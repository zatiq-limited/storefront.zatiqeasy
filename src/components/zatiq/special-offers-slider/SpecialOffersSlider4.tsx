import React from 'react';
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

// Block from homepage.json (snake_case format)
interface PromoCardBlock {
  position?: 'left' | 'right';
  image?: string;
  title?: string;
  subtitle?: string;
  discount?: string;
  button_text?: string;
  button_link?: string;
  title_color?: string;
  text_color?: string;
}

interface SpecialOffersSlider4Settings {
  bgColor?: string;
}

interface SpecialOffersSlider4Props {
  leftCard?: Card;
  rightCard?: Card;
  bgColor?: string;
  blocks?: PromoCardBlock[];
  settings?: SpecialOffersSlider4Settings;
}

const SpecialOffersSlider4: React.FC<SpecialOffersSlider4Props> = ({
  leftCard: leftCardProp,
  rightCard: rightCardProp,
  bgColor: bgColorProp,
  blocks = [],
  settings = {},
}) => {
  // Get bgColor from settings or direct prop
  const bgColor = bgColorProp ?? settings.bgColor ?? 'transparent';

  // Convert blocks to left/right cards if blocks are provided
  let leftCard = leftCardProp;
  let rightCard = rightCardProp;

  if (blocks.length > 0) {
    // Find left and right cards from blocks
    const leftBlock = blocks.find(b => b.position === 'left') || blocks[0];
    const rightBlock = blocks.find(b => b.position === 'right') || blocks[1];

    if (leftBlock && !leftCard) {
      leftCard = {
        image: leftBlock.image || '',
        title: leftBlock.title || '',
        subtitle: leftBlock.subtitle,
        discount: leftBlock.discount,
        buttonText: leftBlock.button_text,
        titleColor: leftBlock.title_color,
        textColor: leftBlock.text_color,
      };
    }

    if (rightBlock && !rightCard) {
      rightCard = {
        image: rightBlock.image || '',
        title: rightBlock.title || '',
        subtitle: rightBlock.subtitle,
        discount: rightBlock.discount,
        buttonText: rightBlock.button_text,
        titleColor: rightBlock.title_color,
        textColor: rightBlock.text_color,
      };
    }
  }
  return (
    <div
      className="w-full pb-8 md:pb-14 px-4 font-roboto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Card - Large card */}
          {leftCard && (
            <div className="w-full lg:w-2/3 h-[260px] relative rounded-lg overflow-hidden flex items-center">
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
            <div className="w-full lg:w-1/3 h-[260px] relative rounded-lg overflow-hidden flex items-center">
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
