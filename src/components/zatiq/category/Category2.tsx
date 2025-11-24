import React from "react";

interface Block {
  label?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  linkText?: string;
  buttonText?: string;
  textColor?: string;
  titleColor?: string;
  labelColor?: string;
  subtitleColor?: string;
  linkColor?: string;
  image?: string;
  backgroundImage?: string;
  productImage?: string;
  url?: string;
}

interface Category2Settings {
  overlayOpacity?: number;
  showLabel?: boolean;
  showProductImage?: boolean;
  defaultLabelColor?: string;
  defaultTitleColor?: string;
  defaultSubtitleColor?: string;
  defaultLinkColor?: string;
  defaultButtonText?: string;
}

interface Category2Props {
  settings?: Category2Settings;
  blocks?: Block[];
}

const Category2: React.FC<Category2Props> = ({ settings = {}, blocks = [] }) => {
  const {
    overlayOpacity = 10,
    showLabel = true,
    showProductImage = false,
    defaultLabelColor = "#E77C40",
    defaultTitleColor = "#252B42",
    defaultSubtitleColor = "#737373",
    defaultLinkColor = "#252B42",
    defaultButtonText = "Explore Items",
  } = settings;

  // Return null if no blocks
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="font-montserrat w-full max-w-[1440px] mx-auto px-4 2xl:px-0 mb-8 sm:mb-14">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {blocks.map((block, i) => {
          const labelColor = block.labelColor || defaultLabelColor;
          const titleColor = block.titleColor || block.textColor || defaultTitleColor;
          const subtitleColor = block.subtitleColor || defaultSubtitleColor;
          const linkColor = block.linkColor || block.textColor || defaultLinkColor;
          const buttonText = block.buttonText || block.linkText || defaultButtonText;
          const title = block.title || block.name || "";

          // Use backgroundImage if available, fallback to image
          const bgImage = block.backgroundImage || block.image;
          const prodImage = block.productImage;

          return (
            <div
              key={i}
              className="relative flex-1 h-[280px] lg:h-[300px] overflow-hidden bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
            >
              {/* Background Overlay */}
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity / 100 }}
              ></div>

              {/* Content Container */}
              <div className="relative z-10 flex items-center h-full">
                {/* Left Product Image */}
                {showProductImage && prodImage && (
                  <div className="shrink-0 w-1/3 lg:w-2/5 h-full flex items-center justify-center p-4">
                    <img
                      src={prodImage}
                      alt={title || "Product"}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                {/* Right Content Section - Text */}
                <div className="flex-1 flex flex-col justify-center items-end text-right px-6 sm:px-8 lg:px-9 py-6">
                  {/* Small Label */}
                  {block.label && showLabel && (
                    <div className="mb-3 sm:mb-4 lg:mb-5">
                      <span
                        className="font-bold tracking-[0.2px] leading-6 text-xs sm:text-sm"
                        style={{ color: labelColor }}
                      >
                        {block.label}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  {title && (
                    <h2
                      className="font-bold mb-2 sm:mb-3 leading-7 sm:leading-8 text-xl sm:text-2xl tracking-[0.1px] whitespace-pre-line"
                      style={{ color: titleColor }}
                    >
                      {title}
                    </h2>
                  )}

                  {/* Subtitle */}
                  {block.subtitle && (
                    <p
                      className="mb-4 sm:mb-5 text-xs sm:text-sm font-normal leading-5 tracking-[0.2px]"
                      style={{ color: subtitleColor }}
                    >
                      {block.subtitle}
                    </p>
                  )}

                  {/* Link */}
                  {buttonText && (
                    <a
                      href={block.url || "#"}
                      className="font-bold inline-block hover:opacity-80 transition text-xs sm:text-sm underline leading-6 tracking-[0.2px]"
                      style={{ color: linkColor }}
                    >
                      {buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category2;
