import React from "react";

interface Block {
  label?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  labelColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  linkColor?: string;
  buttonText?: string;
  url?: string;
}

interface Category1Props {
  blocks?: Block[];
}

const Category1: React.FC<Category1Props> = ({ blocks = [] }) => {
  return (
    <div className="font-montserrat w-full max-w-[1440px] mx-auto px-4 sm:px-0 mb-8 sm:mb-14">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="relative flex-1 h-[280px] lg:h-[300px] overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${block.image})` }}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/5"></div>

            {/* Left Content Section */}
            <div className="relative z-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-9 py-6 h-full">
              {/* Small Label */}
              {block.label && (
                <div className="mb-3 sm:mb-4 lg:mb-5">
                  <span
                    className="font-bold tracking-[0.2px] leading-6 text-xs sm:text-sm"
                    style={{ color: block.labelColor }}
                  >
                    {block.label}
                  </span>
                </div>
              )}

              {/* Title */}
              {block.title && (
                <h2
                  className="font-bold mb-2 sm:mb-3 leading-7 sm:leading-8 text-xl sm:text-2xl tracking-[0.1px]"
                  style={{ color: block.titleColor }}
                >
                  {block.title}
                </h2>
              )}

              {/* Subtitle */}
              {block.subtitle && (
                <p
                  className="mb-4 sm:mb-5 text-xs sm:text-sm font-normal leading-5 tracking-[0.2px]"
                  style={{ color: block.subtitleColor }}
                >
                  {block.subtitle}
                </p>
              )}

              {/* Link */}
              {block.buttonText && (
                <a
                  href={block.url || "#"}
                  className="font-bold inline-block hover:opacity-80 transition text-xs sm:text-sm underline leading-6 tracking-[0.2px]"
                  style={{ color: block.linkColor }}
                >
                  {block.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category1;
