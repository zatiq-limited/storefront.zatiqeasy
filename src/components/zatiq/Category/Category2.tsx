import React from "react";

interface Block {
  label?: string;
  title?: string;
  linkText?: string;
  buttonText?: string;
  textColor?: string;
  titleColor?: string;
  labelColor?: string;
  image?: string;
  url?: string;
}

interface Category2Props {
  blocks?: Block[];
}

const Category2: React.FC<Category2Props> = ({ blocks = [] }) => {
  return (
    <div className="font-montserrat w-full max-w-[1440px] mx-auto px-4 2xl:px-0 pb-8 sm:pb-14">
      <div className="flex flex-col sm:flex-row h-[300px] gap-4 sm:gap-6 lg:gap-8">
        {blocks.map((card, i) => (
          <div
            key={i}
            className="relative flex-1 overflow-hidden"
          >
            {/* Full Background Image */}
            {card.image && (
              <img
                src={card.image}
                alt={card.title || "Category"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Content Overlay - Right Aligned */}
            <div className="relative h-full flex flex-col justify-center items-end text-right px-6 sm:px-10 lg:pr-12">
              {/* Small Label */}
              {card.label && (
                <div className="mb-1 sm:mb-3">
                  <span
                    className="font-bold text-xs sm:text-sm leading-6 tracking-[0.2px]"
                    style={{ color: card.labelColor }}
                  >
                    {card.label}
                  </span>
                </div>
              )}

              {/* Title */}
              {card.title && (
                <h2
                  className="font-bold mb-2 sm:mb-5 leading-7 sm:leading-12 whitespace-pre-line text-2xl sm:text-4xl tracking-[0.2px]"
                  style={{ color: card.textColor || card.titleColor }}
                >
                  {card.title}
                </h2>
              )}

              {/* Link */}
              {(card.linkText || card.buttonText) && (
                <a
                  href={card.url || "#"}
                  className="font-normal inline-block hover:opacity-80 transition text-xs sm:text-sm underline tracking-[0.2px] leading-4"
                  style={{ color: card.textColor || card.titleColor }}
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

export default Category2;
