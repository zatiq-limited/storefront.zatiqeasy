import React from "react";

interface Block {
  name?: string;
  title?: string;
  image?: string;
  productImage?: string;
  titleColor?: string;
  url?: string;
  productCount?: number;
}

interface Category5Settings {
  showProductCount?: boolean;
  showBackground?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  countColor?: string;
}

interface Category5Props {
  settings?: Category5Settings;
  blocks?: Block[];
}

const Category5: React.FC<Category5Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showProductCount = false,
    showBackground = true,
    backgroundColor = "#F5F5F8",
    titleColor: defaultTitleColor = "#181D25",
    countColor = "#666666",
  } = settings;

  // Return null if no blocks
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-0 lg:px-8 py-6 pb-8 sm:pb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {blocks.map((category, i) => {
          const titleColor = category.titleColor || defaultTitleColor;
          // Use productImage if available, fallback to image
          const categoryImage = category.productImage || category.image;

          return (
            <a
              key={i}
              href={category.url || "#"}
              className="relative flex flex-col items-center hover:opacity-80 transition"
            >
              {/* Circle Image Container with light background */}
              {categoryImage && (
                <div
                  className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40"
                  style={{ backgroundColor: showBackground ? backgroundColor : "transparent" }}
                >
                  <img
                    src={categoryImage}
                    alt={category.name || category.title || "Category"}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Category Name */}
              {(category.name || category.title) && (
                <h3
                  className="font-semibold text-center text-sm sm:text-base tracking-normal leading-5 sm:leading-6"
                  style={{ color: titleColor }}
                >
                  {category.name || category.title}
                </h3>
              )}

              {/* Product Count */}
              {showProductCount && category.productCount !== undefined && (
                <p
                  className="text-xs sm:text-sm text-center mt-1"
                  style={{ color: countColor }}
                >
                  {category.productCount} products
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Category5;
