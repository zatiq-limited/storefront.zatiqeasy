import React from "react";

interface Block {
  label?: string;
  title?: string;
  linkText?: string;
  buttonText?: string;
  titleColor?: string;
  labelColor?: string;
  image?: string;
  url?: string;
}

interface Category3Props {
  blocks?: Block[];
}

const Category3: React.FC<Category3Props> = ({ blocks = [] }) => {
  return (
    <div className="font-montserrat w-full max-w-[1440px] mx-auto px-4 sm:px-0 pb-8 sm:pb-14">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {blocks.map((card, i) => (
          <div
            key={i}
            className="relative flex-1 min-h-[350px] sm:min-h-[400px] lg:min-h-[434px] overflow-hidden"
          >
            {/* Image Section - Starts 96px from left */}
            {card.image && (
              <div className="absolute top-0 w-full sm:w-[400px] lg:w-[460px] h-full">
                <img
                  src={card.image}
                  alt={card.title || "Category"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Text Content - Positioned on left side of card */}
            <div className="relative min-h-[350px] sm:min-h-[400px] lg:min-h-[434px] flex flex-col justify-center px-6 sm:px-8 lg:px-10 pr-8 z-10">
              {/* Title */}
              {card.title && (
                <h2
                  className="max-w-32 sm:max-w-36 lg:max-w-40 font-bold mb-2 leading-tight sm:leading-[3rem] lg:leading-12 whitespace-pre-line text-3xl sm:text-4xl lg:text-5xl tracking-[0.2px]"
                  style={{ color: card.titleColor || "#252B42" }}
                >
                  {card.title}
                </h2>
              )}

              {/* Small Label */}
              {card.label && (
                <div className="mb-4 sm:mb-5">
                  <span
                    className="font-bold text-xs sm:text-sm tracking-[0.2px] leading-6"
                    style={{ color: card.labelColor || "#E77C40" }}
                  >
                    {card.label}
                  </span>
                </div>
              )}

              {/* Link */}
              {(card.linkText || card.buttonText) && (
                <a
                  href={card.url || "#"}
                  className="font-bold inline-block hover:opacity-80 transition text-xs sm:text-sm underline leading-6 tracking-[0.2px]"
                  style={{ color: card.titleColor || "#252B42" }}
                >
                  {card.linkText || card.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category3;
