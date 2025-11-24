import React from "react";

interface Block {
  name?: string;
  title?: string;
  count?: string;
  subtitle?: string;
  image?: string;
  titleColor?: string;
  subtitleColor?: string;
  url?: string;
}

interface Category4Props {
  blocks?: Block[];
}

const Category4: React.FC<Category4Props> = ({ blocks = [] }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-8 sm:px-0 pb-8 sm:pb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {blocks.map((category, i) => (
          <a
            key={i}
            href={category.url || "#"}
            className="relative flex flex-col items-center hover:opacity-80 transition"
          >
            {/* Circle Image Container with light gray background */}
            {category.image && (
              <div className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-[140px] h-[140px] sm:w-40 sm:h-40 lg:w-[180px] lg:h-[180px] bg-[#F7F7F7]">
                <img
                  src={category.image}
                  alt={category.name || category.title || "Category"}
                  className="w-full h-full object-cover object-center p-4 sm:p-5 lg:p-6"
                />
              </div>
            )}

            {/* Category Name */}
            {(category.name || category.title) && (
              <h3
                className="font-normal text-center text-base sm:text-lg lg:text-xl tracking-normal leading-6 sm:leading-7 lg:leading-8"
                style={{ color: category.titleColor || "#181D25" }}
              >
                {category.name || category.title}
              </h3>
            )}

            {/* Product Count */}
            {(category.count || category.subtitle) && (
              <p
                className="text-center text-sm sm:text-base tracking-normal line-clamp-2 leading-5 sm:leading-6 font-normal"
                style={{ color: category.subtitleColor || "#666666" }}
              >
                {category.count || category.subtitle}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Category4;
