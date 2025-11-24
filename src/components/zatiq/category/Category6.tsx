import React from "react";

interface Block {
  name?: string;
  title?: string;
  subtitle?: string;
  count?: string;
  productCount?: number;
  linkText?: string;
  buttonText?: string;
  image?: string;
  backgroundImage?: string;
  productImage?: string;
  backgroundColor?: string;
  countColor?: string;
  titleColor?: string;
  linkColor?: string;
  url?: string;
}

interface Category6Settings {
  showProductCount?: boolean;
  defaultCountColor?: string;
  defaultTitleColor?: string;
  defaultLinkColor?: string;
  defaultButtonText?: string;
}

interface Category6Props {
  settings?: Category6Settings;
  blocks?: Block[];
}

const Category6: React.FC<Category6Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showProductCount = true,
    defaultCountColor = "#4E5562",
    defaultTitleColor = "#181D25",
    defaultLinkColor = "#222934",
    defaultButtonText = "Shop now",
  } = settings;

  // Return null if no blocks
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-0 pb-8 sm:pb-14">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {blocks.map((category, i) => {
          const countColor = category.countColor || defaultCountColor;
          const titleColor = category.titleColor || defaultTitleColor;
          const linkColor = category.linkColor || defaultLinkColor;
          const buttonText = category.buttonText || category.linkText || defaultButtonText;
          const title = category.title || category.name || "";

          // Use productImage for the right side image
          const prodImage = category.productImage || category.image;

          // Format product count display
          const countDisplay = showProductCount && category.productCount !== undefined
            ? `${category.productCount} Products`
            : (category.count || "");

          return (
            <div
              key={i}
              className="relative flex-1 min-h-[200px] sm:min-h-[220px] lg:min-h-60 overflow-hidden rounded-lg"
              style={{ backgroundColor: category.backgroundColor || "#FFE8E8" }}
            >
              {/* Two Column Layout */}
              <div className="relative flex h-full">
                {/* Left Text Section - 55% */}
                <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-7 lg:px-8 py-6 z-10 max-w-[55%]">
                  {/* Product Count */}
                  {showProductCount && countDisplay && (
                    <p
                      className="mb-2 sm:mb-3 text-[11px] sm:text-xs leading-4 tracking-normal font-normal"
                      style={{ color: countColor }}
                    >
                      {countDisplay}
                    </p>
                  )}

                  {/* Title */}
                  {title && (
                    <h2
                      className="font-semibold mb-3 sm:mb-4 leading-6 sm:leading-7 text-lg sm:text-xl tracking-normal line-clamp-2"
                      style={{ color: titleColor }}
                    >
                      {title}
                    </h2>
                  )}

                  {/* Link with Arrow */}
                  {buttonText && (
                    <a
                      href={category.url || "#"}
                      className="inline-flex items-center gap-2 hover:opacity-80 transition text-xs sm:text-sm tracking-normal leading-5 font-medium"
                      style={{ color: linkColor }}
                    >
                      {buttonText}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.58687 3.58748C5.81468 3.35967 6.18402 3.35967 6.41183 3.58748L10.4118 7.58748C10.6396 7.81529 10.6396 8.18463 10.4118 8.41244L6.41183 12.4124C6.18402 12.6402 5.81468 12.6402 5.58687 12.4124C5.35906 12.1846 5.35906 11.8153 5.58687 11.5875L9.17439 7.99996L5.58687 4.41244C5.35906 4.18463 5.35906 3.81529 5.58687 3.58748Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Right Image Section - 45% */}
                {prodImage && (
                  <div className="absolute right-0 top-0 bottom-0 w-[45%] flex items-end justify-end">
                    <img
                      src={prodImage}
                      alt={title || "Product"}
                      className="w-full h-full object-cover object-bottom-right"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category6;
